create or replace view public.community_review_index as
select
  c.id as card_id,
  c.session_id,
  c.image_url,
  c.title,
  pt.text as point_text,
  pt.category,
  pt.concept,
  pt.note_role
from public.cards c
left join public.points pt
  on pt.id = c.point_id
where c.visibility = 'published'
  and c.status = 'complete';

grant select on public.community_review_index to anon, authenticated;

drop policy if exists "review_items_insert_own" on public.review_items;
create policy "review_items_insert_own"
on public.review_items
for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    (
      coalesce(source_type, 'generated') = 'generated'
      and exists (
        select 1
        from public.cards
        join public.sessions
          on sessions.id = cards.session_id
        where cards.id = review_items.card_id
          and sessions.user_id = auth.uid()
      )
    )
    or (
      source_type = 'saved_community'
      and exists (
        select 1
        from public.community_reactions reactions
        join public.cards cards
          on cards.id = reactions.card_id
        where reactions.card_id = review_items.card_id
          and reactions.user_id = auth.uid()
          and reactions.kind = 'save'
          and cards.visibility = 'published'
          and cards.status = 'complete'
      )
    )
  )
);
