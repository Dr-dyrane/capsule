# Capsule Discussion Plan

## Product Position

Capsule should support user-to-user discussion around learning objects.
It should not become a messaging platform.

That means:

- discussion is attached to a public card or public library
- discussion is visible in context
- discussion helps understanding, correction, and reuse
- no direct messages
- no user inbox
- no contact graph
- no generic chat surface

## Recommendation

Use public contextual discussion, not private messaging.

Good fit:

- `Ask a question` on a public card
- `Add clarification` on a public card
- `Discuss this library` on a published library
- image attachments inside a discussion reply when the image supports the teaching point

Bad fit:

- person-to-person chat
- off-topic conversations
- long private back-and-forth threads
- building a social network layer

## V1 Scope

V1 should stay narrow:

- discussions only on published community cards
- top-level discussion posts plus one level of replies
- text required
- optional single image attachment per post or reply
- creator and community can reply in the same thread
- users can report a discussion item
- users can delete their own discussion items

Out of scope for V1:

- direct messaging
- group chat
- voice or video
- threaded replies beyond one level
- @mentions
- push notifications
- typing indicators
- read receipts

## Why Image Support Makes Sense

Image support is useful if it is evidence, not decoration.

Allowed examples:

- annotated screenshot of a source note
- supporting diagram
- cropped reference image that clarifies a mechanism
- comparison image that explains why a card should be corrected

Not ideal:

- casual selfies
- unrelated media
- generic meme usage

So yes, support image attachments in discussion.
But attach them to a card discussion object, not to a user profile or chat thread.

## UX Model

### Entry Points

- `Discuss` on community card detail
- `View discussion` if a thread already exists
- later: `Discuss library` on published library pages

### Discussion Layout

Each community card gets a compact discussion section:

- thread count
- top threads sorted by recent activity
- composer with short prompt like `Add a question or clarification`
- optional image attach action
- replies nested one level only

### Composer Rules

- short and direct
- placeholder should guide educational use
- image attach should feel secondary
- no giant rich text editor

### Mobile Behavior

- discussion opens inline below the card on detail pages
- composer can expand into a sheet for image attachment
- replies remain single-column

## Moderation Rules

Need this from day one:

- report discussion post
- soft delete own post
- basic rate limit
- server-side file type and size validation
- image upload constrained to supported formats

Recommended later:

- creator moderation on their own published cards
- admin moderation queue for flagged discussion items

## Data Model

### `discussion_threads`

- `id`
- `card_id`
- `created_by`
- `root_post_id`
- `reply_count`
- `last_activity_at`
- `created_at`

### `discussion_posts`

- `id`
- `thread_id`
- `card_id`
- `user_id`
- `parent_post_id` nullable
- `body`
- `image_path` nullable
- `image_width` nullable
- `image_height` nullable
- `status` (`active`, `deleted`, `reported`)
- `created_at`
- `updated_at`

### `discussion_reports`

- `id`
- `post_id`
- `user_id`
- `created_at`

## Storage

Use a dedicated bucket such as `discussion`.

Rules:

- authenticated users only for upload
- path scoped by `card_id` and `user_id`
- strict file size cap
- signed URLs for display

## API / Action Layer

Needed actions:

- `getCardDiscussion(cardId)`
- `createDiscussionPost(cardId, body, image?)`
- `replyToDiscussion(postId, body, image?)`
- `deleteDiscussionPost(postId)`
- `reportDiscussionPost(postId)`

## Rollout Plan

### Phase 1

- card-level public discussion
- text replies
- no images yet

### Phase 2

- single image attachment per post
- storage validation
- signed URL rendering

### Phase 3

- library-level discussion if card-level usage is healthy

## Success Signals

- % of saved or remixed community cards with discussion views
- % of cards with at least one useful thread
- reply rate from creators or knowledgeable users
- no moderation overload

## Final Product Decision

Yes to:

- user-to-user discussion
- public replies
- image attachments that support clarification

No to:

- user-to-user messaging
- private inboxes
- open-ended social chat

Capsule should be a learning discussion layer on top of cards, not a communication platform.
