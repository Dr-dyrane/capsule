# Capsule Current Product Status

## Purpose

This is the checkpoint document for resuming work after a pause.

Use it for:

- current implementation status
- shipped feature boundaries
- what is live in app and database
- next decision points

Do not use it as the original feature thesis or the phase-by-phase build spec.

Related docs:

- product stance: [discussion-plan.md](./discussion-plan.md)
- clarifications roadmap: [card-clarifications-roadmap.md](./card-clarifications-roadmap.md)
- clarifications v1 spec: [card-clarifications-v1.md](./card-clarifications-v1.md)
- review system: [review-queue.md](./review-queue.md)

## Current Standpoint

Capsule is no longer in feature-definition mode for review and clarifications.

The product now has:

- a working review loop
- a working public trust layer on community cards
- evidence-backed clarifications
- trust surfacing on community surfaces
- analytics capture and an admin readout

The next work should be guided by product signal, not by adding surface area blindly.

## Shipped

### Review

Live now:

- review queue for generated cards
- saved community cards feeding review
- clearer review entry states
- prompt leak fix so titles do not expose the answer
- smarter queue ordering and source/run grouping

Current role in product:

- retention system
- repeat-study layer
- bridge from generation to revisit behavior

### Card Clarifications

Live now:

- card-level clarifications on published community cards
- clarification types: `Question`, `Clarification`, `Correction`
- one reply depth
- resolve, report, delete
- creator moderation for reported clarification items

Current role in product:

- trust layer for public cards
- clarification and correction surface
- tighter public learning loop without becoming a social product

### Clarification Evidence

Live now:

- single image evidence attachment on clarification items
- evidence on replies
- signed URL rendering
- storage cleanup and validation
- evidence counts in clarification summaries

Current role in product:

- support visual proof
- allow annotated context
- make corrections more credible

### Trust Surfacing

Live now:

- clarification signals on community cards
- clarification signals on community detail
- unresolved correction cues

Current role in product:

- influence trust before save/remix
- reduce blind reuse of questionable public cards

### Analytics

Live now:

- server-side `product_events`
- clarification usage events
- saved/remix/review follow-on events
- clarification-aware event properties
- admin analytics dashboard

Current role in product:

- validate whether clarifications are changing reuse and review behavior
- decide whether more clarification surface area is justified

### Shell / Profile

Live now:

- mobile workspace sheet shell
- context-aware FAB
- simplified mobile tab rail
- responsive profile layout for mobile / tablet / desktop

Current role in product:

- lower chrome density
- clearer workspace navigation
- better use of desktop and tablet space

## Clarifications Roadmap Status

### Phase 1

Status: `shipped`

Delivered:

- core clarification thread model
- reply
- resolve
- report
- delete
- creator moderation

### Phase 2

Status: `shipped`

Delivered:

- image-backed evidence
- evidence rendering
- evidence counts

### Phase 3

Status: `partially shipped`

Delivered:

- community card trust cues
- community detail trust cues
- analytics for clarified-card follow-on actions

Not yet shipped:

- review-surface clarification cues

### Phase 4

Status: `not started`

Not shipped:

- library-level clarifications

## Review Status

The review system is beyond the original narrow v1.

What is live now:

- generated cards in review
- saved community cards in review
- review entry from processing, library, card detail, and saved community surfaces
- improved review prompt strategy
- queue grouping by source/session run

Not shipped:

- clarification cues inside review
- deeper review analytics interpretation layer beyond the admin dashboard
- formal automated test coverage around queue behavior

## Database / Backend Status

Remote Supabase has already received the migrations for:

- review queue
- saved community review support
- clarification core
- clarification moderation policies
- clarification evidence
- product events analytics

Core event logging is live and non-blocking.

## What We Explicitly Did Not Build

Still out of scope:

- direct messaging
- inbox
- generic social discussion
- open chat surfaces
- library-level clarifications
- broad social engagement loops

This is intentional.

## Most Important Open Questions

1. Do clarified cards measurably improve `save`, `remix`, or `review` behavior?
2. Do unresolved correction signals reduce trust in a useful way or just create hesitation?
3. Does review need clarification-aware cues, or is that extra complexity without enough value?
4. Is onboarding/activation now the bigger bottleneck than community trust?

## Recommended Next Work

Priority order after the break:

1. Read `/profile/admin/analytics` and inspect real behavior.
2. Decide whether `review-surface clarification cues` are justified.
3. If not, shift focus to activation and onboarding around:
   - save
   - review
   - return
4. Add targeted tests around:
   - clarification summaries
   - review queue ordering
   - analytics event generation

## Resume Point

If work resumes immediately, the most leverage-aware next task is:

`Use analytics to decide whether to add clarification cues inside /review or move effort into activation/onboarding.`
