-- Core migration 3/3: community, publishing, remix, and moderation
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  username text unique,
  avatar_url text,
  auto_publish boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now())
);

grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

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
alter table public.sessions add column if not exists remix_source_card_id uuid references public.cards(id) on delete set null;

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

create index if not exists idx_sessions_remix_source_card_id
on public.sessions (remix_source_card_id);

drop policy if exists "cards_select_public" on public.cards;
drop policy if exists "cards_select_published" on public.cards;
create policy "cards_select_public"
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

create index if not exists idx_cards_published_feed
on public.cards (published_at desc, id desc)
where visibility = 'published' and status = 'complete';

create index if not exists idx_cards_published_by_feed
on public.cards (published_by, published_at desc)
where visibility = 'published' and status = 'complete';

create index if not exists idx_cards_community_hash_published
on public.cards (community_hash)
where community_hash is not null and visibility = 'published';

create table if not exists public.community_reactions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (card_id, user_id, kind)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.community_reactions'::regclass
      and conname = 'community_reactions_kind_check'
  ) then
    alter table public.community_reactions
      add constraint community_reactions_kind_check
      check (kind in ('like', 'save'));
  end if;
end
$$;

grant select, insert, delete on public.community_reactions to authenticated;

alter table public.community_reactions enable row level security;

drop policy if exists "community_reactions_select_own" on public.community_reactions;
create policy "community_reactions_select_own"
on public.community_reactions
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "community_reactions_insert_own" on public.community_reactions;
create policy "community_reactions_insert_own"
on public.community_reactions
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "community_reactions_delete_own" on public.community_reactions;
create policy "community_reactions_delete_own"
on public.community_reactions
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists idx_community_reactions_card_kind
on public.community_reactions (card_id, kind);

create index if not exists idx_community_reactions_user_kind
on public.community_reactions (user_id, kind);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (card_id, user_id)
);

grant select, insert on public.community_reports to authenticated;

alter table public.community_reports enable row level security;

drop policy if exists "community_reports_select_own" on public.community_reports;
create policy "community_reports_select_own"
on public.community_reports
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "community_reports_insert_own" on public.community_reports;
create policy "community_reports_insert_own"
on public.community_reports
for insert
to authenticated
with check (user_id = auth.uid());

create or replace view public.community_index as
select
  c.id as card_id,
  c.session_id,
  c.image_url,
  c.title,
  c.published_at,
  c.published_by,
  coalesce(c.community_template, 'mechanism-board') as community_template,
  p.username as author_name,
  p.avatar_url as author_avatar_url,
  coalesce(reactions.like_count, 0) as like_count,
  coalesce(reactions.save_count, 0) as save_count,
  (
    (coalesce(reactions.like_count, 0) * 3)
    + (coalesce(reactions.save_count, 0) * 5)
    + greatest(
      0,
      72 - floor(extract(epoch from (timezone('utc', now()) - coalesce(c.published_at, c.created_at))) / 3600)
    )
  )::double precision as trend_score,
  pt.category,
  pt.concept,
  coalesce(reports.report_count, 0) as report_count
from public.cards c
left join public.points pt
  on pt.id = c.point_id
left join public.profiles p
  on p.id = c.published_by
left join lateral (
  select
    count(*) filter (where cr.kind = 'like')::integer as like_count,
    count(*) filter (where cr.kind = 'save')::integer as save_count
  from public.community_reactions cr
  where cr.card_id = c.id
) reactions
  on true
left join lateral (
  select count(*)::integer as report_count
  from public.community_reports reports
  where reports.card_id = c.id
) reports
  on true
where c.visibility = 'published'
  and c.status = 'complete';

grant select on public.community_index to anon, authenticated;

create policy "cards_select_published_storage"
on storage.objects
for select
to authenticated, anon
using (
  bucket_id = 'cards'
  and exists (
    select 1
    from public.community_index
    where community_index.image_url = storage.objects.name
  )
);
