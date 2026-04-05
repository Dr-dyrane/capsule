create table if not exists public.community_library_reactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (session_id, user_id, kind)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.community_library_reactions'::regclass
      and conname = 'community_library_reactions_kind_check'
  ) then
    alter table public.community_library_reactions
      add constraint community_library_reactions_kind_check
      check (kind in ('like', 'save'));
  end if;
end
$$;

grant select, insert, delete on public.community_library_reactions to authenticated;

alter table public.community_library_reactions enable row level security;

drop policy if exists "community_library_reactions_select_own" on public.community_library_reactions;
create policy "community_library_reactions_select_own"
on public.community_library_reactions
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "community_library_reactions_insert_own" on public.community_library_reactions;
create policy "community_library_reactions_insert_own"
on public.community_library_reactions
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "community_library_reactions_delete_own" on public.community_library_reactions;
create policy "community_library_reactions_delete_own"
on public.community_library_reactions
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists idx_community_library_reactions_session_kind
on public.community_library_reactions (session_id, kind);

create index if not exists idx_community_library_reactions_user_kind
on public.community_library_reactions (user_id, kind);

create table if not exists public.community_library_reports (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (session_id, user_id)
);

grant select, insert on public.community_library_reports to authenticated;

alter table public.community_library_reports enable row level security;

drop policy if exists "community_library_reports_select_own" on public.community_library_reports;
create policy "community_library_reports_select_own"
on public.community_library_reports
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "community_library_reports_insert_own" on public.community_library_reports;
create policy "community_library_reports_insert_own"
on public.community_library_reports
for insert
to authenticated
with check (user_id = auth.uid());

create or replace view public.community_library_index as
select
  s.id as session_id,
  cover.image_url as cover_image_url,
  coalesce(cover.title, 'Published library') as title,
  stats.published_at,
  s.user_id as published_by,
  p.username as author_name,
  p.avatar_url as author_avatar_url,
  stats.card_count,
  coalesce(reactions.like_count, 0) as like_count,
  coalesce(reactions.save_count, 0) as save_count,
  coalesce(reports.report_count, 0) as report_count,
  (
    (coalesce(reactions.like_count, 0) * 3)
    + (coalesce(reactions.save_count, 0) * 5)
    + greatest(
      0,
      72 - floor(extract(epoch from (timezone('utc', now()) - coalesce(stats.published_at, s.created_at))) / 3600)
    )
  )::double precision as trend_score,
  cover.category,
  cover.concept
from public.sessions s
join lateral (
  select
    c.image_url,
    c.title,
    pt.category,
    pt.concept
  from public.cards c
  left join public.points pt
    on pt.id = c.point_id
  where c.session_id = s.id
    and c.visibility = 'published'
    and c.status = 'complete'
  order by
    case
      when coalesce(pt.note_role, 'support') = 'hero' then 0
      else 1
    end,
    c.card_order asc nulls last,
    c.published_at asc nulls last,
    c.created_at asc
  limit 1
) cover
  on true
join lateral (
  select
    count(*)::integer as card_count,
    max(c.published_at) as published_at
  from public.cards c
  where c.session_id = s.id
    and c.visibility = 'published'
    and c.status = 'complete'
) stats
  on true
left join lateral (
  select
    count(*) filter (where reactions.kind = 'like')::integer as like_count,
    count(*) filter (where reactions.kind = 'save')::integer as save_count
  from public.community_library_reactions reactions
  where reactions.session_id = s.id
) reactions
  on true
left join lateral (
  select count(*)::integer as report_count
  from public.community_library_reports reports
  where reports.session_id = s.id
) reports
  on true
left join public.profiles p
  on p.id = s.user_id
where s.visibility = 'published'
  and stats.card_count > 0;

grant select on public.community_library_index to anon, authenticated;
