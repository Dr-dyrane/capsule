create or replace view public.community_session_detail_index as
select
  s.id as session_id,
  s.source_url,
  s.session_context,
  s.point_count,
  s.card_count,
  s.created_at,
  s.updated_at
from public.sessions s
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

create or replace view public.community_session_point_index as
select
  p.id,
  p.session_id,
  p.text,
  p.category,
  p.concept,
  p.note_role,
  p.sort_order,
  p.card_count
from public.points p
join public.community_session_detail_index detail
  on detail.session_id = p.session_id;

grant select on public.community_session_point_index to anon, authenticated;

drop policy if exists "notes_select_published_storage" on storage.objects;
create policy "notes_select_published_storage"
on storage.objects
for select
to authenticated, anon
using (
  bucket_id = 'notes'
  and exists (
    select 1
    from public.community_session_detail_index
    where community_session_detail_index.source_url = storage.objects.name
  )
);
