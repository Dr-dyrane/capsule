alter table public.cards
  drop constraint if exists cards_status_check;

alter table public.cards
  add constraint cards_status_check
  check (status in ('queued', 'generating', 'complete', 'error'));
