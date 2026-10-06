-- Search foundations: weighted full-text (tsvector) + trigram fuzzy title match.
-- Weights: A title/keywords/places, B topics/summary/entities, C notes/captions, D transcripts.
-- 'simple' config + unaccent: works for PT/EN/FR without language-specific stemming.

create or replace function public.content_search_vector(c public.content) returns tsvector
language sql stable
set search_path = public, extensions
as $$
  select
    setweight(to_tsvector('simple', norm_text(concat_ws(' ', c.title, array_to_string(c.keywords, ' '),
      c.destination, c.country, c.region, array_to_string(c.places, ' ')))), 'A') ||
    setweight(to_tsvector('simple', norm_text(concat_ws(' ', array_to_string(c.topics, ' '), c.format, c.season,
      c.summary, array_to_string(c.key_points, ' '), array_to_string(c.brands, ' '),
      array_to_string(c.products, ' ')))), 'B') ||
    setweight(to_tsvector('simple', norm_text(concat_ws(' ', c.notes, c.audio_notes,
      (select string_agg(concat_ws(' ', p.title, p.caption, p.notes), ' ')
         from publication p where p.content_id = c.id)))), 'C') ||
    setweight(to_tsvector('simple', norm_text(
      (select string_agg(t.text, ' ') from transcript t where t.content_id = c.id))), 'D')
$$;

create or replace function public.content_search_trg() returns trigger
language plpgsql as $$
begin
  new.search_tsv := public.content_search_vector(new);
  return new;
end $$;

create trigger content_search before insert or update on public.content
  for each row execute function public.content_search_trg();

-- Child rows (publications, transcripts) refresh their parent's search vector.
create or replace function public.touch_content_search() returns trigger
language plpgsql as $$
begin
  if tg_op in ('UPDATE','DELETE') and old.content_id is not null then
    update public.content set search_tsv = null where id = old.content_id;
  end if;
  if tg_op in ('INSERT','UPDATE') and new.content_id is not null
     and (tg_op = 'INSERT' or new.content_id is distinct from old.content_id) then
    update public.content set search_tsv = null where id = new.content_id;
  end if;
  return null;
end $$;

create trigger publication_search after insert or update or delete on public.publication
  for each row execute function public.touch_content_search();
create trigger transcript_search after insert or update or delete on public.transcript
  for each row execute function public.touch_content_search();

create index content_tsv_idx on public.content using gin (search_tsv);
create index content_title_trgm_idx on public.content using gin (search_title extensions.gin_trgm_ops);
create index content_status_idx on public.content (status);

-- Prefix query from free text: "cosmet japao" -> 'cosmet':* & 'japao':*  (search-as-you-type)
create or replace function public.prefix_tsquery(q text) returns tsquery
language sql immutable
as $$
  select case when count(*) = 0 then null
    else to_tsquery('simple', string_agg(quote_literal(w) || ':*', ' & ')) end
  from regexp_split_to_table(public.norm_text(q), '[^[:alnum:]]+') w
  where w <> ''
$$;

-- Main Library search. Runs as the caller, so RLS applies.
create or replace function public.search_content(
  q text default '',
  p_status text default null,
  p_kind text default null,
  p_platform text default null,
  p_account uuid default null,
  p_limit int default 50,
  p_offset int default 0
) returns table (
  id uuid, title text, status text, kind text, destination text, country text,
  topics text[], needs_review boolean, rank real, publications jsonb
)
language sql stable
set search_path = public, extensions
as $$
  with params as (select prefix_tsquery(q) as tsq, norm_text(q) as nq)
  select c.id, c.title, c.status, c.kind, c.destination, c.country, c.topics, c.needs_review,
         (case when p.tsq is null then 0 else ts_rank(c.search_tsv, p.tsq) end
          + case when p.nq = '' then 0 else word_similarity(p.nq, c.search_title) end)::real as rank,
         coalesce((select jsonb_agg(jsonb_build_object(
                     'platform', pb.platform, 'handle', a.handle, 'status', pb.status,
                     'url', pb.url, 'published_at', pb.published_at)
                   order by pb.platform, pb.published_at)
                   from publication pb left join account a on a.id = pb.account_id
                   where pb.content_id = c.id), '[]'::jsonb) as publications
  from content c, params p
  where (p.nq = '' or c.search_tsv @@ p.tsq or p.nq <% c.search_title)
    and (p_status is null or c.status = p_status)
    and (p_kind is null or c.kind = p_kind)
    and (p_platform is null and p_account is null or exists (
          select 1 from publication x
          where x.content_id = c.id and x.status = 'published'
            and (p_platform is null or x.platform = p_platform)
            and (p_account is null or x.account_id = p_account)))
  order by rank desc, c.updated_at desc
  limit p_limit offset p_offset
$$;

-- Distribution: best status per platform (published > pending > unknown > skipped),
-- plus per-account detail. Filter e.g. dist->>instagram = 'published' and dist->>tiktok is distinct from 'published'.
create or replace view public.v_distribution with (security_invoker = true) as
select c.id, c.title, c.status, c.kind, c.updated_at,
  coalesce((select jsonb_object_agg(platform, best) from (
     select p.platform,
            (array_agg(p.status order by array_position(array['published','pending','unknown','skipped'], p.status)))[1] as best
     from publication p where p.content_id = c.id group by p.platform) s), '{}'::jsonb) as dist,
  coalesce((select jsonb_agg(jsonb_build_object('platform', p.platform, 'handle', a.handle,
             'status', p.status, 'url', p.url, 'published_at', p.published_at, 'raw', p.published_at_raw))
     from publication p left join account a on a.id = p.account_id where p.content_id = c.id), '[]'::jsonb) as detail
from public.content c;

-- Merge two content records after human review. Moves every child row; nothing is deleted except the
-- emptied duplicate. Empty fields on the kept record are filled from the dropped one.
create or replace function public.merge_content(p_keep uuid, p_drop uuid) returns void
language plpgsql
set search_path = public
as $$
declare d content;
begin
  if p_keep = p_drop then raise exception 'cannot merge a record into itself'; end if;
  select * into d from content where id = p_drop for update;
  if not found then raise exception 'content % not found', p_drop; end if;

  update publication set content_id = p_keep where content_id = p_drop;
  update asset set content_id = p_keep where content_id = p_drop;
  update transcript set content_id = p_keep where content_id = p_drop;
  update source_record set content_id = p_keep where content_id = p_drop;
  update idea set promoted_to_content_id = p_keep where promoted_to_content_id = p_drop;

  update content k set
    priority = coalesce(k.priority, d.priority),
    country = coalesce(k.country, d.country),
    region = coalesce(k.region, d.region),
    destination = coalesce(k.destination, d.destination),
    format = coalesce(k.format, d.format),
    season = coalesce(k.season, d.season),
    editor = coalesce(k.editor, d.editor),
    summary = coalesce(k.summary, d.summary),
    audio_notes = nullif(concat_ws(E'\n', k.audio_notes, d.audio_notes), ''),
    references_text = nullif(concat_ws(E'\n', k.references_text, d.references_text), ''),
    notes = concat_ws(E'\n', k.notes, d.notes, '[mesclado: ' || d.title || ']'),
    topics = array(select distinct unnest(k.topics || d.topics)),
    keywords = array(select distinct unnest(k.keywords || d.keywords)),
    places = array(select distinct unnest(k.places || d.places)),
    brands = array(select distinct unnest(k.brands || d.brands)),
    products = array(select distinct unnest(k.products || d.products))
  where k.id = p_keep;

  update match_candidate set decision = 'merged', decided_at = now(),
         reasons = reasons || jsonb_build_object('merged_title', d.title, 'kept_id', p_keep)
   where (content_a_id = p_keep and content_b_id = p_drop) or (content_a_id = p_drop and content_b_id = p_keep);
  -- Re-point other pending candidates of the dropped record; drop ones that would become self/duplicate pairs.
  delete from match_candidate m where m.decision = 'pending' and (
      (m.content_a_id = p_drop and (m.content_b_id = p_keep or exists (select 1 from match_candidate x where x.content_a_id = p_keep and x.content_b_id = m.content_b_id)))
   or (m.content_b_id = p_drop and (m.content_a_id = p_keep or exists (select 1 from match_candidate x where x.content_a_id = m.content_a_id and x.content_b_id = p_keep))));
  update match_candidate set content_a_id = p_keep where content_a_id = p_drop and decision = 'pending';
  update match_candidate set content_b_id = p_keep where content_b_id = p_drop and decision = 'pending';

  delete from content where id = p_drop;
end $$;

grant execute on function public.search_content(text, text, text, text, uuid, int, int) to authenticated;
grant execute on function public.merge_content(uuid, uuid) to authenticated;
revoke execute on function public.search_content(text, text, text, text, uuid, int, int) from anon, public;
revoke execute on function public.merge_content(uuid, uuid) from anon, public;
revoke all on public.v_distribution from anon;
