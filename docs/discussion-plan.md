# Capsule Card Clarifications Plan

## Current Product Standpoint

## Document Map

- Product stance: [discussion-plan.md](./discussion-plan.md)
- Full roadmap: [card-clarifications-roadmap.md](./card-clarifications-roadmap.md)
- Current implementation spec: [card-clarifications-v1.md](./card-clarifications-v1.md)

Capsule does not need generic discussion.
Capsule needs a trust layer around public learning cards.

The problem is not:

- users lack places to talk
- users need social engagement for its own sake
- users need private messaging

The real problem is:

- public cards can be useful but incomplete
- users may need correction, clarification, or supporting evidence
- community content needs a lightweight way to become more trustworthy

So the right feature is not `Discussion`.
The right feature is `Card Clarifications`.

## Product Decision

Build:

- public, card-level clarifications
- short structured responses
- optional image evidence
- creator and community replies
- resolution state for answered or corrected issues

Do not build:

- direct messages
- inboxes
- generic comment systems
- off-topic conversation spaces
- user-to-user social chat

Capsule should be a learning product with community verification, not a communication platform.

## Why This Wins

This feature fits Capsule because it improves:

- trust in public cards
- learning quality
- reuse confidence
- community value without social bloat

It also avoids the cost of building:

- moderation-heavy open discussion
- messaging infrastructure
- notifications and social graph logic
- a second product inside Capsule

## Feature Definition

`Card Clarifications` is a structured public layer on top of published community cards.

Users can add one of three things:

- `Question`
- `Clarification`
- `Correction`

Each item belongs to a published card.
Each item can receive replies.
Each item can optionally include one supporting image.

The goal is to help the next learner understand the card better.

## UX Principle

The interaction model should feel native, compact, and familiar.

Use a thread pattern similar to X/Twitter because it is fast to parse and widely understood.
But only copy the thread interaction model, not the social product.

Rules:

- keep users on the same screen whenever possible
- use sheets for compose, image attach, report, and focused reply
- use progressive disclosure instead of long scrolling layouts
- keep DOM shallow
- avoid wrapper-in-wrapper layouts
- avoid wasted horizontal padding on mobile
- manage tight vertical space carefully
- prefer inline expansion over navigation
- use microinteractions for confirmation, not extra chrome

## V1 Scope

V1 should be intentionally narrow:

- only on published community cards
- top-level clarification items
- one reply depth only
- text required
- type required: `Question`, `Clarification`, or `Correction`
- optional single image attachment
- creator and community can reply
- users can report items
- users can delete their own items
- creator can mark an item `Resolved`

V1 out of scope:

- library-level clarification
- private messaging
- notifications
- @mentions
- multi-level reply trees
- reactions on clarification items
- quote repost / reshare behavior
- voice or video replies

## User Jobs

### Learner

- ask what a card means
- point out ambiguity
- add a better explanation
- attach a supporting image or annotated note

### Card Creator

- clarify intent
- respond to questions
- accept or resolve a correction

### Future Viewer

- quickly see whether a public card has unanswered concerns
- scan resolved clarifications without reading a long thread

## Core UX Flow

### Entry

On a published card:

- `Clarify`
- `View clarifications`

If there are existing items, show a small count near the action.

### Main View

Clarifications live inline on the community card detail screen.
They can expand into a focused sheet on mobile.

The view should include:

- summary bar
- clarification list
- compact composer trigger
- resolved and open grouping

### Composer

Use a sheet-based composer on mobile.

Composer fields:

- type picker
- text field
- optional image attach
- submit

No heavy rich text editor.
No full-screen writing mode unless the input grows large.

### Replies

Replies should expand inline under a clarification item.
If the user is replying on mobile, the reply composer can open in a bottom sheet.

### Resolution

Card creator can mark a clarification thread as `Resolved`.
Resolved items should collapse by default behind a simple toggle.

## Interaction Design Rules

### Mobile

- no large side gutters
- keep horizontal padding tight, usually `12px` to `16px`
- use bottom sheets for focused actions
- action row stays compact
- image preview should not dominate the thread
- avoid sending users to a separate page unless the clarification task becomes primary

### Desktop

- same single-column thread model
- more breathing room, not more complexity
- avoid multi-panel discussion layouts
- do not make it feel like Slack, Discord, or a forum

### Layout

- no unnecessary wrappers
- no card inside card inside card
- one main thread surface
- compact row structure: avatar, content, actions, optional media
- keep scroll depth under control with progressive disclosure

## Clarification Types

### Question

Use when a learner does not understand the card or wants a missing link explained.

### Clarification

Use when the card is directionally right but needs added context.

### Correction

Use when the card is misleading, incomplete, or wrong.

## Image Attachment Rules

Allow one optional image per clarification item or reply.

Good image examples:

- annotated source note
- supporting diagram
- comparison screenshot
- marked-up explanation image

Bad image examples:

- unrelated photos
- reaction images
- decorative uploads

This image is evidence, not social media content.

## Moderation Rules

Need from day one:

- report clarification item
- delete own item
- creator resolve action
- rate limiting
- server-side file validation
- image size limit
- allowed mime type enforcement

Recommended next:

- creator hide / escalate action
- admin moderation view for flagged items

## Information Architecture

Each published card detail page should expose:

- card content
- save / remix actions
- clarification summary
- clarification thread

Clarifications should not become a separate top-level destination in navigation.

## Data Model

### `card_clarification_threads`

- `id`
- `card_id`
- `root_item_id`
- `created_by`
- `kind`
- `status` (`open`, `resolved`, `removed`)
- `reply_count`
- `last_activity_at`
- `resolved_by` nullable
- `resolved_at` nullable
- `created_at`

### `card_clarification_items`

- `id`
- `thread_id`
- `card_id`
- `user_id`
- `parent_item_id` nullable
- `body`
- `image_path` nullable
- `image_width` nullable
- `image_height` nullable
- `status` (`active`, `deleted`, `reported`)
- `created_at`
- `updated_at`

### `card_clarification_reports`

- `id`
- `item_id`
- `user_id`
- `created_at`

## Storage

Use a dedicated bucket such as `clarifications`.

Rules:

- authenticated upload only
- path scoped by `card_id` and `user_id`
- strict file size cap
- signed URLs for rendering

## API / Action Layer

Needed actions:

- `getCardClarifications(cardId)`
- `createClarification(cardId, kind, body, image?)`
- `replyToClarification(threadId, body, image?)`
- `resolveClarification(threadId)`
- `deleteClarificationItem(itemId)`
- `reportClarificationItem(itemId)`

## UI Components

Likely components:

- `ClarificationSummary`
- `ClarificationList`
- `ClarificationThread`
- `ClarificationComposerSheet`
- `ClarificationReplyComposer`
- `ClarificationImagePreview`
- `ClarificationResolveAction`

## Rollout Plan

### Phase 1

- card-level clarifications
- text only
- one reply depth
- resolved state

### Phase 2

- single image attachment
- image validation
- signed URL rendering

### Phase 3

- only if usage is healthy: library-level clarifications

## Success Metrics

Primary:

- % of public cards with viewed clarifications
- % of public cards with at least one useful clarification thread
- save-to-review rate on cards with clarifications vs cards without clarifications

Secondary:

- creator reply rate
- resolution rate
- correction-to-resolution time
- clarification open rate from community card detail

Guardrails:

- moderation load
- abuse rate
- time-on-task inflation from too much reading
- negative effect on remix conversion

## Final Recommendation

Proceed with `Card Clarifications`.

Do not proceed with broad `Discussion`.
Do not build user-to-user messaging.

This gives Capsule the missing community trust layer without compromising focus, native UX quality, or product scope.
