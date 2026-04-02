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
  status: 'generating' | 'complete' | 'error'
  card_order?: number | null
  created_at?: string
}
