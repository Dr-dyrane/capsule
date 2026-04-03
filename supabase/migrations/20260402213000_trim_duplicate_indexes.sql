-- Cleanup migration: remove duplicate indexes created during iterative community rollout
drop index if exists public.idx_cards_published_complete;
drop index if exists public.idx_cards_published_by_complete;

