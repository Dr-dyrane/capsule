# Capsule Review Queue

## Why This Exists

Capsule already turns dense clinical notes into visual learning cards quickly.
The missing loop is return behavior after generation. Users can create cards, but
they do not yet have a lightweight, structured way to revisit them and retain
the underlying concept over time.

The review queue closes that gap by turning completed cards into a repeat study
flow without adding more image-generation cost.

## Product Goal

Primary goals:

- Improve 7-day retention for users who generate at least one card
- Improve learning outcome by moving users from recognition to recall

Secondary goals:

- Increase repeat usage of generated cards
- Make the hero-first generation flow useful beyond the first session

## V1 Scope

V1 is intentionally narrow:

- Only the signed-in user's own completed cards enter review
- Review works one card at a time
- Each card has a simple reveal step and 3 confidence actions:
  - `Again`
  - `Good`
  - `Easy`
- Review scheduling is simple and deterministic
- Entry points live in:
  - processing view
  - library
  - card detail

Out of scope for V1:

- Saved community cards in review
- Advanced spaced-repetition tuning
- Deck management
- Notifications
- Streaks, badges, or gamification

## UX Summary

### Entry

Users should see review as a natural continuation of Capsule, not a separate
mode they must configure.

Entry points:

- `Start review` from the processing screen once at least one card is complete
- `Review due` shortcut from library
- `Review now` from card detail

### Review Session

Each review card shows:

- the visual card
- a compact prompt state
- a reveal action
- the original teaching point once revealed
- confidence actions after reveal

The interaction model should feel calm and immediate:

- one card per screen
- large bottom actions on mobile
- subtle transitions, no noisy flashcard metaphors

### Completion

When the queue ends, users see:

- number reviewed
- number marked `Again`
- a clean exit back to library or cards

## Data Model

### `review_items`

One row per user-card pair.

Suggested fields:

- `id`
- `user_id`
- `card_id`
- `source_type` (`generated` for V1, extensible later)
- `state` (`new` | `learning` | `review`)
- `last_score` (`again` | `good` | `easy` | null)
- `last_reviewed_at`
- `next_review_at`
- `review_count`
- `lapse_count`
- `created_at`
- `updated_at`

### `review_events`

Append-only review history for analytics and tuning.

Suggested fields:

- `id`
- `user_id`
- `review_item_id`
- `score`
- `reviewed_at`

## Scheduling Rules

V1 uses simple intervals:

- New + `Again` -> 10 minutes
- New + `Good` -> 1 day
- New + `Easy` -> 3 days
- Learning + `Again` -> 30 minutes
- Learning + `Good` -> 3 days
- Learning + `Easy` -> 7 days
- Review + `Again` -> 1 day
- Review + `Good` -> 7 days
- Review + `Easy` -> 14 days

These should live in code, not in SQL, so they can be tuned quickly.

## Integration Points

### Generation

When a card becomes `complete`, Capsule should upsert a `review_item` if one
does not already exist.

This applies to:

- fresh generated cards
- reused cards completed from a community match inside the user's own session

### Library

Library should surface whether the user has cards due for review and provide a
clear route into the queue.

### Card Detail

Card detail should provide a direct `Review now` path for immediate use.

## Success Metrics

Primary:

- D7 retention for users who generated at least one complete card

Supporting:

- review starts / users with complete cards
- review completions / review starts
- average cards reviewed per session
- return rate after first review session

Guardrails:

- no drop in scan-to-first-card completion
- no material increase in image-generation cost

## Implementation Order

1. Add review tables and RLS
2. Add shared types and scheduling helpers
3. Upsert review items when cards become complete
4. Add server actions for fetching due items and submitting scores
5. Build `/review`
6. Add entry points in processing, library, and card detail
7. Validate with analytics and tune intervals
