# Capsule Card Clarifications V1 Build Spec

## Document Map

- Product stance: [discussion-plan.md](./discussion-plan.md)
- Full roadmap: [card-clarifications-roadmap.md](./card-clarifications-roadmap.md)
- Current implementation spec: [card-clarifications-v1.md](./card-clarifications-v1.md)

## Goal

Ship a narrow trust-and-learning layer for published community cards.

V1 should let users:

- ask a question
- add a clarification
- point out a correction
- reply once
- resolve a thread
- report or delete a clarification item

This is not a discussion product.
This is a clarification layer attached to a public card.

## Product Boundary

Build:

- only on published community cards
- public, card-attached clarification threads
- one reply depth
- text only in V1
- creator/community replies
- resolved state

Do not build:

- direct messages
- inboxes
- notifications
- @mentions
- reactions on clarification items
- library-level clarification
- image upload in V1

## UX Model

### Placement

Clarifications live on community card detail only in V1.

Do not add a new top-level navigation item.

### Interaction Pattern

Use a compact X/Twitter-style thread layout:

- avatar left
- content right
- compact action row
- replies nested one level

Keep the experience native-feeling:

- inline thread on the card detail page
- bottom sheet composer on mobile
- reply composer in a sheet, not a route change
- resolved items collapsed behind a small toggle

### Mobile Rules

- keep horizontal padding tight: `12px` to `16px`
- avoid tall wrappers and repeated cards inside cards
- keep DOM shallow
- use one main thread column
- composer and report flows should use sheets

## Primary User Flows

### 1. Create a clarification

1. User opens a published card detail page.
2. User taps `Clarify`.
3. Bottom sheet opens.
4. User chooses type:
   - `Question`
   - `Clarification`
   - `Correction`
5. User writes short text.
6. User submits.
7. New clarification appears at the top of open items.

### 2. Reply to a clarification

1. User taps `Reply` on a clarification thread.
2. Reply sheet opens.
3. User writes a reply.
4. Reply is appended inline.

### 3. Resolve a clarification

1. Card creator taps `Resolve`.
2. Thread status changes to `resolved`.
3. Thread moves into the collapsed resolved group.

### 4. Report or delete

1. User opens overflow actions.
2. User chooses `Report` or `Delete`.
3. Inline confirmation or small sheet appears.
4. State updates without leaving the card detail screen.

## V1 Screen Additions

### Community Card Detail

Add below the current action section:

- `ClarificationSummary`
- `ClarificationList`
- `ClarificationComposerSheet`

### Summary Surface

Should show:

- open clarification count
- resolved clarification count
- `Clarify` primary action

### Thread Cell

Each thread cell should include:

- user avatar
- display name
- type chip
- created time
- body
- `Reply`
- `Resolve` if creator owns the card
- overflow menu: `Report`, `Delete` if applicable

### Reply Cell

Reply cell is a lighter version of the main thread item:

- no extra card chrome
- indented slightly
- compact metadata row

## Data Model

### `card_clarification_threads`

- `id uuid primary key`
- `card_id uuid not null`
- `created_by uuid not null`
- `kind text not null check (kind in ('question', 'clarification', 'correction'))`
- `status text not null default 'open' check (status in ('open', 'resolved', 'removed'))`
- `root_item_id uuid null`
- `reply_count integer not null default 0`
- `last_activity_at timestamptz not null default now()`
- `resolved_by uuid null`
- `resolved_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### `card_clarification_items`

- `id uuid primary key`
- `thread_id uuid not null`
- `card_id uuid not null`
- `user_id uuid not null`
- `parent_item_id uuid null`
- `body text not null`
- `status text not null default 'active' check (status in ('active', 'deleted', 'reported'))`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:

- one top-level root item per thread
- one reply depth only
- reply must belong to same `thread_id` and `card_id`

### `card_clarification_reports`

- `id uuid primary key`
- `item_id uuid not null`
- `user_id uuid not null`
- `created_at timestamptz not null default now()`

## RLS Rules

### Read

- authenticated users can read clarifications for published community cards

### Create

- authenticated users can create root threads and replies on published community cards

### Update

- item author can soft-delete own item
- card creator can resolve thread

### Report

- authenticated users can report any visible clarification item
- unique report per `item_id + user_id`

## Server Actions

Add in `app/actions/clarifications.ts`:

- `getCardClarifications(cardId: string)`
- `createClarification(cardId: string, kind: ClarificationKind, body: string)`
- `replyToClarification(threadId: string, body: string)`
- `resolveClarification(threadId: string)`
- `deleteClarificationItem(itemId: string)`
- `reportClarificationItem(itemId: string)`

## Shared Types

Add in `lib/types.ts`:

- `ClarificationKind`
- `ClarificationThreadStatus`
- `CardClarificationThreadRecord`
- `CardClarificationItemRecord`
- `CardClarificationReportRecord`
- `CardClarificationThreadView`

## UI Components

### Server/Container

- `components/clarifications/CardClarifications.tsx`

### Client Components

- `ClarificationSummary.tsx`
- `ClarificationThreadList.tsx`
- `ClarificationThreadItem.tsx`
- `ClarificationReplyItem.tsx`
- `ClarificationComposerSheet.tsx`
- `ClarificationReplySheet.tsx`
- `ClarificationOverflowMenu.tsx`

### Design Constraints

- no wrapper-heavy architecture
- one surface for the section, not one surface per nested element
- threads use spacing and subtle separators, not repeated boxed cards
- action rows stay compact

## Query Shape

`getCardClarifications(cardId)` should return:

- `openThreads`
- `resolvedThreads`
- `summary`
  - `openCount`
  - `resolvedCount`
  - `totalCount`
- viewer capabilities
  - `canCreate`
  - `canResolve`

Each thread view should include:

- thread metadata
- root item
- replies
- author profile info
- viewer permissions

## Community Detail Page Changes

Modify `app/(app)/community/[id]/page.tsx`:

- fetch clarification data server-side
- render summary + thread list below current card actions
- keep all actions on the same screen

Do not create a separate `/community/[id]/discussion` route in V1.

## Ordering Rules

Open threads:

- unresolved first
- then most recent activity descending

Resolved threads:

- resolved descending by `resolved_at`
- collapsed by default

Replies:

- chronological ascending

## Validation Rules

- body length minimum: `8`
- body length maximum: `600`
- trim whitespace
- no empty replies
- enforce one reply level only

## Moderation Rules

### Delete

Use soft delete:

- replace body with `Deleted`
- preserve thread structure

### Report

- no hard hide on first report in V1
- store report
- increment moderation visibility later

### Resolve

- only card creator can resolve
- resolution does not lock replies yet in V1

## Analytics

Track:

- `clarification_opened`
- `clarification_created`
- `clarification_replied`
- `clarification_resolved`
- `clarification_reported`
- `clarification_deleted`
- `clarification_sheet_opened`

## Rollout Sequence

### Step 1

Add migration and types.

### Step 2

Add server actions and RLS-safe query layer.

### Step 3

Render read-only clarification list on community card detail.

### Step 4

Add create thread composer sheet.

### Step 5

Add reply flow.

### Step 6

Add resolve, report, and delete actions.

### Step 7

Add analytics and polish.

## Build Order For Codex

1. Create migration for clarification tables, indexes, constraints, and RLS.
2. Add shared clarification types in `lib/types.ts`.
3. Add `app/actions/clarifications.ts`.
4. Add fetch helpers and view mapping.
5. Build read-only thread list components.
6. Mount clarifications on community card detail.
7. Add composer sheet for root clarification creation.
8. Add reply sheet and optimistic refresh behavior.
9. Add resolve/report/delete actions.
10. Add analytics hooks and UI polish.

## Success Criteria For V1

V1 is successful if:

- users can clarify a public card without leaving the card screen
- creators can resolve obvious questions or corrections
- the thread stays compact on mobile
- the feature improves trust without creating social sprawl
