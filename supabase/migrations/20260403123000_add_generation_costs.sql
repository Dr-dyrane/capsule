create table if not exists public.generation_costs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete cascade,
  card_id uuid references public.cards(id) on delete cascade,
  point_id uuid references public.points(id) on delete cascade,
  stage text not null check (stage in ('planner', 'image', 'cache_hit', 'seed')),
  model text,
  quality text,
  size text,
  profile_id text,
  template_id text,
  route_level text,
  prompt_version text,
  pricing_version text,
  estimated_cost_usd numeric(12, 6) not null default 0,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  input_text_tokens integer,
  input_image_tokens integer,
  output_text_tokens integer,
  output_image_tokens integer,
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_generation_costs_user_created
on public.generation_costs (user_id, created_at desc);

create index if not exists idx_generation_costs_session_created
on public.generation_costs (session_id, created_at desc);

create index if not exists idx_generation_costs_card_stage
on public.generation_costs (card_id, stage, created_at desc);

grant select, insert on public.generation_costs to authenticated;

alter table public.generation_costs enable row level security;

drop policy if exists "generation_costs_select_own" on public.generation_costs;
create policy "generation_costs_select_own"
on public.generation_costs
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "generation_costs_insert_own" on public.generation_costs;
create policy "generation_costs_insert_own"
on public.generation_costs
for insert
to authenticated
with check (user_id = auth.uid());
