import type { PlannerMode } from '@/lib/types'
import { routePromptProfile } from './prompt-router'
import type { PromptProfileId } from './prompt-profiles'
import { selectToonTemplate } from './toon/toon-selector'
import type { ToonRouteLevel, ToonTemplateId } from './toon/toon-types'

export type GenerationStrategy = {
  profileId: PromptProfileId
  plannerMode: PlannerMode
  templateId: ToonTemplateId
  routeLevel: ToonRouteLevel
}

export function resolveGenerationStrategy(
  pointText: string,
  category?: string | null,
  concept?: string | null,
): GenerationStrategy {
  const route = routePromptProfile(pointText, category, concept)
  const toon = selectToonTemplate({
    profileId: route.profileId,
    plannerMode: route.plannerMode,
    pointText,
    category,
    concept,
  })

  return {
    profileId: route.profileId,
    plannerMode: toon.plannerMode,
    templateId: toon.templateId,
    routeLevel: toon.routeLevel,
  }
}
