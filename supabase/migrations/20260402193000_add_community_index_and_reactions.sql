create table if not exists public.community_reactions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (card_id, user_id, kind)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.community_reactions'::regclass
      and conname = 'community_reactions_kind_check'
  ) then
    alter table public.community_reactions
      add constraint community_reactions_kind_check
      check (kind in ('like', 'save'));
  end if;
end
$$;

alter table public.community_reactions enable row level security;

drop policy if exists "community_reactions_select_own" on public.community_reactions;
create policy "community_reactions_select_own"
on public.community_reactions
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "community_reactions_insert_own" on public.community_reactions;
create policy "community_reactions_insert_own"
on public.community_reactions
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "community_reactions_delete_own" on public.community_reactions;
create policy "community_reactions_delete_own"
on public.community_reactions
for delete
to authenticated
using (user_id = auth.uid());

create index if not exists idx_community_reactions_card_kind
on public.community_reactions (card_id, kind);

create index if not exists idx_community_reactions_user_kind
on public.community_reactions (user_id, kind);

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
  count(*) filter (where cr.kind = 'like')::integer as like_count,
  count(*) filter (where cr.kind = 'save')::integer as save_count,
  (
    (count(*) filter (where cr.kind = 'like') * 3)
    + (count(*) filter (where cr.kind = 'save') * 5)
    + greatest(
      0,
      72 - floor(extract(epoch from (timezone('utc', now()) - coalesce(c.published_at, c.created_at))) / 3600)
    )
  )::double precision as trend_score
from public.cards c
left join public.profiles p
  on p.id = c.published_by
left join public.community_reactions cr
  on cr.card_id = c.id
where c.visibility = 'published'
  and c.status = 'complete'
group by
  c.id,
  c.session_id,
  c.image_url,
  c.title,
  c.published_at,
  c.published_by,
  c.community_template,
  c.created_at,
  p.username,
  p.avatar_url;

grant select on public.community_index to anon, authenticated;

drop policy if exists "cards_select_published_storage" on storage.objects;
create policy "cards_select_published_storage"
on storage.objects
for select
to authenticated, anon
using (
  bucket_id = 'cards'
  and exists (
    select 1
    from public.community_index
    where community_index.image_url = storage.objects.name
  )
);
