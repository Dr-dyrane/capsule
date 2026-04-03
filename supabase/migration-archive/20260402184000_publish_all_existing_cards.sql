update public.cards
set
  visibility = 'published',
  published_at = coalesce(public.cards.published_at, public.cards.created_at, timezone('utc', now())),
  published_by = coalesce(public.cards.published_by, public.sessions.user_id)
from public.sessions
where public.cards.session_id = public.sessions.id
  and (
    public.cards.visibility is distinct from 'published'
    or public.cards.published_at is null
    or public.cards.published_by is null
  );

update public.sessions
set visibility = 'published'
where exists (
  select 1
  from public.cards
  where public.cards.session_id = public.sessions.id
    and public.cards.visibility = 'published'
);
