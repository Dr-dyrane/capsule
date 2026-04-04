create table if not exists public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  source_type text not null default 'generated',
  state text not null default 'new',
  last_score text,
  last_reviewed_at timestamptz,
  next_review_at timestamptz not null default timezone('utc', now()),
  review_count integer not null default 0,
  lapse_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, card_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_items'::regclass
      and conname = 'review_items_source_type_check'
  ) then
    alter table public.review_items
      add constraint review_items_source_type_check
      check (source_type in ('generated', 'saved_community'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_items'::regclass
      and conname = 'review_items_state_check'
  ) then
    alter table public.review_items
      add constraint review_items_state_check
      check (state in ('new', 'learning', 'review'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_items'::regclass
      and conname = 'review_items_last_score_check'
  ) then
    alter table public.review_items
      add constraint review_items_last_score_check
      check (last_score in ('again', 'good', 'easy') or last_score is null);
  end if;
end
$$;

create index if not exists idx_review_items_user_due
on public.review_items (user_id, next_review_at asc);

create index if not exists idx_review_items_card
on public.review_items (card_id);

grant select, insert, update, delete on public.review_items to authenticated;

alter table public.review_items enable row level security;

drop policy if exists "review_items_select_own" on public.review_items;
create policy "review_items_select_own"
on public.review_items
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "review_items_insert_own" on public.review_items;
create policy "review_items_insert_own"
on public.review_items
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.cards
    join public.sessions
      on sessions.id = cards.session_id
    where cards.id = review_items.card_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "review_items_update_own" on public.review_items;
create policy "review_items_update_own"
on public.review_items
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "review_items_delete_own" on public.review_items;
create policy "review_items_delete_own"
on public.review_items
for delete
to authenticated
using (user_id = auth.uid());

drop trigger if exists set_review_items_updated_at on public.review_items;
create trigger set_review_items_updated_at
before update on public.review_items
for each row
execute function public.set_updated_at();

create table if not exists public.review_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  review_item_id uuid not null references public.review_items(id) on delete cascade,
  score text not null,
  reviewed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.review_events'::regclass
      and conname = 'review_events_score_check'
  ) then
    alter table public.review_events
      add constraint review_events_score_check
      check (score in ('again', 'good', 'easy'));
  end if;
end
$$;

create index if not exists idx_review_events_user_reviewed_at
on public.review_events (user_id, reviewed_at desc);

create index if not exists idx_review_events_item
on public.review_events (review_item_id);

grant select, insert on public.review_events to authenticated;

alter table public.review_events enable row level security;

drop policy if exists "review_events_select_own" on public.review_events;
create policy "review_events_select_own"
on public.review_events
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "review_events_insert_own" on public.review_events;
create policy "review_events_insert_own"
on public.review_events
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.review_items
    where review_items.id = review_events.review_item_id
      and review_items.user_id = auth.uid()
  )
);
