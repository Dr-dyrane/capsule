import { createHash } from 'node:crypto'

import type { PlannerMode } from '@/lib/types'
import { IMAGE_MODEL, PROMPT_VERSION } from './prompt-profiles'

function normalizeText(value: string | null | undefined) {
  return (value ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
}

export function buildRenderCacheKey(input: {
  pointText: string
  category?: string | null
  concept?: string | null
  sessionContext?: string | null
  plannerMode: PlannerMode
  profileId: string
  density?: string
  specialty?: string
}) {
  const payload = JSON.stringify({
    pointText: normalizeText(input.pointText),
    category: normalizeText(input.category),
    concept: normalizeText(input.concept),
    sessionContext: normalizeText(input.sessionContext),
    plannerMode: input.plannerMode,
    profileId: input.profileId,
    density: normalizeText(input.density),
    specialty: normalizeText(input.specialty),
    model: IMAGE_MODEL,
    promptVersion: PROMPT_VERSION,
  })

  return createHash('sha256').update(payload).digest('hex')
}

export function buildPromptHash(prompt: string) {
  return createHash('sha256').update(prompt).digest('hex')
}
