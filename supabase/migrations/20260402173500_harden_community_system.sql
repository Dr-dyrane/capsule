create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  username text unique,
  avatar_url text,
  auto_publish boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
on public.profiles
for select
to authenticated, anon
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set
    username = coalesce(excluded.username, public.profiles.username),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, username, avatar_url)
select
  users.id,
  coalesce(nullif(users.raw_user_meta_data->>'full_name', ''), split_part(users.email, '@', 1)),
  users.raw_user_meta_data->>'avatar_url'
from auth.users as users
on conflict (id) do update
set
  username = coalesce(excluded.username, public.profiles.username),
  avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
  updated_at = timezone('utc', now());

alter table public.cards add column if not exists visibility text;
alter table public.cards add column if not exists published_at timestamptz;
alter table public.cards add column if not exists published_by uuid;
alter table public.cards add column if not exists community_template text;
alter table public.cards add column if not exists community_hash text;

update public.cards
set visibility = 'private'
where visibility is null;

alter table public.cards alter column visibility set default 'private';
alter table public.cards alter column visibility set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.cards'::regclass
      and conname = 'cards_visibility_check'
  ) then
    alter table public.cards
      add constraint cards_visibility_check
      check (visibility in ('private', 'published'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.cards'::regclass
      and conname = 'cards_published_by_fkey'
  ) then
    alter table public.cards
      add constraint cards_published_by_fkey
      foreign key (published_by) references public.profiles(id) on delete set null;
  end if;
end
$$;

alter table public.sessions add column if not exists visibility text;

update public.sessions
set visibility = 'private'
where visibility is null;

alter table public.sessions alter column visibility set default 'private';
alter table public.sessions alter column visibility set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.sessions'::regclass
      and conname = 'sessions_visibility_check'
  ) then
    alter table public.sessions
      add constraint sessions_visibility_check
      check (visibility in ('private', 'published'));
  end if;
end
$$;

drop policy if exists "cards_select_public" on public.cards;
drop policy if exists "cards_select_published" on public.cards;
create policy "cards_select_published"
on public.cards
for select
to authenticated, anon
using (visibility = 'published' and status = 'complete');

drop policy if exists "sessions_select_public" on public.sessions;

update storage.buckets
set public = false
where id = 'cards';

drop policy if exists "cards_public_select" on storage.objects;
drop policy if exists "cards_select_published_storage" on storage.objects;
create policy "cards_select_published_storage"
on storage.objects
for select
to authenticated, anon
using (
  bucket_id = 'cards'
  and exists (
    select 1
    from public.cards
    where cards.image_url = storage.objects.name
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

create index if not exists idx_cards_published_feed
on public.cards (published_at desc, id desc)
where visibility = 'published' and status = 'complete';

create index if not exists idx_cards_published_by_feed
on public.cards (published_by, published_at desc)
where visibility = 'published' and status = 'complete';

create index if not exists idx_cards_community_hash_published
on public.cards (community_hash)
where community_hash is not null and visibility = 'published';
