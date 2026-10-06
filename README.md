# Biblioteca de Conteúdo

This is a private content library built with Next.js and Supabase (Postgres, Auth and Row Level Security). It has a single owner: only the user listed in `app_owner` can read or write any data.

## Setup (one time)

1. **Create a Supabase project** (free tier is fine). Then, in the **SQL Editor**, run the three files in `supabase/migrations/` in order: `0001`, then `0002`, then `0003`.
2. **Configure Auth**: go to Auth → Sign In / Providers and **turn off "Allow new users to sign up"**. Then go to Auth → Users → **Add user** and enter your e-mail and a password.
3. **Register yourself as the owner**: run this in the SQL Editor, using your own e-mail:
   ```sql
   insert into public.app_owner (user_id)
   select id from auth.users where email = 'YOUR-EMAIL';
   ```
4. **Set environment variables**: copy `.env.example` to `.env.local` and fill in the values from Settings → API. Only use the *anon/publishable* key. The service-role key is never used by the app.
5. **Run it locally**: `npm install`, then `npm run dev`.

## Deploy

The app is a standard Next.js app and uses no host-specific features. On Vercel, import the repo and set the two environment variables. Any other Node host works with `npm run build`, then `npm start`.

## Database overview

- `content` is the creative unit. It has publications (`publication`, one row per platform/account), files (`asset`) and transcripts (`transcript`).
- `account` lists the social handles. Publications reference it, so no account is hardcoded in the app.
- `idea` holds your own ideas. `inspiration` holds other creators' content.
- `source_record` keeps every original workbook row with its raw values (provenance).
- `match_candidate` is the review queue. Content is merged only through `merge_content(keep, drop)` after you decide.
- Search uses `search_content(q, ...)`, a weighted full-text index (title above topics, notes and captions, which rank above transcript) combined with fuzzy title matching. Accents and typos are tolerated.
- `v_distribution` shows the best status per platform for each content record. Example filter: `dist->>'instagram' = 'published' and dist->>'tiktok' is distinct from 'published'`.
