import 'server-only'
import OpenAI from 'openai'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function loadAgentGuidance() {
  try {
    const guidancePath = path.join(process.cwd(), 'docs', 'agent.md')
    return await readFile(guidancePath, 'utf8')
  } catch {
    return ''
  }
}

function summarizeAgentGuidance(guidance: string) {
  const bulletLines = guidance
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean)

  const condensed = bulletLines.slice(0, 10).join('; ')

  if (condensed) {
    return condensed
  }

  return [
    'one clear teaching story',
    'minimal text',
    'low clutter',
    'medically accurate visuals',
    'fast scan comprehension',
  ].join('; ')
}

export async function generateCardImage(text: string, category: string): Promise<string> {
  const agentGuidance = summarizeAgentGuidance(await loadAgentGuidance())
  const promptSections = [
    'Create a polished 16:9 landscape medical learning card.',
    'This is for Capsule, a quick-scan educational product that turns notes into visual understanding.',
    `Topic: ${text}`,
    `Category: ${category || 'General medicine'}`,
    'Requirements: illustrative first, minimal text, quick scan, premium editorial medical infographic, clear hierarchy, low clutter, preserve medical accuracy, 16:9 landscape, no unrelated mechanisms or prompt artifact text.',
    `Capsule guidance: ${agentGuidance}`,
  ]

  let prompt = promptSections.join('\n')

  if (prompt.length > 3900) {
    const overflow = prompt.length - 3900
    const shortenedText = text.slice(0, Math.max(80, text.length - overflow - 24)).trim()
    prompt = [
      'Create a polished 16:9 landscape medical learning card.',
      `Topic: ${shortenedText}`,
      `Category: ${category || 'General medicine'}`,
      'Requirements: illustrative first, minimal text, quick scan, premium editorial medical infographic, low clutter, preserve medical accuracy, 16:9 landscape.',
      `Capsule guidance: ${agentGuidance}`,
    ].join('\n')
  }

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1792x1024',
    quality: 'hd',
    response_format: 'url',
  })

  const imageUrl = response?.data?.[0].url
  if (!imageUrl) throw new Error('Failed to generate card image')

  return imageUrl
}
