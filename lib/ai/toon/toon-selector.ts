import type { PlannerMode } from '@/lib/types'
import type { PromptProfileId } from '../prompt-profiles'
import type { ToonRouteLevel, ToonTemplateId } from './toon-types'

export type ToonSelection = {
  templateId: ToonTemplateId
  routeLevel: ToonRouteLevel
  plannerMode: PlannerMode
}

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text))
}

export function selectToonTemplate(input: {
  profileId: PromptProfileId
  plannerMode: PlannerMode
  pointText: string
  category?: string | null
  concept?: string | null
}): ToonSelection {
  const text = `${input.category ?? ''} ${input.concept ?? ''} ${input.pointText}`.toLowerCase()

  if (input.profileId === 'risk-map') {
    return { templateId: 'risk-map', routeLevel: 'level-1', plannerMode: input.plannerMode }
  }

  if (input.profileId === 'timeline') {
    return { templateId: 'timeline', routeLevel: 'level-1', plannerMode: input.plannerMode }
  }

  if (input.profileId === 'comparison') {
    return { templateId: 'comparison-board', routeLevel: 'level-1', plannerMode: input.plannerMode }
  }

  if (input.profileId === 'cascade') {
    return { templateId: 'cascade', routeLevel: 'level-2', plannerMode: input.plannerMode }
  }

  if (input.profileId === 'regimen') {
    if (hasAny(text, [/\binduction\b/, /\bmaintenance\b/, /\bprotocol\b/, /\bstep\b/, /\bsequence\b/])) {
      return { templateId: 'protocol-board', routeLevel: 'level-2', plannerMode: input.plannerMode }
    }

    return { templateId: 'mechanism-board', routeLevel: 'level-2', plannerMode: input.plannerMode }
  }

  if (input.profileId === 'drug') {
    return { templateId: 'mechanism-board', routeLevel: 'level-2', plannerMode: input.plannerMode }
  }

  if (hasAny(text, [/\bmechanism\b/, /\bcauses?\b/, /\bleads? to\b/, /\bresults? in\b/])) {
    return { templateId: 'cascade', routeLevel: 'level-2', plannerMode: 'planner' }
  }

  return { templateId: 'mechanism-board', routeLevel: 'level-3', plannerMode: 'planner' }
}
