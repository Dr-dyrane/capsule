# Capsule Supabase Migrations

The active migration chain is intentionally kept small:

1. `20260402093000_initial_capsule_schema.sql`
   Base app schema: sessions, points, cards, storage, RLS.
2. `20260402150000_add_generation_pipeline.sql`
   Background generation tables and cache.
3. `20260402160000_add_community_system.sql`
   Profiles, publishing, remix, community feed, reactions, reports.
4. `20260402213000_trim_duplicate_indexes.sql`
   Forward-only cleanup for redundant community indexes on the remote DB.

Older rollout-specific migrations were collapsed into the core files above.
Their original SQL now lives in `supabase/migration-archive/`, while the
matching timestamps remain in `supabase/migrations/` as tiny compatibility
stubs so the remote Supabase migration history still validates.

The remote database remains authoritative for applied migration versions. When
editing schema going forward, add new forward-only migrations to
`supabase/migrations/`.
