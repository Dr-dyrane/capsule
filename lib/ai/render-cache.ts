import type { SupabaseClient } from '@supabase/supabase-js'

import type { RenderCacheRecord } from '@/lib/types'

export async function findRenderCache(
  supabase: SupabaseClient,
  userId: string,
  cacheKey: string,
) {
  const { data, error } = await supabase
    .from('render_cache')
    .select('*')
    .eq('user_id', userId)
    .eq('cache_key', cacheKey)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as RenderCacheRecord | null) ?? null
}

export async function upsertRenderCache(
  supabase: SupabaseClient,
  input: {
    userId: string
    cacheKey: string
    promptHash: string
    promptVersion: string
    model: string
    imageUrl: string
    prompt: string
    plan: Record<string, unknown>
    conceptType?: string
  },
) {
  const { error } = await supabase.from('render_cache').upsert(
    {
      user_id: input.userId,
      cache_key: input.cacheKey,
      prompt_hash: input.promptHash,
      prompt_version: input.promptVersion,
      model: input.model,
      image_url: input.imageUrl,
      prompt: input.prompt,
      plan: input.plan,
      concept_type: input.conceptType ?? null,
    },
    {
      onConflict: 'user_id,cache_key',
    },
  )

  if (error) {
    throw error
  }
}
