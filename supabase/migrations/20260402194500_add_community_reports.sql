create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (card_id, user_id)
);

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
