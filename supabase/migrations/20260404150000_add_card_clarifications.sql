create table if not exists public.card_clarification_threads (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  status text not null default 'open',
  root_item_id uuid null,
  reply_count integer not null default 0,
  last_activity_at timestamptz not null default timezone('utc', now()),
  resolved_by uuid null references auth.users(id) on delete set null,
  resolved_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.card_clarification_threads'::regclass
      and conname = 'card_clarification_threads_kind_check'
  ) then
    alter table public.card_clarification_threads
      add constraint card_clarification_threads_kind_check
      check (kind in ('question', 'clarification', 'correction'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.card_clarification_threads'::regclass
      and conname = 'card_clarification_threads_status_check'
  ) then
    alter table public.card_clarification_threads
      add constraint card_clarification_threads_status_check
      check (status in ('open', 'resolved', 'removed'));
  end if;
end
$$;

create table if not exists public.card_clarification_items (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.card_clarification_threads(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_item_id uuid null references public.card_clarification_items(id) on delete cascade,
  body text not null,
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.card_clarification_items'::regclass
      and conname = 'card_clarification_items_status_check'
  ) then
    alter table public.card_clarification_items
      add constraint card_clarification_items_status_check
      check (status in ('active', 'deleted', 'reported'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.card_clarification_items'::regclass
      and conname = 'card_clarification_items_body_length_check'
  ) then
    alter table public.card_clarification_items
      add constraint card_clarification_items_body_length_check
      check (char_length(trim(body)) between 1 and 1200);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.card_clarification_threads'::regclass
      and conname = 'card_clarification_threads_root_item_id_fkey'
  ) then
    alter table public.card_clarification_threads
      add constraint card_clarification_threads_root_item_id_fkey
      foreign key (root_item_id)
      references public.card_clarification_items(id)
      on delete set null
      deferrable initially deferred;
  end if;
end
$$;

create unique index if not exists idx_card_clarification_threads_root_item
on public.card_clarification_items (thread_id)
where parent_item_id is null;

create index if not exists idx_card_clarification_threads_card_status_activity
on public.card_clarification_threads (card_id, status, last_activity_at desc);

create index if not exists idx_card_clarification_items_thread_created
on public.card_clarification_items (thread_id, created_at asc);

create index if not exists idx_card_clarification_items_card_status
on public.card_clarification_items (card_id, status, created_at desc);

create or replace function public.enforce_card_clarification_parent()
returns trigger
language plpgsql
as $$
declare
  parent_thread_id uuid;
  parent_card_id uuid;
  parent_parent_id uuid;
begin
  if new.parent_item_id is null then
    return new;
  end if;

  select thread_id, card_id, parent_item_id
  into parent_thread_id, parent_card_id, parent_parent_id
  from public.card_clarification_items
  where id = new.parent_item_id;

  if parent_thread_id is null then
    raise exception 'Clarification parent not found';
  end if;

  if parent_thread_id <> new.thread_id or parent_card_id <> new.card_id then
    raise exception 'Clarification reply must stay in the same thread and card';
  end if;

  if parent_parent_id is not null then
    raise exception 'Clarification replies are limited to one level';
  end if;

  return new;
end;
$$;

create or replace function public.refresh_card_clarification_thread()
returns trigger
language plpgsql
as $$
declare
  target_thread_id uuid;
begin
  target_thread_id := case
    when tg_op = 'DELETE' then old.thread_id
    else new.thread_id
  end;

  update public.card_clarification_threads
  set
    root_item_id = (
      select id
      from public.card_clarification_items
      where thread_id = target_thread_id
        and parent_item_id is null
      order by created_at asc
      limit 1
    ),
    reply_count = (
      select count(*)
      from public.card_clarification_items
      where thread_id = target_thread_id
        and parent_item_id is not null
        and status = 'active'
    ),
    last_activity_at = coalesce(
      (
        select max(created_at)
        from public.card_clarification_items
        where thread_id = target_thread_id
          and status = 'active'
      ),
      created_at
    )
  where id = target_thread_id;

  return null;
end;
$$;

drop trigger if exists enforce_card_clarification_parent on public.card_clarification_items;
create trigger enforce_card_clarification_parent
before insert or update on public.card_clarification_items
for each row
execute function public.enforce_card_clarification_parent();

drop trigger if exists refresh_card_clarification_thread_on_write on public.card_clarification_items;
create trigger refresh_card_clarification_thread_on_write
after insert or update or delete on public.card_clarification_items
for each row
execute function public.refresh_card_clarification_thread();

drop trigger if exists set_card_clarification_threads_updated_at on public.card_clarification_threads;
create trigger set_card_clarification_threads_updated_at
before update on public.card_clarification_threads
for each row
execute function public.set_updated_at();

drop trigger if exists set_card_clarification_items_updated_at on public.card_clarification_items;
create trigger set_card_clarification_items_updated_at
before update on public.card_clarification_items
for each row
execute function public.set_updated_at();

create table if not exists public.card_clarification_reports (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.card_clarification_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (item_id, user_id)
);

create index if not exists idx_card_clarification_reports_item
on public.card_clarification_reports (item_id);

grant select, insert, update on public.card_clarification_threads to authenticated;
grant select, insert, update on public.card_clarification_items to authenticated;
grant select, insert on public.card_clarification_reports to authenticated;

alter table public.card_clarification_threads enable row level security;
alter table public.card_clarification_items enable row level security;
alter table public.card_clarification_reports enable row level security;

drop policy if exists "card_clarification_threads_select_published" on public.card_clarification_threads;
create policy "card_clarification_threads_select_published"
on public.card_clarification_threads
for select
to authenticated
using (
  exists (
    select 1
    from public.cards
    where cards.id = card_clarification_threads.card_id
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "card_clarification_threads_insert_own" on public.card_clarification_threads;
create policy "card_clarification_threads_insert_own"
on public.card_clarification_threads
for insert
to authenticated
with check (
  created_by = auth.uid()
  and exists (
    select 1
    from public.cards
    where cards.id = card_clarification_threads.card_id
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "card_clarification_threads_update_owner" on public.card_clarification_threads;
create policy "card_clarification_threads_update_owner"
on public.card_clarification_threads
for update
to authenticated
using (
  created_by = auth.uid()
  or exists (
    select 1
    from public.cards
    where cards.id = card_clarification_threads.card_id
      and cards.published_by = auth.uid()
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
)
with check (
  created_by = auth.uid()
  or exists (
    select 1
    from public.cards
    where cards.id = card_clarification_threads.card_id
      and cards.published_by = auth.uid()
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "card_clarification_items_select_published" on public.card_clarification_items;
create policy "card_clarification_items_select_published"
on public.card_clarification_items
for select
to authenticated
using (
  exists (
    select 1
    from public.cards
    where cards.id = card_clarification_items.card_id
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "card_clarification_items_insert_own" on public.card_clarification_items;
create policy "card_clarification_items_insert_own"
on public.card_clarification_items
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.card_clarification_threads
    join public.cards
      on cards.id = card_clarification_threads.card_id
    where card_clarification_threads.id = card_clarification_items.thread_id
      and card_clarification_threads.card_id = card_clarification_items.card_id
      and card_clarification_threads.status = 'open'
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "card_clarification_items_update_own" on public.card_clarification_items;
create policy "card_clarification_items_update_own"
on public.card_clarification_items
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "card_clarification_reports_select_own" on public.card_clarification_reports;
create policy "card_clarification_reports_select_own"
on public.card_clarification_reports
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "card_clarification_reports_insert_own" on public.card_clarification_reports;
create policy "card_clarification_reports_insert_own"
on public.card_clarification_reports
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.card_clarification_items
    join public.cards
      on cards.id = card_clarification_items.card_id
    where card_clarification_items.id = card_clarification_reports.item_id
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);
