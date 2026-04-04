grant delete on public.card_clarification_reports to authenticated;

drop policy if exists "card_clarification_items_update_creator" on public.card_clarification_items;
create policy "card_clarification_items_update_creator"
on public.card_clarification_items
for update
to authenticated
using (
  exists (
    select 1
    from public.cards
    where cards.id = card_clarification_items.card_id
      and cards.published_by = auth.uid()
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
)
with check (
  exists (
    select 1
    from public.cards
    where cards.id = card_clarification_items.card_id
      and cards.published_by = auth.uid()
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "card_clarification_reports_select_creator" on public.card_clarification_reports;
create policy "card_clarification_reports_select_creator"
on public.card_clarification_reports
for select
to authenticated
using (
  exists (
    select 1
    from public.card_clarification_items
    join public.cards
      on cards.id = card_clarification_items.card_id
    where card_clarification_items.id = card_clarification_reports.item_id
      and cards.published_by = auth.uid()
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "card_clarification_reports_delete_creator" on public.card_clarification_reports;
create policy "card_clarification_reports_delete_creator"
on public.card_clarification_reports
for delete
to authenticated
using (
  exists (
    select 1
    from public.card_clarification_items
    join public.cards
      on cards.id = card_clarification_items.card_id
    where card_clarification_items.id = card_clarification_reports.item_id
      and cards.published_by = auth.uid()
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);
