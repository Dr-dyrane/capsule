create index if not exists idx_sessions_visibility_published
on public.sessions (created_at desc, id desc)
where visibility = 'published';

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
  stats.like_count,
  stats.save_count,
  stats.report_count,
  stats.trend_score,
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
    max(c.published_at) as published_at,
    coalesce(sum(ci.like_count), 0)::integer as like_count,
    coalesce(sum(ci.save_count), 0)::integer as save_count,
    coalesce(sum(ci.report_count), 0)::integer as report_count,
    coalesce(max(ci.trend_score), 0)::double precision as trend_score
  from public.cards c
  left join public.community_index ci
    on ci.card_id = c.id
  where c.session_id = s.id
    and c.visibility = 'published'
    and c.status = 'complete'
) stats
  on true
left join public.profiles p
  on p.id = s.user_id
where s.visibility = 'published'
  and stats.card_count > 0;

grant select on public.community_library_index to anon, authenticated;
