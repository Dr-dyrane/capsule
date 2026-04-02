create extension if not exists pgcrypto with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  source_url text not null,
  status text not null default 'uploading' check (status in ('uploading', 'processing', 'generating', 'complete', 'error')),
  point_count integer not null default 0,
  card_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.points (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  text text not null,
  category text,
  concept text,
  sort_order integer not null,
  card_count integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  point_id uuid references public.points(id) on delete cascade not null,
  session_id uuid references public.sessions(id) on delete cascade not null,
  image_url text not null,
  title text,
  card_order integer not null default 1,
  status text not null default 'queued' check (status in ('queued', 'generating', 'complete', 'error')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_sessions_user on public.sessions(user_id);
create index if not exists idx_sessions_created_at on public.sessions(created_at desc);
create index if not exists idx_points_session on public.points(session_id);
create index if not exists idx_points_sort_order on public.points(session_id, sort_order);
create index if not exists idx_cards_session on public.cards(session_id);
create index if not exists idx_cards_point on public.cards(point_id);
create index if not exists idx_cards_status_created_at on public.cards(status, created_at desc);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.sessions to authenticated;
grant select, insert, update, delete on public.points to authenticated;
grant select, insert, update, delete on public.cards to authenticated;

alter table public.sessions enable row level security;
alter table public.points enable row level security;
alter table public.cards enable row level security;

drop policy if exists "sessions_select_own" on public.sessions;
create policy "sessions_select_own"
on public.sessions
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "sessions_insert_own" on public.sessions;
create policy "sessions_insert_own"
on public.sessions
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "sessions_update_own" on public.sessions;
create policy "sessions_update_own"
on public.sessions
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "sessions_delete_own" on public.sessions;
create policy "sessions_delete_own"
on public.sessions
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "points_select_own" on public.points;
create policy "points_select_own"
on public.points
for select
to authenticated
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = points.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "points_insert_own" on public.points;
create policy "points_insert_own"
on public.points
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sessions
    where sessions.id = points.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "points_update_own" on public.points;
create policy "points_update_own"
on public.points
for update
to authenticated
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = points.session_id
      and sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.sessions
    where sessions.id = points.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "points_delete_own" on public.points;
create policy "points_delete_own"
on public.points
for delete
to authenticated
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = points.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "cards_select_own" on public.cards;
create policy "cards_select_own"
on public.cards
for select
to authenticated
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = cards.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "cards_insert_own" on public.cards;
create policy "cards_insert_own"
on public.cards
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sessions
    where sessions.id = cards.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "cards_update_own" on public.cards;
create policy "cards_update_own"
on public.cards
for update
to authenticated
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = cards.session_id
      and sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.sessions
    where sessions.id = cards.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "cards_delete_own" on public.cards;
create policy "cards_delete_own"
on public.cards
for delete
to authenticated
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = cards.session_id
      and sessions.user_id = auth.uid()
  )
);

drop trigger if exists set_sessions_updated_at on public.sessions;
create trigger set_sessions_updated_at
before update on public.sessions
for each row
execute function public.set_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'sessions'
  ) then
    alter publication supabase_realtime add table public.sessions;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'points'
  ) then
    alter publication supabase_realtime add table public.points;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'cards'
  ) then
    alter publication supabase_realtime add table public.cards;
  end if;
end
$$;

insert into storage.buckets (id, name, public)
values ('notes', 'notes', false)
on conflict (id) do update
set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('cards', 'cards', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "notes_select_own" on storage.objects;
create policy "notes_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'notes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "notes_insert_own" on storage.objects;
create policy "notes_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'notes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "notes_update_own" on storage.objects;
create policy "notes_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'notes'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'notes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "notes_delete_own" on storage.objects;
create policy "notes_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'notes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "cards_select_own_storage" on storage.objects;
create policy "cards_select_own_storage"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'cards'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "cards_insert_own_storage" on storage.objects;
create policy "cards_insert_own_storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'cards'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "cards_update_own_storage" on storage.objects;
create policy "cards_update_own_storage"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'cards'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'cards'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "cards_delete_own_storage" on storage.objects;
create policy "cards_delete_own_storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'cards'
  and (storage.foldername(name))[1] = auth.uid()::text
);
