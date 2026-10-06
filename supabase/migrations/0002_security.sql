-- Single-owner security model.
-- Every table: RLS on, access only for the user listed in app_owner.
-- anon (public key) gets nothing. A future team/role model replaces is_owner()
-- with a membership check; tables and app code stay the same.

create table public.app_owner (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_owner() returns boolean
language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.app_owner where user_id = auth.uid()) $$;

revoke all on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

alter table public.app_owner enable row level security;
create policy owner_self on public.app_owner for select to authenticated
  using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['source_record','account','content','publication','asset',
                           'transcript','idea','inspiration','match_candidate']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('create policy owner_all on public.%I for all to authenticated
                    using (public.is_owner()) with check (public.is_owner())', t);
  end loop;
end $$;

revoke all on public.app_owner from anon;

-- Search uses unaccent/pg_trgm from the extensions schema (Supabase grants this by default; explicit here).
grant usage on schema extensions to authenticated;
