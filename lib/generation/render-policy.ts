import type { CommunityVisibility } from '@/lib/types'
import type { GenerationStrategy } from '@/lib/ai/strategy'

export type NoteRole = 'hero' | 'support' | 'overflow'
export type GenerationGate = 'automatic' | 'community-first' | 'manual' | 'reused' | 'premium'
export type ImageModel = 'gpt-image-1.5' | 'gpt-image-1-mini'
export type PlannerModel = 'gpt-4.1' | 'gpt-4.1-mini'
export type ImageQuality = 'low' | 'medium' | 'high'
export type ImageSize = '1536x1024'

export type RenderProfile = {
  imageModel: ImageModel
  plannerModel: PlannerModel
  imageQuality: ImageQuality
  imageSize: ImageSize
  reason: string
}

type RenderProfileInput = {
  noteRole: NoteRole
  generationGate: GenerationGate
  strategy: GenerationStrategy
  sessionVisibility?: CommunityVisibility | null
  forcePremium?: boolean
  allowHighQuality?: boolean
}

function isHardBoard(strategy: GenerationStrategy) {
  return (
    strategy.routeLevel === 'level-3' ||
    strategy.templateId === 'cascade' ||
    strategy.profileId === 'cascade'
  )
}

export function chooseRenderProfile(input: RenderProfileInput): RenderProfile {
  const hardBoard = isHardBoard(input.strategy)
  const shouldUsePremium =
    Boolean(input.allowHighQuality) &&
    (input.forcePremium || input.generationGate === 'premium')

  if (shouldUsePremium) {
    return {
      imageModel: 'gpt-image-1.5',
      plannerModel: hardBoard ? 'gpt-4.1' : 'gpt-4.1-mini',
      imageQuality: 'high',
      imageSize: '1536x1024',
      reason: 'Intentional premium render',
    }
  }

  if (input.noteRole === 'hero') {
    return {
      imageModel: 'gpt-image-1.5',
      plannerModel: hardBoard ? 'gpt-4.1' : 'gpt-4.1-mini',
      imageQuality: 'medium',
      imageSize: '1536x1024',
      reason: hardBoard ? 'Hard-board automatic hero kept at medium' : 'Hero-first automatic render',
    }
  }

  if (hardBoard) {
    return {
      imageModel: 'gpt-image-1.5',
      plannerModel: 'gpt-4.1-mini',
      imageQuality: 'medium',
      imageSize: '1536x1024',
      reason: 'Dense support card held at medium quality',
    }
  }

  return {
    imageModel: 'gpt-image-1-mini',
    plannerModel: 'gpt-4.1-mini',
    imageQuality: 'medium',
    imageSize: '1536x1024',
    reason: 'Default support render',
  }
}
