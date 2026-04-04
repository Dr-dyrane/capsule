create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null,
  card_id uuid null references public.cards(id) on delete set null,
  session_id uuid null references public.sessions(id) on delete set null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_product_events_user_created
on public.product_events (user_id, created_at desc);

create index if not exists idx_product_events_name_created
on public.product_events (event_name, created_at desc);

create index if not exists idx_product_events_card_name
on public.product_events (card_id, event_name, created_at desc)
where card_id is not null;

grant select, insert on public.product_events to authenticated;

alter table public.product_events enable row level security;

drop policy if exists "product_events_select_own" on public.product_events;
create policy "product_events_select_own"
on public.product_events
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "product_events_insert_own" on public.product_events;
create policy "product_events_insert_own"
on public.product_events
for insert
to authenticated
with check (user_id = auth.uid());
