-- Content Library: core schema (Phase 1)
-- Enum-like fields use text + CHECK so values can evolve with a simple migration.

create schema if not exists extensions;
create extension if not exists unaccent with schema extensions;
create extension if not exists pg_trgm with schema extensions;

-- Immutable wrapper so unaccent can be used in generated columns and indexes.
create or replace function public.f_unaccent(text) returns text
language sql immutable parallel safe strict
set search_path = public, extensions
as $$ select extensions.unaccent('extensions.unaccent'::regdictionary, $1) $$;

create or replace function public.norm_text(text) returns text
language sql immutable parallel safe
as $$ select lower(public.f_unaccent(coalesce($1, ''))) $$;

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

-- Provenance: one row per original workbook row, raw values + hyperlink targets.
create table public.source_record (
  id            bigint generated always as identity primary key,
  workbook      text not null,
  sheet         text not null,
  row_number    int  not null,
  raw           jsonb not null,
  imported_at   timestamptz not null default now(),
  content_id    uuid,
  idea_id       uuid,
  inspiration_id uuid,
  import_note   text,
  unique (workbook, sheet, row_number)
);

-- Accounts are data, not code: platform logic never hardcodes handles.
create table public.account (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null check (platform in ('instagram','tiktok','youtube')),
  handle      text not null,
  label       text,
  is_primary  boolean not null default false,
  active      boolean not null default true,
  unique (platform, handle)
);

create table public.content (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  kind            text not null default 'short' check (kind in ('short','long','live','other')),
  status          text not null default 'idea' check (status in
                    ('idea','needs_footage','ready_to_edit','editing','edited','scheduled','published','archived')),
  priority        text check (priority in ('alta','media','baixa')),
  visibility      text not null default 'private' check (visibility in ('private','public')),
  language        text default 'pt',
  country         text,
  region          text,
  destination     text,
  format          text,
  topics          text[] not null default '{}',
  season          text,
  notes           text,
  editor          text,
  audio_notes     text,
  references_text text,
  needs_review    boolean not null default false,
  -- knowledge fields (filled manually now, generated later)
  summary         text,
  key_points      text[] not null default '{}',
  keywords        text[] not null default '{}',
  places          text[] not null default '{}',
  brands          text[] not null default '{}',
  products        text[] not null default '{}',
  -- search (maintained by triggers in 0003)
  search_tsv      tsvector,
  search_title    text generated always as (public.norm_text(title)) stored,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger content_updated before update on public.content
  for each row execute function public.set_updated_at();

create table public.publication (
  id               uuid primary key default gen_random_uuid(),
  content_id       uuid references public.content(id) on delete cascade,
  platform         text not null check (platform in ('instagram','tiktok','youtube','youtube_short')),
  account_id       uuid references public.account(id),  -- null = attribution uncertain
  status           text not null default 'unknown' check (status in ('published','pending','skipped','unknown')),
  platform_id      text,
  url              text,
  title            text,
  caption          text,
  published_at     timestamptz,
  published_at_raw text,
  date_confidence  text not null default 'none' check (date_confidence in ('high','inferred','none')),
  posted_by        text,
  parts            int,
  duration_s       int,
  metrics          jsonb,
  metrics_at       timestamptz,
  flags            text[] not null default '{}',   -- e.g. repost, ja_tem, account_uncertain
  notes            text,
  visibility       text not null default 'private' check (visibility in ('private','public')),
  source_record_id bigint references public.source_record(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create unique index publication_platform_id_uq on public.publication (platform, platform_id) where platform_id is not null;
create index publication_content_idx on public.publication (content_id);
create trigger publication_updated before update on public.publication
  for each row execute function public.set_updated_at();

create table public.asset (
  id               uuid primary key default gen_random_uuid(),
  content_id       uuid not null references public.content(id) on delete cascade,
  type             text not null check (type in
                     ('photos_album','drive_folder','drive_file','canva','voiceover','final_edit','audio_ref','reference','other')),
  url              text,
  label            text,
  note             text,
  source_record_id bigint references public.source_record(id) on delete set null,
  created_at       timestamptz not null default now(),
  check (url is not null or label is not null)
);
create index asset_content_idx on public.asset (content_id);

create table public.transcript (
  id          uuid primary key default gen_random_uuid(),
  content_id  uuid not null references public.content(id) on delete cascade,
  text        text not null,
  language    text,
  source      text not null default 'manual' check (source in ('youtube_captions','import','manual','stt')),
  status      text not null default 'raw' check (status in ('raw','reviewed')),
  provider    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index transcript_content_idx on public.transcript (content_id);
create trigger transcript_updated before update on public.transcript
  for each row execute function public.set_updated_at();

create table public.idea (
  id                     uuid primary key default gen_random_uuid(),
  title                  text not null,
  notes                  text,
  kind                   text check (kind in ('short','long','other')),
  status                 text not null default 'new' check (status in ('new','maybe','promoted','discarded')),
  promoted_to_content_id uuid references public.content(id) on delete set null,
  search_tsv             tsvector generated always as
                           (to_tsvector('simple', public.norm_text(title || ' ' || coalesce(notes, '')))) stored,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index idea_tsv_idx on public.idea using gin (search_tsv);
create trigger idea_updated before update on public.idea
  for each row execute function public.set_updated_at();

create table public.inspiration (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  url            text,
  platform       text,
  creator_handle text,
  notes          text,
  idea_id        uuid references public.idea(id) on delete set null,
  search_tsv     tsvector generated always as
                   (to_tsvector('simple', public.norm_text(title || ' ' || coalesce(creator_handle, '') || ' ' || coalesce(notes, '')))) stored,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index inspiration_tsv_idx on public.inspiration using gin (search_tsv);
create trigger inspiration_updated before update on public.inspiration
  for each row execute function public.set_updated_at();

alter table public.source_record
  add foreign key (content_id) references public.content(id) on delete set null,
  add foreign key (idea_id) references public.idea(id) on delete set null,
  add foreign key (inspiration_id) references public.inspiration(id) on delete set null;
create index source_record_content_idx on public.source_record (content_id);

-- Review queue: uncertain duplicates are never merged automatically.
create table public.match_candidate (
  id           bigint generated always as identity primary key,
  content_a_id uuid references public.content(id) on delete set null,
  content_b_id uuid references public.content(id) on delete set null,  -- null after a merge removed it
  score        real not null,
  reasons      jsonb not null default '{}',
  decision     text not null default 'pending' check (decision in ('pending','merged','separate')),
  decided_at   timestamptz,
  created_at   timestamptz not null default now(),
  check (content_a_id <> content_b_id),
  unique (content_a_id, content_b_id)
);

insert into public.account (platform, handle, label, is_primary) values
  ('instagram', 'camilamontreal', 'Principal', true),
  ('instagram', 'mundodacami',    'Disney', false),
  ('instagram', 'bonjourhicami',  'English / UGC', false),
  ('tiktok',    'camilamontreal', 'Principal', true),
  ('youtube',   'camilamontreal', 'Principal', true);
