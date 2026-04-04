export type SessionStatus =
  | 'uploading'
  | 'processing'
  | 'generating'
  | 'complete'
  | 'error'

export type NoteRole = 'hero' | 'support' | 'overflow'
export type GenerationGate = 'automatic' | 'community-first' | 'manual' | 'reused' | 'premium'
export type EntitlementPlan = 'student_free' | 'sponsored' | 'premium_manual' | 'admin'
export type FundingSource = 'student_free' | 'manual' | 'sponsor' | 'donor' | 'school' | 'admin'
export type RenderCreditKind = 'support' | 'premium'

export type CommunityVisibility = 'private' | 'published'
export type CommunityReactionKind = 'like' | 'save'
export type CommunitySort = 'recent' | 'trending'
export type ClarificationKind = 'question' | 'clarification' | 'correction'
export type ClarificationThreadStatus = 'open' | 'resolved' | 'removed'
export type ClarificationItemStatus = 'active' | 'deleted' | 'reported'
export type ReviewItemState = 'new' | 'learning' | 'review'
export type ReviewScore = 'again' | 'good' | 'easy'
export type ReviewSourceType = 'generated' | 'saved_community'

export interface CommunityFilterMeta {
  templates: string[]
  categories: string[]
  topics: string[]
}

export interface SessionRecord {
  id: string
  user_id: string
  source_url: string
  status: SessionStatus
  point_count: number | null
  card_count: number | null
  session_context: string | null
  remix_source_card_id?: string | null
  visibility?: CommunityVisibility
  created_at?: string
  updated_at?: string
}

export interface PointRecord {
  id: string
  session_id: string
  text: string
  category: string | null
  concept: string | null
  note_role?: NoteRole
  sort_order: number
  card_count: number | null
  created_at?: string
}

export interface CardRecord {
  id: string
  point_id: string
  session_id: string
  image_url: string
  title: string | null
  status: 'queued' | 'generating' | 'complete' | 'error'
  card_order?: number | null
  generation_gate?: GenerationGate
  render_model?: string | null
  render_quality?: string | null
  reused_from_card_id?: string | null
  community_match_card_id?: string | null
  community_match_score?: number | null
  visibility?: CommunityVisibility
  published_at?: string | null
  published_by?: string | null
  community_template?: string | null
  community_hash?: string | null
  created_at?: string
  points?: PointRecord | PointRecord[]
}

export interface CommunityMatchRecord {
  card_id: string
  title: string | null
  image_url: string
  author_name: string | null
  community_template: string | null
  category: string | null
  concept: string | null
  score: number
}

export interface SessionRecommendationRecord {
  point_id: string
  role: NoteRole
  gate: GenerationGate
  match: (CommunityMatchRecord & {
    signed_url: string | null
  }) | null
}

export interface ProfileRecord {
  id: string
  username: string | null
  avatar_url: string | null
  auto_publish?: boolean
  updated_at?: string
}

export interface CommunityIndexRecord {
  card_id: string
  session_id: string
  image_url: string
  title: string | null
  published_at: string | null
  published_by: string | null
  community_template: string | null
  category: string | null
  concept: string | null
  author_name: string | null
  author_avatar_url: string | null
  like_count: number
  save_count: number
  report_count: number
  trend_score: number
}

export interface CommunityLibraryIndexRecord {
  session_id: string
  cover_image_url: string
  title: string | null
  published_at: string | null
  published_by: string | null
  author_name: string | null
  author_avatar_url: string | null
  card_count: number
  like_count: number
  save_count: number
  report_count: number
  trend_score: number
  category: string | null
  concept: string | null
}

export interface CommunityViewerState {
  liked: boolean
  saved: boolean
  reported?: boolean
}

export interface CardClarificationThreadRecord {
  id: string
  card_id: string
  created_by: string
  kind: ClarificationKind
  status: ClarificationThreadStatus
  root_item_id: string | null
  reply_count: number
  last_activity_at: string
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface CardClarificationItemRecord {
  id: string
  thread_id: string
  card_id: string
  user_id: string
  parent_item_id: string | null
  body: string
  status: ClarificationItemStatus
  created_at: string
  updated_at: string
}

export interface CardClarificationReportRecord {
  id: string
  item_id: string
  user_id: string
  created_at: string
}

export interface CardClarificationItemView {
  id: string
  thread_id: string
  user_id: string
  parent_item_id: string | null
  body: string
  status: ClarificationItemStatus
  created_at: string
  updated_at: string
  author_name: string | null
  author_avatar_url: string | null
  author_is_card_owner: boolean
  can_delete: boolean
  can_report: boolean
  has_reported: boolean
}

export interface CardClarificationThreadView {
  id: string
  card_id: string
  created_by: string
  kind: ClarificationKind
  status: ClarificationThreadStatus
  reply_count: number
  last_activity_at: string
  resolved_by: string | null
  resolved_at: string | null
  created_at: string
  root: CardClarificationItemView | null
  replies: CardClarificationItemView[]
  can_reply: boolean
  can_resolve: boolean
}

export interface CardClarificationListResult {
  supported: boolean
  open_count: number
  resolved_count: number
  threads: CardClarificationThreadView[]
}

export interface CardClarificationModerationItem {
  item_id: string
  thread_id: string
  card_id: string
  card_title: string | null
  thread_kind: ClarificationKind
  thread_status: ClarificationThreadStatus
  item_body: string
  parent_item_id: string | null
  item_created_at: string
  author_name: string | null
  author_avatar_url: string | null
  report_count: number
}

export interface CardClarificationModerationResult {
  supported: boolean
  items: CardClarificationModerationItem[]
}

export interface ReviewItemRecord {
  id: string
  user_id: string
  card_id: string
  source_type: ReviewSourceType
  state: ReviewItemState
  last_score: ReviewScore | null
  last_reviewed_at: string | null
  next_review_at: string
  review_count: number
  lapse_count: number
  created_at?: string
  updated_at?: string
}

export interface ReviewEventRecord {
  id: string
  user_id: string
  review_item_id: string
  score: ReviewScore
  reviewed_at: string
  created_at?: string
}

export interface ReviewQueueItem {
  review_item_id: string
  card_id: string
  session_id: string
  session_label: string | null
  source_type: ReviewSourceType
  title: string | null
  image_url: string
  signed_url: string | null
  point_text: string
  category: string | null
  concept: string | null
  note_role: NoteRole | null
  state: ReviewItemState
  last_score: ReviewScore | null
  last_reviewed_at: string | null
  next_review_at: string
  review_count: number
  lapse_count: number
}

export type GenerationRunStatus = 'queued' | 'running' | 'complete' | 'error' | 'cancelled'

export interface GenerationRunRecord {
  id: string
  session_id: string
  user_id: string
  status: GenerationRunStatus
  total_cards: number
  completed_cards: number
  failed_cards: number
  active_card_id: string | null
  last_error: string | null
  started_at: string | null
  finished_at: string | null
  created_at?: string
  updated_at?: string
}

export type CardJobStatus = 'queued' | 'running' | 'complete' | 'error'
export type PlannerMode = 'deterministic' | 'planner'

export interface CardJobRecord {
  id: string
  session_id: string
  card_id: string
  point_id: string
  reference_card_id?: string | null
  entitlement_kind?: RenderCreditKind | null
  entitlement_units?: number
  user_id: string
  status: CardJobStatus
  planner_mode: PlannerMode
  cache_key: string | null
  prompt_hash: string | null
  model: string | null
  prompt_version: string | null
  attempt_count: number
  claimed_at: string | null
  finished_at: string | null
  last_error: string | null
  created_at?: string
  updated_at?: string
}

export interface RenderCacheRecord {
  id: string
  user_id: string
  cache_key: string
  prompt_hash: string
  prompt_version: string
  model: string
  image_url: string
  prompt: string | null
  plan: Record<string, unknown> | null
  concept_type: string | null
  created_at?: string
  updated_at?: string
}

export type GenerationCostStage = 'planner' | 'image' | 'cache_hit' | 'seed'

export interface GenerationCostRecord {
  id: string
  user_id: string
  session_id: string | null
  card_id: string | null
  point_id: string | null
  stage: GenerationCostStage
  model: string | null
  quality: string | null
  size: string | null
  profile_id: string | null
  template_id: string | null
  route_level: string | null
  prompt_version: string | null
  pricing_version: string | null
  estimated_cost_usd: number
  input_tokens: number | null
  output_tokens: number | null
  total_tokens: number | null
  input_text_tokens: number | null
  input_image_tokens: number | null
  output_text_tokens: number | null
  output_image_tokens: number | null
  metadata: Record<string, unknown> | null
  created_at?: string
}

export interface UserEntitlementRecord {
  user_id: string
  plan: EntitlementPlan
  funding_source: FundingSource
  hero_auto_per_note: number
  support_renders_remaining: number
  premium_renders_remaining: number
  community_reuse_unlimited: boolean
  can_publish: boolean
  can_high_quality: boolean
  expires_at?: string | null
  notes?: string | null
  updated_at?: string
}

export interface EntitlementGrantRecord {
  id: string
  user_id: string
  granted_by: string
  grant_type: string
  support_renders: number
  premium_renders: number
  plan?: EntitlementPlan | null
  funding_source?: FundingSource | null
  reason?: string | null
  source_reference?: string | null
  expires_at?: string | null
  created_at?: string
}

export interface UserDirectoryRecord {
  user_id: string
  email: string
  display_name?: string | null
  avatar_url?: string | null
  updated_at?: string
}
