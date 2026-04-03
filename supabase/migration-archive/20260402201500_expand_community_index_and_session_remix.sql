alter table public.sessions
  add column if not exists remix_source_card_id uuid references public.cards(id) on delete set null;

create index if not exists idx_sessions_remix_source_card_id
on public.sessions (remix_source_card_id);

create index if not exists idx_cards_published_complete
on public.cards (published_at desc)
where visibility = 'published' and status = 'complete';

create index if not exists idx_cards_published_by_complete
on public.cards (published_by, published_at desc)
where visibility = 'published' and status = 'complete';

create or replace view public.community_index as
select
  c.id as card_id,
  c.session_id,
  c.image_url,
  c.title,
  c.published_at,
  c.published_by,
  coalesce(c.community_template, 'mechanism-board') as community_template,
  p.username as author_name,
  p.avatar_url as author_avatar_url,
  coalesce(reactions.like_count, 0) as like_count,
  coalesce(reactions.save_count, 0) as save_count,
  (
    (coalesce(reactions.like_count, 0) * 3)
    + (coalesce(reactions.save_count, 0) * 5)
    + greatest(
      0,
      72 - floor(extract(epoch from (timezone('utc', now()) - coalesce(c.published_at, c.created_at))) / 3600)
    )
  )::double precision as trend_score,
  pt.category,
  pt.concept,
  coalesce(reports.report_count, 0) as report_count
from public.cards c
left join public.points pt
  on pt.id = c.point_id
left join public.profiles p
  on p.id = c.published_by
left join lateral (
  select
    count(*) filter (where cr.kind = 'like')::integer as like_count,
    count(*) filter (where cr.kind = 'save')::integer as save_count
  from public.community_reactions cr
  where cr.card_id = c.id
) reactions
  on true
left join lateral (
  select count(*)::integer as report_count
  from public.community_reports reports
  where reports.card_id = c.id
) reports
  on true
where c.visibility = 'published'
  and c.status = 'complete';

grant select on public.community_index to anon, authenticated;
