# Capsule Card Clarifications Roadmap

## Purpose

This document covers the full feature path from first release to mature system.

Use it for:

- product sequencing
- dependency planning
- phase gates
- success criteria

Do not use it as the exact implementation spec for the current build.
That stays in [card-clarifications-v1.md](./card-clarifications-v1.md).

## Product Thesis

Capsule needs a trust layer on top of public cards.

The goal is not to make the product more social.
The goal is to make public learning cards:

- easier to trust
- easier to correct
- easier to understand
- safer to reuse

The feature should remain:

- public
- card-centered
- compact
- native-feeling
- moderation-conscious

## Non-Negotiable Constraints

- no direct messaging
- no inbox
- no generic chat surface
- no wrapper-heavy thread UI
- no bloated desktop forum layout
- no large horizontal gutters on mobile
- no excessive route changes for small actions

## Document Map

- Product stance: [discussion-plan.md](./discussion-plan.md)
- Full roadmap: [card-clarifications-roadmap.md](./card-clarifications-roadmap.md)
- Current build spec: [card-clarifications-v1.md](./card-clarifications-v1.md)

## Phase Overview

### Phase 1

Card-level clarifications, text only.

### Phase 2

Image-backed evidence in clarifications.

### Phase 3

Trust signals and better surfacing across community and review.

### Phase 4

Library-level clarifications, only if earlier phases prove valuable.

## Phase 1: Card Clarifications Core

### Outcome

Users can ask questions, add clarifications, and point out corrections on a published card.

### Scope

- published card detail only
- top-level thread item
- one reply depth
- text only
- resolve, report, delete

### Why first

- highest trust value
- lowest surface area
- easiest moderation scope
- directly tied to one public learning object

### Success gate

Move to Phase 2 only if:

- users meaningfully open clarifications on published cards
- creators or knowledgeable users reply
- moderation load stays manageable

### Failure mode

If usage is weak, do not expand the feature.
Keep the clarification layer narrow and stable.

## Phase 2: Evidence Attachments

### Outcome

Users can attach one supporting image to a clarification or reply.

### Scope

- single image per clarification item
- image preview inline
- upload via bottom sheet composer
- strict validation and signed URL rendering

### Why this phase exists

Text alone may be too weak for:

- annotated note excerpts
- mechanism diagrams
- comparison screenshots
- visual corrections

### Risks

- moderation cost rises
- storage cost rises
- poor uploads can lower signal quality

### Success gate

Proceed only if:

- Phase 1 usage is healthy
- reports remain manageable
- image uploads are used as evidence, not noise

## Phase 3: Trust Surfacing

### Outcome

Clarifications stop being buried at the bottom of card detail.
They start affecting how users judge and reuse a card.

### Scope

- show clarification count on community cards
- show resolved/open signal on card detail
- show `clarified` trust indicators where useful
- optionally surface clarification presence before save/remix/review

### Why this phase matters

The feature only compounds if clarification quality is visible before a user commits to reuse.

### Example additions

- `Open clarifications` chip on community card
- `Resolved correction` status in detail header
- warning state if a card has unresolved corrections

### Guardrail

Do not turn feed cards into noisy metadata blocks.
Trust indicators must stay small and scannable.

## Phase 4: Library-Level Clarifications

### Outcome

Published libraries can carry clarifications at the collection level.

### Scope

- only for published libraries
- collection-level thread for broad issues
- separate from card-level clarifications

### Why this is late

Card-level trust is more important.
Library-level clarification is broader, harder to moderate, and easier to misuse.

### When to do it

Only after:

- card-level clarifications show sustained value
- there is a clear recurring need for session-wide correction or context

## Potential Later Extensions

Only consider these if the earlier phases are genuinely successful:

- creator moderation tools
- admin moderation view
- clarification summaries generated for viewers
- review integration for cards with resolved clarifications

Do not assume these will be built.

## Integration With Existing Capsule Loops

### Community

Clarifications improve trust in public cards and make saving/reusing safer.

### Review

Later, resolved clarifications may improve confidence in saved cards entering review.
This should not be Phase 1 work.

### Remix

Clarifications can help a user decide whether to remix a card or discard it.

## Success Metrics By Phase

### Phase 1

- clarification open rate on public card detail
- clarification creation rate
- creator reply rate
- resolution rate

### Phase 2

- % of clarification items using images
- image report rate
- storage cost per active clarification creator

### Phase 3

- change in save rate on clarified cards
- change in remix rate on clarified cards
- change in trust behavior around cards with unresolved corrections

### Phase 4

- use only if library-level clarification is actually needed

## Kill Criteria

Pause or stop expansion if:

- clarification usage stays near zero
- moderation burden is disproportionate
- the feature shifts behavior toward off-topic social chatter
- the UI becomes heavier than the trust benefit justifies

## Recommended Build Order

1. Ship Phase 1 and measure.
2. Only then decide whether Phase 2 is justified.
3. Phase 3 should follow product signal, not intuition.
4. Treat Phase 4 as optional, not guaranteed.

## Final Recommendation

Document the whole roadmap, but build one phase at a time.

That gives Capsule:

- strategic clarity from start to finish
- tactical focus right now
- room to stop early if the trust layer solves the problem before the roadmap is complete
