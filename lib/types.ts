export type SessionStatus =
  | 'uploading'
  | 'processing'
  | 'generating'
  | 'complete'
  | 'error'

export interface SessionRecord {
  id: string
  user_id: string
  source_url: string
  status: SessionStatus
  point_count: number | null
  card_count: number | null
  session_context: string | null
  created_at?: string
  updated_at?: string
}

export interface PointRecord {
  id: string
  session_id: string
  text: string
  category: string | null
  concept: string | null
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
  created_at?: string
  points?: PointRecord | PointRecord[]
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
