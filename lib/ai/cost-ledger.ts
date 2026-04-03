import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import { AI_PRICING_VERSION } from './costs'

type CostStage = 'planner' | 'image' | 'cache_hit' | 'seed'

type CostEntry = {
  userId: string
  sessionId?: string | null
  cardId?: string | null
  pointId?: string | null
  stage: CostStage
  model?: string | null
  quality?: string | null
  size?: string | null
  profileId?: string | null
  templateId?: string | null
  routeLevel?: string | null
  promptVersion?: string | null
  estimatedCostUsd: number
  inputTokens?: number | null
  outputTokens?: number | null
  totalTokens?: number | null
  inputTextTokens?: number | null
  inputImageTokens?: number | null
  outputTextTokens?: number | null
  outputImageTokens?: number | null
  metadata?: Record<string, unknown> | null
}

export async function recordGenerationCosts(supabase: SupabaseClient, entries: CostEntry[]) {
  const rows = entries
    .filter((entry) => entry.estimatedCostUsd > 0 || entry.stage === 'cache_hit' || entry.stage === 'seed')
    .map((entry) => ({
      user_id: entry.userId,
      session_id: entry.sessionId ?? null,
      card_id: entry.cardId ?? null,
      point_id: entry.pointId ?? null,
      stage: entry.stage,
      model: entry.model ?? null,
      quality: entry.quality ?? null,
      size: entry.size ?? null,
      profile_id: entry.profileId ?? null,
      template_id: entry.templateId ?? null,
      route_level: entry.routeLevel ?? null,
      prompt_version: entry.promptVersion ?? null,
      pricing_version: AI_PRICING_VERSION,
      estimated_cost_usd: entry.estimatedCostUsd,
      input_tokens: entry.inputTokens ?? null,
      output_tokens: entry.outputTokens ?? null,
      total_tokens: entry.totalTokens ?? null,
      input_text_tokens: entry.inputTextTokens ?? null,
      input_image_tokens: entry.inputImageTokens ?? null,
      output_text_tokens: entry.outputTextTokens ?? null,
      output_image_tokens: entry.outputImageTokens ?? null,
      metadata: entry.metadata ?? null,
    }))

  if (rows.length === 0) {
    return
  }

  const { error } = await supabase.from('generation_costs').insert(rows)

  if (error) {
    throw error
  }
}
