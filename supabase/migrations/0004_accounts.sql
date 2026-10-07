-- Accounts without a known handle (e.g. the dog's TikTok, "TT Baby") are identified by label until filled in.
alter table public.account alter column handle drop not null;
alter table public.account add constraint account_handle_or_label check (handle is not null or label is not null);
create unique index account_platform_label_uq on public.account (platform, label) where handle is null;

insert into public.account (platform, handle, label, is_primary) values ('tiktok', null, 'TT Baby', false);
