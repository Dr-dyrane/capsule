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
  type VisualPlan,
} from './prompt-profiles'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    supportingCues: uniqueShortList([sessionContext], 2, 80),
    avoid: [
      'black background',
      'dense paragraphs',
      'prompt artifact text',
      'unrelated disease mechanisms',
      'generic stock infographic look',
    ],
    sceneDescription: trimText(pointText, 280),
  }
}

export async function generateVisualPlan(
  pointText: string,
  category: string,
  sessionContext: string,
  preferences?: { density?: string; specialty?: string },
): Promise<{
  plan: VisualPlan
  plannerMode: PlannerMode
  profileId: string
}> {
  const route = routePromptProfile(pointText, category, category)
  const deterministicPlan = buildDeterministicPlan(route.profileId, pointText, category)

  if (route.plannerMode === 'deterministic' && deterministicPlan) {
    return {
      plan: deterministicPlan,
      plannerMode: route.plannerMode,
      profileId: route.profileId,
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
          content: `Teaching point: ${pointText}
Category: ${category || 'Not specified'}
Session context: ${trimText(sessionContext, 1400) || 'None'}
User Preference - Density: ${preferences?.density || 'balanced'}
User Preference - Specialty: ${preferences?.specialty || 'General Medicine'}

Choose the best single-image teaching approach for this one point. Keep the plan rich enough for the image model to understand the lesson, but compact enough to stay clean and scannable.`,
        },
      ],
    })

    const raw = response.choices[0]?.message?.content ?? ''
    const parsed = JSON.parse(raw) as Partial<VisualPlan>

    return {
      plannerMode: 'planner',
      profileId: route.profileId,
      plan: {
        conceptType: trimText(parsed.conceptType, 64) || category || 'medical concept',
        learningObjective:
          trimText(parsed.learningObjective, 220) ||
          'Show what is happening, where the intervention acts, and what follows.',
        densityMode: trimText(parsed.densityMode, 64) || 'quick-scan card',
        visualStory: trimText(parsed.visualStory, 220) || 'One clear medical teaching story.',
        visualStructure: trimText(parsed.visualStructure, 64) || 'mechanism strip',
        dominantScanPath: trimText(parsed.dominantScanPath, 64) || 'left to right',
        titleText: trimText(parsed.titleText, 48) || trimText(category || 'Learning card', 48),
        microLabels: uniqueShortList(parsed.microLabels, 5, 28),
        supportingCues: uniqueShortList(parsed.supportingCues, 4, 80),
        avoid: uniqueShortList(parsed.avoid, 8, 80),
        sceneDescription: trimText(parsed.sceneDescription, 420) || trimText(pointText, 280),
      },
    }
  } catch (error) {
    console.error('Visual planning failed:', error)
    return {
      plan: buildFallbackPlan(pointText, category, sessionContext),
      plannerMode: 'planner',
      profileId: route.profileId,
    }
  }
}

export function buildCardImagePrompt(
  pointText: string,
  concept: string,
  sessionContext: string,
  plan: VisualPlan,
) {
  const contextLine = trimText(sessionContext, 320)
  const labelLine =
    plan.microLabels.length > 0
      ? plan.microLabels.map((label) => `"${label}"`).join(', ')
      : 'Use only a short title and the smallest number of micro-labels needed for clarity.'
  const cueLine =
    plan.supportingCues.length > 0 ? plan.supportingCues.join('; ') : 'No extra supporting cues unless they improve understanding.'
  const avoidItems = uniqueShortList(
    [
      ...plan.avoid,
      'black background',
      'dense paragraphs',
      'overcrowded labels',
      'prompt artifact text',
      'unrelated diseases or mechanisms',
      'generic startup illustration style',
      'childish cartoon look',
    ],
    10,
    80,
  )

  return [
    'Use case: infographic-diagram',
    'Asset type: 16:9 medical learning card',
    `Primary request: create a polished, easy-to-scan illustrative medical learning card for "${trimText(pointText, 180)}"`,
    `Concept type: ${plan.conceptType}`,
    `Learning objective: ${plan.learningObjective}`,
    `Density mode: ${plan.densityMode}`,
    `Visual story: ${plan.visualStory}`,
    `Chosen structure: ${plan.visualStructure}`,
    `Dominant scan path: ${plan.dominantScanPath}`,
    `Main scene: ${plan.sceneDescription}`,
    contextLine ? `Context for accuracy: ${contextLine}` : '',
    `Title text if needed: "${plan.titleText || trimText(concept || 'Learning card', 40)}"`,
    `Allowed micro-labels only if essential: ${labelLine}`,
    `Supporting cues: ${cueLine}`,
    'Style/medium: premium editorial medical infographic, soft anatomy and cellular illustration, clear academic hierarchy, clean clinical composition, crisp boxed modules or flow rails only when they improve comprehension.',
    'Composition/framing: one dominant scene or one tightly controlled modular board, visually understandable in a few seconds, strong foreground subject, generous spacing, calm negative space, no decorative clutter.',
    'Text rules: keep text sparse, short, and purposeful. Use at most one short title and a few tiny labels. Prefer icons, arrows, and symbol chips over extra words. If a label would be longer than two words, convert it into iconography instead. No paragraphs. No provenance text. No prompt notes. No page numbers. No repeated labels.',
    'Medical rules: concept-pure, mechanism-accurate, no imported logic from unrelated diseases or drug classes.',
    `Avoid: ${avoidItems.join('; ')}`,
    'Quality: high',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function generateCardImage(
  text: string,
  category: string,
  sessionContext: string,
  preferences?: { density?: string; specialty?: string },
): Promise<{
  imageBase64: string
  prompt: string
  plan: VisualPlan
  plannerMode: PlannerMode
  profileId: string
  model: string
  promptVersion: string
}> {
  const { plan, plannerMode, profileId } = await generateVisualPlan(text, category, sessionContext, preferences)
  const prompt = buildCardImagePrompt(text, category, sessionContext, plan)

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
    model: IMAGE_MODEL,
    promptVersion: PROMPT_VERSION,
  }
}
