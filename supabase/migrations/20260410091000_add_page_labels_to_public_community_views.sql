create or replace view public.community_index as
with session_labels as (
  select
    s.id as session_id,
    case
      when coalesce(s.session_context, '') ~* '^\s*page\s+[0-9]+\s*$' then
        'Page ' || regexp_replace(s.session_context, '^\s*page\s*0*([0-9]+)\s*$', '\1', 'i')
      when coalesce(s.source_url, '') ~* 'page[ _-]?0*[0-9]+' then
        'Page ' || regexp_replace(s.source_url, '^.*page[ _-]?0*([0-9]+).*$' , '\1', 'i')
      else null
    end as page_label
  from public.sessions s
)
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
  coalesce(reports.report_count, 0) as report_count,
  labels.page_label
from public.cards c
left join public.points pt
  on pt.id = c.point_id
left join public.profiles p
  on p.id = c.published_by
left join session_labels labels
  on labels.session_id = c.session_id
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

create or replace view public.community_library_index as
with session_labels as (
  select
    s.id as session_id,
    case
      when coalesce(s.session_context, '') ~* '^\s*page\s+[0-9]+\s*$' then
        'Page ' || regexp_replace(s.session_context, '^\s*page\s*0*([0-9]+)\s*$', '\1', 'i')
      when coalesce(s.source_url, '') ~* 'page[ _-]?0*[0-9]+' then
        'Page ' || regexp_replace(s.source_url, '^.*page[ _-]?0*([0-9]+).*$' , '\1', 'i')
      else null
    end as page_label
  from public.sessions s
)
select
  s.id as session_id,
  cover.image_url as cover_image_url,
  coalesce(labels.page_label, cover.title, 'Published library') as title,
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
  cover.concept,
  labels.page_label
from public.sessions s
left join session_labels labels
  on labels.session_id = s.id
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

create or replace view public.community_session_detail_index as
with session_labels as (
  select
    s.id as session_id,
    case
      when coalesce(s.session_context, '') ~* '^\s*page\s+[0-9]+\s*$' then
        'Page ' || regexp_replace(s.session_context, '^\s*page\s*0*([0-9]+)\s*$', '\1', 'i')
      when coalesce(s.source_url, '') ~* 'page[ _-]?0*[0-9]+' then
        'Page ' || regexp_replace(s.source_url, '^.*page[ _-]?0*([0-9]+).*$' , '\1', 'i')
      else null
    end as page_label
  from public.sessions s
)
select
  s.id as session_id,
  s.source_url,
  s.session_context,
  s.point_count,
  s.card_count,
  s.created_at,
  s.updated_at,
  labels.page_label
from public.sessions s
left join session_labels labels
  on labels.session_id = s.id
join lateral (
  select count(*)::integer as card_count
  from public.cards c
  where c.session_id = s.id
    and c.visibility = 'published'
    and c.status = 'complete'
) stats
  on true
where s.visibility = 'published'
  and stats.card_count > 0;

grant select on public.community_session_detail_index to anon, authenticated;
