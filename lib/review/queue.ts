import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import { isReviewSchemaError } from '@/lib/review/schema'
import type { ReviewSourceType } from '@/lib/types'

export async function ensureReviewItemExists(
  supabase: SupabaseClient,
  input: {
    userId: string
    cardId: string
    sourceType?: ReviewSourceType
  },
) {
  const { error } = await supabase.from('review_items').upsert(
    {
      user_id: input.userId,
      card_id: input.cardId,
      source_type: input.sourceType ?? 'generated',
      state: 'new',
      next_review_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,card_id',
      ignoreDuplicates: true,
    },
  )

  if (error) {
    if (isReviewSchemaError(error)) {
      return
    }

    throw error
  }
}
