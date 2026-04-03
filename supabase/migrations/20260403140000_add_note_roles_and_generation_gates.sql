alter table public.points
  add column if not exists note_role text;

update public.points
set note_role = 'support'
where note_role is null;

alter table public.points
  alter column note_role set default 'support';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'points_note_role_check'
  ) then
    alter table public.points
      add constraint points_note_role_check
      check (note_role in ('hero', 'support', 'overflow'));
  end if;
end $$;

alter table public.cards
  add column if not exists generation_gate text,
  add column if not exists render_model text,
  add column if not exists render_quality text,
  add column if not exists reused_from_card_id uuid references public.cards(id) on delete set null,
  add column if not exists community_match_card_id uuid references public.cards(id) on delete set null,
  add column if not exists community_match_score double precision;

update public.cards
set generation_gate = case
  when reused_from_card_id is not null then 'reused'
  else 'manual'
end
where generation_gate is null;

alter table public.cards
  alter column generation_gate set default 'manual';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cards_generation_gate_check'
  ) then
    alter table public.cards
      add constraint cards_generation_gate_check
      check (generation_gate in ('automatic', 'community-first', 'manual', 'reused', 'premium'));
  end if;
end $$;

alter table public.card_jobs
  add column if not exists reference_card_id uuid references public.cards(id) on delete set null;

create index if not exists idx_points_note_role on public.points (note_role);
create index if not exists idx_cards_generation_gate on public.cards (generation_gate);
create index if not exists idx_cards_community_match_card_id on public.cards (community_match_card_id);
create index if not exists idx_cards_reused_from_card_id on public.cards (reused_from_card_id);
create index if not exists idx_card_jobs_reference_card_id on public.card_jobs (reference_card_id);
