-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  username text unique,
  avatar_url text,
  auto_publish boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now())
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "profiles_select_public" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid());

-- Trigger for creating profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update cards table
alter table public.cards add column visibility text not null default 'private' check (visibility in ('private', 'published'));
alter table public.cards add column published_at timestamptz;
alter table public.cards add column published_by uuid references public.profiles(id);
alter table public.cards add column community_template text;
alter table public.cards add column community_hash text;

-- Update sessions table
alter table public.sessions add column visibility text not null default 'private' check (visibility in ('private', 'published'));

-- Add public access policies for cards
drop policy if exists "cards_select_public" on public.cards;
create policy "cards_select_public"
on public.cards
for select
to authenticated, anon
using (visibility = 'published');

-- Add public access policies for sessions
drop policy if exists "sessions_select_public" on public.sessions;
create policy "sessions_select_public"
on public.sessions
for select
to authenticated, anon
using (visibility = 'published');

-- Make cards storage bucket public for community access
update storage.buckets set public = true where id = 'cards';

-- Update storage policies for the cards bucket
-- Allow public select access to the cards bucket
drop policy if exists "cards_public_select" on storage.objects;
create policy "cards_public_select"
on storage.objects
for select
to authenticated, anon
using (bucket_id = 'cards');
