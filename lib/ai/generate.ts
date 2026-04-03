import 'server-only'
import OpenAI from 'openai'

import type { PlannerMode } from '@/lib/types'
import { routePromptProfile } from './prompt-router'
import {
  buildCompactPlannerGuidance,
  buildDeterministicPlan,
  IMAGE_MODEL,
  IMAGE_SIZE,
  PLANNER_MODEL,
  PROMPT_VERSION,
  trimText,
  type PromptProfileId,
  type VisualPlan,
} from './prompt-profiles'
import { buildToonImagePrompt } from './toon/toon-builder'
import { encodeToonPayload, isToonTemplateId } from './toon/toon-encode'
import { selectToonTemplate } from './toon/toon-selector'
import type { ToonRouteLevel, ToonTemplateId } from './toon/toon-types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type GenerationStrategy = {
  profileId: PromptProfileId
  plannerMode: PlannerMode
  templateId: ToonTemplateId
  routeLevel: ToonRouteLevel
}

function uniqueShortList(values: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(values)) {
    return []
  }

  const seen = new Set<string>()
  const cleaned: string[] = []

  for (const value of values) {
    const item = trimText(typeof value === 'string' ? value : String(value ?? ''), maxLength)
    if (!item) continue

    const key = item.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    cleaned.push(item)

    if (cleaned.length >= maxItems) {
      break
    }
  }

  return cleaned
}

function buildFallbackPlan(pointText: string, concept: string, sessionContext: string): VisualPlan {
  return {
    conceptType: concept || 'medical concept',
    coreTeachingPoint: 'Show what is happening, where intervention or change occurs, and what follows.',
    learningObjective: 'Show what is happening, where intervention or change occurs, and what follows.',
    densityMode: 'quick-scan card',
    visualStory: 'One clear medical teaching scene with a simple left-to-right explanatory flow.',
    visualStructure: 'mechanism strip',
    dominantScanPath: 'left to right',
    titleText: trimText(concept || 'Learning card', 48),
    microLabels: uniqueShortList(
      [concept, 'target', 'action', 'outcome'].filter(Boolean),
      4,
      24,
    ),
    mainEntities: uniqueShortList([concept, 'target', 'action', 'outcome'], 4, 24),
    causalLinks: ['problem -> intervention -> outcome'],
    sequence: ['problem', 'intervention', 'outcome'],
    contrastAxes: [],
    warnings: [],
    mustKeep: ['main teaching point'],
    supportingCues: uniqueShortList([sessionContext], 2, 80),
    avoid: [
      'black background',
      'dense paragraphs',
      'prompt artifact text',
      'unrelated disease mechanisms',
      'generic stock infographic look',
    ],
    sceneDescription: trimText(pointText, 280),
    recommendedTemplateId: 'mechanism-board',
  }
}

function sanitizePlan(
  parsed: Partial<VisualPlan>,
  fallbackCategory: string,
  fallbackPointText: string,
  fallbackTemplateId: ToonTemplateId,
): VisualPlan {
  const recommendedTemplateId = isToonTemplateId(parsed.recommendedTemplateId)
    ? parsed.recommendedTemplateId
    : fallbackTemplateId

  return {
    conceptType: trimText(parsed.conceptType, 64) || fallbackCategory || 'medical concept',
    coreTeachingPoint:
      trimText(parsed.coreTeachingPoint, 220) ||
      trimText(parsed.learningObjective, 220) ||
      'Show what is happening, where the intervention acts, and what follows.',
    learningObjective:
      trimText(parsed.learningObjective, 220) ||
      'Show what is happening, where the intervention acts, and what follows.',
    densityMode: trimText(parsed.densityMode, 64) || 'quick-scan card',
    visualStory: trimText(parsed.visualStory, 220) || 'One clear medical teaching story.',
    visualStructure: trimText(parsed.visualStructure, 64) || 'mechanism strip',
    dominantScanPath: trimText(parsed.dominantScanPath, 64) || 'left to right',
    titleText: trimText(parsed.titleText, 48) || trimText(fallbackCategory || 'Learning card', 48),
    microLabels: uniqueShortList(parsed.microLabels, 4, 28),
    mainEntities: uniqueShortList(parsed.mainEntities, 5, 28),
    causalLinks: uniqueShortList(parsed.causalLinks, 4, 72),
    sequence: uniqueShortList(parsed.sequence, 5, 48),
    contrastAxes: uniqueShortList(parsed.contrastAxes, 4, 48),
    warnings: uniqueShortList(parsed.warnings, 3, 48),
    mustKeep: uniqueShortList(parsed.mustKeep, 4, 64),
    supportingCues: uniqueShortList(parsed.supportingCues, 4, 80),
    avoid: uniqueShortList(parsed.avoid, 8, 80),
    sceneDescription: trimText(parsed.sceneDescription, 420) || trimText(fallbackPointText, 280),
    recommendedTemplateId,
  }
}

function buildPlannerPayload(input: {
  pointText: string
  category: string
  sessionContext: string
  preferences?: { density?: string; specialty?: string }
  strategy: GenerationStrategy
}) {
  return encodeToonPayload({
    lesson: {
      pt: trimText(input.pointText, 320),
      cat: trimText(input.category || 'Not specified', 64),
      ctx: trimText(input.sessionContext || 'None', 1400),
    },
    prefs: {
      density: input.preferences?.density || 'balanced',
      specialty: input.preferences?.specialty || 'General Medicine',
    },
    route: {
      profile: input.strategy.profileId,
      planner: input.strategy.plannerMode,
      template: input.strategy.templateId,
      level: input.strategy.routeLevel,
    },
  })
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

export async function generateVisualPlan(
  pointText: string,
  category: string,
  sessionContext: string,
  preferences?: { density?: string; specialty?: string },
  strategy?: GenerationStrategy,
): Promise<{
  plan: VisualPlan
  plannerMode: PlannerMode
  profileId: string
  templateId: ToonTemplateId
  routeLevel: ToonRouteLevel
}> {
  const resolvedStrategy = strategy ?? resolveGenerationStrategy(pointText, category, category)
  const deterministicPlan = buildDeterministicPlan(resolvedStrategy.profileId, pointText, category)

  if (resolvedStrategy.plannerMode === 'deterministic' && deterministicPlan) {
    return {
      plan: deterministicPlan,
      plannerMode: resolvedStrategy.plannerMode,
      profileId: resolvedStrategy.profileId,
      templateId: resolvedStrategy.templateId,
      routeLevel: resolvedStrategy.routeLevel,
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: PLANNER_MODEL,
      temperature: 0.25,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: buildCompactPlannerGuidance(),
        },
        {
          role: 'user',
          content: [
            'Choose the best single-image teaching approach for this one point.',
            'Keep the plan rich enough for the image model to understand the lesson, but compact enough to stay clean and scannable.',
            'Payload (TOON):',
            buildPlannerPayload({
              pointText,
              category,
              sessionContext,
              preferences,
              strategy: resolvedStrategy,
            }),
          ].join('\n\n'),
        },
      ],
    })

    const raw = response.choices[0]?.message?.content ?? ''
    const parsed = JSON.parse(raw) as Partial<VisualPlan>

    const plan = sanitizePlan(parsed, category, pointText, resolvedStrategy.templateId)

    return {
      plannerMode: resolvedStrategy.plannerMode,
      profileId: resolvedStrategy.profileId,
      templateId: plan.recommendedTemplateId || resolvedStrategy.templateId,
      routeLevel: resolvedStrategy.routeLevel,
      plan,
    }
  } catch (error) {
    console.error('Visual planning failed:', error)
    return {
      plan: buildFallbackPlan(pointText, category, sessionContext),
      plannerMode: resolvedStrategy.plannerMode,
      profileId: resolvedStrategy.profileId,
      templateId: resolvedStrategy.templateId,
      routeLevel: resolvedStrategy.routeLevel,
    }
  }
}

export async function generateCardImage(
  text: string,
  category: string,
  sessionContext: string,
  preferences?: { density?: string; specialty?: string },
  options?: {
    strategy?: GenerationStrategy
  },
): Promise<{
  imageBase64: string
  prompt: string
  plan: VisualPlan
  plannerMode: PlannerMode
  profileId: string
  templateId: ToonTemplateId
  routeLevel: ToonRouteLevel
  model: string
  promptVersion: string
}> {
  const { plan, plannerMode, profileId, templateId, routeLevel } = await generateVisualPlan(
    text,
    category,
    sessionContext,
    preferences,
    options?.strategy,
  )
  const prompt = buildToonImagePrompt(text, category, sessionContext, plan, templateId)

  const response = await openai.images.generate({
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: IMAGE_SIZE,
    quality: 'high',
    output_format: 'png',
  })

  const imageBase64 = response?.data?.[0]?.b64_json
  if (!imageBase64) {
    throw new Error('Failed to generate card image')
  }

  return {
    imageBase64,
    prompt,
    plan,
    plannerMode,
    profileId,
    templateId,
    routeLevel,
    model: IMAGE_MODEL,
    promptVersion: PROMPT_VERSION,
  }
}
