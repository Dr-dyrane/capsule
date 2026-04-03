import { createHash } from 'node:crypto'

import type { PlannerMode } from '@/lib/types'
import { IMAGE_MODEL, PROMPT_VERSION } from './prompt-profiles'
import { TOON_VERSION } from './toon/toon-rules'
import type { ToonRouteLevel, ToonTemplateId } from './toon/toon-types'

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
  toonTemplateId: ToonTemplateId
  routeLevel: ToonRouteLevel
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
    toonTemplateId: input.toonTemplateId,
    routeLevel: input.routeLevel,
    toonVersion: TOON_VERSION,
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
