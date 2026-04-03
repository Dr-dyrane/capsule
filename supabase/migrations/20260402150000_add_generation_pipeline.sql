-- Core migration 2/3: background generation pipeline
create table if not exists public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'complete', 'error', 'cancelled')),
  total_cards integer not null default 0,
  completed_cards integer not null default 0,
  failed_cards integer not null default 0,
  active_card_id uuid references public.cards(id) on delete set null,
  last_error text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.card_jobs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  card_id uuid references public.cards(id) on delete cascade not null unique,
  point_id uuid references public.points(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'complete', 'error')),
  planner_mode text not null default 'planner' check (planner_mode in ('deterministic', 'planner')),
  cache_key text,
  prompt_hash text,
  model text,
  prompt_version text,
  attempt_count integer not null default 0,
  claimed_at timestamptz,
  finished_at timestamptz,
  last_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.render_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  cache_key text not null,
  prompt_hash text not null,
  prompt_version text not null,
  model text not null,
  image_url text not null,
  prompt text,
  plan jsonb,
  concept_type text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, cache_key)
);

create index if not exists idx_generation_runs_user_status on public.generation_runs(user_id, status, created_at desc);
create index if not exists idx_card_jobs_session_status on public.card_jobs(session_id, status, created_at asc);
create index if not exists idx_card_jobs_user_status on public.card_jobs(user_id, status, created_at asc);
create index if not exists idx_render_cache_user_key on public.render_cache(user_id, cache_key);

grant select, insert, update, delete on public.generation_runs to authenticated;
grant select, insert, update, delete on public.card_jobs to authenticated;
grant select, insert, update, delete on public.render_cache to authenticated;

alter table public.generation_runs enable row level security;
alter table public.card_jobs enable row level security;
alter table public.render_cache enable row level security;

drop policy if exists "generation_runs_select_own" on public.generation_runs;
create policy "generation_runs_select_own"
on public.generation_runs
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "generation_runs_insert_own" on public.generation_runs;
create policy "generation_runs_insert_own"
on public.generation_runs
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "generation_runs_update_own" on public.generation_runs;
create policy "generation_runs_update_own"
on public.generation_runs
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "generation_runs_delete_own" on public.generation_runs;
create policy "generation_runs_delete_own"
on public.generation_runs
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "card_jobs_select_own" on public.card_jobs;
create policy "card_jobs_select_own"
on public.card_jobs
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "card_jobs_insert_own" on public.card_jobs;
create policy "card_jobs_insert_own"
on public.card_jobs
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "card_jobs_update_own" on public.card_jobs;
create policy "card_jobs_update_own"
on public.card_jobs
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "card_jobs_delete_own" on public.card_jobs;
create policy "card_jobs_delete_own"
on public.card_jobs
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "render_cache_select_own" on public.render_cache;
create policy "render_cache_select_own"
on public.render_cache
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "render_cache_insert_own" on public.render_cache;
create policy "render_cache_insert_own"
on public.render_cache
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "render_cache_update_own" on public.render_cache;
create policy "render_cache_update_own"
on public.render_cache
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "render_cache_delete_own" on public.render_cache;
create policy "render_cache_delete_own"
on public.render_cache
for delete
to authenticated
using (user_id = auth.uid());

drop trigger if exists set_generation_runs_updated_at on public.generation_runs;
create trigger set_generation_runs_updated_at
before update on public.generation_runs
for each row
execute function public.set_updated_at();

drop trigger if exists set_card_jobs_updated_at on public.card_jobs;
create trigger set_card_jobs_updated_at
before update on public.card_jobs
for each row
execute function public.set_updated_at();

drop trigger if exists set_render_cache_updated_at on public.render_cache;
create trigger set_render_cache_updated_at
before update on public.render_cache
for each row
execute function public.set_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'generation_runs'
  ) then
    alter publication supabase_realtime add table public.generation_runs;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'card_jobs'
  ) then
    alter publication supabase_realtime add table public.card_jobs;
  end if;
end
$$;
