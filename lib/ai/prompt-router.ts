import type { PlannerMode } from '@/lib/types'
import type { PromptProfileId } from './prompt-profiles'

export type PromptRoute = {
  profileId: PromptProfileId
  plannerMode: PlannerMode
}

function hasAny(text: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(text))
}

export function routePromptProfile(pointText: string, category?: string | null, concept?: string | null): PromptRoute {
  const text = `${category ?? ''} ${concept ?? ''} ${pointText}`.toLowerCase()
  const compactText = pointText.replace(/\s+/g, ' ').trim()

  if (hasAny(text, [/risk factor/, /\brisk\b/, /\bpredisposition\b/])) {
    return { profileId: 'risk-map', plannerMode: 'deterministic' }
  }

  if (
    hasAny(text, [/\bday\b/, /\bdays\b/, /\bweek\b/, /\bweeks\b/, /\bmonth\b/, /\bmonths\b/, /\byear\b/, /\byears\b/, /\btimeline\b/]) &&
    hasAny(text, [/\bside effect/, /\btoxicity\b/, /\bemetogenic/, /\bregrow/, /\bonset\b/, /\bwithin\b/])
  ) {
    return { profileId: 'timeline', plannerMode: 'deterministic' }
  }

  if (hasAny(text, [/\bhighest\b/, /\blowest\b/, /\bleast\b/, /\bmost\b/, /\bmore\b/, /\bless\b/, /\bcomparison\b/, /\bcompare\b/])) {
    return { profileId: 'comparison', plannerMode: 'deterministic' }
  }

  if (
    hasAny(text, [
      /\bsyndrome\b/,
      /\blysis\b/,
      /\bcascade\b/,
      /\bpathophys/,
      /\bpathology\b/,
      /\brelease\b/,
      /\bresults? in\b/,
      /\bleads? to\b/,
      /\bcharacterized by\b/,
    ])
  ) {
    return { profileId: 'cascade', plannerMode: 'planner' }
  }

  if (
    compactText.length <= 220 &&
    (compactText.includes('+') ||
      hasAny(text, [/\bcombined with\b/, /\bplus\b/, /\bregimen\b/, /\binduction\b/, /\bmaintenance\b/, /\bprotocol\b/]))
  ) {
    return { profileId: 'regimen', plannerMode: 'planner' }
  }

  if ((category ?? '').toLowerCase() === 'regimen' && compactText.length <= 180) {
    return { profileId: 'regimen', plannerMode: 'planner' }
  }

  if ((category ?? '').toLowerCase() === 'drug' && compactText.length <= 180) {
    return { profileId: 'drug', plannerMode: 'planner' }
  }

  return { profileId: 'planner-default', plannerMode: 'planner' }
}
