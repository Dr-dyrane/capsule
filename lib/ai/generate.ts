import 'server-only'
import OpenAI from 'openai'
import { readFile } from 'node:fs/promises'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const IMAGE_MODEL = 'gpt-image-1.5'
const PLANNER_MODEL = 'gpt-4.1'
const IMAGE_SIZE = '1536x1024'

type VisualPlan = {
  conceptType: string
  learningObjective: string
  densityMode: string
  visualStory: string
  visualStructure: string
  dominantScanPath: string
  titleText: string
  microLabels: string[]
  supportingCues: string[]
  avoid: string[]
  sceneDescription: string
}

function trimText(value: string | null | undefined, limit: number) {
  const compact = (value ?? '').replace(/\s+/g, ' ').trim()
  if (compact.length <= limit) {
    return compact
  }

  return `${compact.slice(0, Math.max(0, limit - 3)).trimEnd()}...`
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

/**
 * Loads the root Agent.md so the prompt planner follows the real project rules,
 * not a hard-coded approximation inside the generator.
 */
async function loadAgentGuidance() {
  const guidancePath = new URL('../../agent.md', import.meta.url)

  try {
    return await readFile(guidancePath, 'utf8')
  } catch (error) {
    console.error('Failed to load capsule/agent.md:', error)
    return ''
  }
}

function buildPlannerSystemPrompt(agentGuidance: string) {
  return `You are Capsule's visual teaching planner.

Your job is to turn one medical teaching point into a single excellent visual plan for a 16:9 illustrative learning card.

Priorities:
- understanding first, memorization second
- choose structure dynamically instead of forcing templates
- keep the visual concept-pure and medically accurate
- reduce visual clutter aggressively
- prefer pale editorial medical boards over dark cinematic posters
- allow text only when it truly improves comprehension
- prefer iconography, arrows, anatomy, and chips over long rendered text
- keep the result in the visual family described by the project rules

Return JSON only.

Required JSON keys:
- conceptType
- learningObjective
- densityMode
- visualStory
- visualStructure
- dominantScanPath
- titleText
- microLabels
- supportingCues
- avoid
- sceneDescription

JSON rules:
- titleText: short, 2-5 words when possible
- microLabels: array of 0-4 very short labels only, ideally 1-2 words each
- supportingCues: array of 0-4 compact icon-friendly cues
- avoid: array of 4-8 concrete things to avoid
- sceneDescription: one concise paragraph describing the actual scene

Project guidance:
${agentGuidance}`
}

export async function generateVisualPlan(
  pointText: string,
  concept: string,
  sessionContext: string,
  preferences?: { density?: string; specialty?: string }
): Promise<VisualPlan> {
  const agentGuidance = await loadAgentGuidance()

  if (!agentGuidance) {
    return buildFallbackPlan(pointText, concept, sessionContext)
  }

  try {
    const response = await openai.chat.completions.create({
      model: PLANNER_MODEL,
      temperature: 0.25,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: buildPlannerSystemPrompt(agentGuidance),
        },
        {
          role: 'user',
          content: `Teaching point: ${pointText}
Category: ${concept || 'Not specified'}
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
      conceptType: trimText(parsed.conceptType, 64) || concept || 'medical concept',
      learningObjective:
        trimText(parsed.learningObjective, 220) ||
        'Show what is happening, where the intervention acts, and what follows.',
      densityMode: trimText(parsed.densityMode, 64) || 'quick-scan card',
      visualStory: trimText(parsed.visualStory, 220) || 'One clear medical teaching story.',
      visualStructure: trimText(parsed.visualStructure, 64) || 'mechanism strip',
      dominantScanPath: trimText(parsed.dominantScanPath, 64) || 'left to right',
      titleText: trimText(parsed.titleText, 48) || trimText(concept || 'Learning card', 48),
      microLabels: uniqueShortList(parsed.microLabels, 5, 28),
      supportingCues: uniqueShortList(parsed.supportingCues, 4, 80),
      avoid: uniqueShortList(parsed.avoid, 8, 80),
      sceneDescription: trimText(parsed.sceneDescription, 420) || trimText(pointText, 280),
    }
  } catch (error) {
    console.error('Visual planning failed:', error)
    return buildFallbackPlan(pointText, concept, sessionContext)
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
    'Style/medium: premium editorial medical infographic, soft anatomy and cellular illustration, clear academic hierarchy, clean white or pale warm background, subtle gradient or paper-like texture, crisp boxed modules or flow rails only when they improve comprehension.',
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
  preferences?: { density?: string; specialty?: string }
): Promise<{
  imageBase64: string
  prompt: string
  plan: VisualPlan
}> {
  const plan = await generateVisualPlan(text, category, sessionContext, preferences)
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
  }
}
