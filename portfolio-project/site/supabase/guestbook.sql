-- Livro de visitas do portfólio (app Notas).
-- Como usar: Supabase → SQL Editor → cole tudo e rode (uma vez).
-- Depois: Settings → API → copie a "Project URL" e a chave "anon / publishable" para site/.env.local
--   VITE_SUPABASE_URL=...
--   VITE_SUPABASE_ANON_KEY=...
-- Nunca coloque a chave service_role no site.

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  message text not null check (char_length(message) between 2 and 280),
  lang text check (lang in ('en', 'pt', 'fr')),
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  -- mesmas regras do site: sem links
  constraint guestbook_no_links check (
    message !~* '(https?://|www\.)' and name !~* '(https?://|www\.)'
  )
);

alter table public.guestbook enable row level security;

-- Qualquer visitante lê os recados visíveis e escreve um novo. Ninguém altera nem apaga pelo site.
drop policy if exists "guestbook read visible" on public.guestbook;
create policy "guestbook read visible" on public.guestbook for select to anon using (hidden = false);
drop policy if exists "guestbook insert" on public.guestbook;
create policy "guestbook insert" on public.guestbook for insert to anon with check (hidden = false);

-- Permissões por coluna: o visitante nunca consegue definir `hidden` nem ler `lang`.
revoke all on public.guestbook from anon, authenticated;
grant select (id, name, message, created_at) on public.guestbook to anon;
grant insert (name, message, lang) on public.guestbook to anon;

-- Freio contra enxurrada: no máximo 20 recados por minuto no total.
create or replace function public.guestbook_flood_guard() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.guestbook where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'too many notes, try again soon';
  end if;
  return new;
end $$;
drop trigger if exists guestbook_flood on public.guestbook;
create trigger guestbook_flood before insert on public.guestbook for each row execute function public.guestbook_flood_guard();

-- Para esconder um recado: Table Editor → guestbook → marque hidden = true (ou apague a linha).
