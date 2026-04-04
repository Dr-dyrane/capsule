alter table public.card_clarification_items
add column if not exists evidence_image_path text null;

create index if not exists idx_card_clarification_items_evidence_path
on public.card_clarification_items (evidence_image_path)
where evidence_image_path is not null;

insert into storage.buckets (id, name, public)
values ('clarifications', 'clarifications', false)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "clarifications_select_published_storage" on storage.objects;
create policy "clarifications_select_published_storage"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'clarifications'
  and exists (
    select 1
    from public.card_clarification_items
    join public.cards
      on cards.id = card_clarification_items.card_id
    where card_clarification_items.evidence_image_path = storage.objects.name
      and card_clarification_items.status = 'active'
      and cards.visibility = 'published'
      and cards.status = 'complete'
  )
);

drop policy if exists "clarifications_insert_own_storage" on storage.objects;
create policy "clarifications_insert_own_storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'clarifications'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "clarifications_update_own_storage" on storage.objects;
create policy "clarifications_update_own_storage"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'clarifications'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'clarifications'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "clarifications_delete_owner_storage" on storage.objects;
create policy "clarifications_delete_owner_storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'clarifications'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.card_clarification_items
      join public.cards
        on cards.id = card_clarification_items.card_id
      where card_clarification_items.evidence_image_path = storage.objects.name
        and cards.visibility = 'published'
        and cards.status = 'complete'
        and cards.published_by = auth.uid()
    )
  )
);
