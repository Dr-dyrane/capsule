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

export async function generateCardImage(text: string, category: string): Promise<string> {
  const agentGuidance = await loadAgentGuidance()
  const prompt = [
    'Create a polished 16:9 landscape medical learning card.',
    'This is for Capsule, a quick-scan educational product that turns notes into visual understanding.',
    `Topic: ${text}`,
    `Category: ${category || 'General medicine'}`,
    'Follow these image requirements:',
    '- illustrative first, not text-heavy',
    '- quick scan comprehension within a few seconds',
    '- use concise labels only when they improve understanding',
    '- premium editorial medical infographic style',
    '- clear hierarchy, low clutter, strong spacing',
    '- use the best explanatory structure for the concept rather than forcing a template',
    '- preserve medical accuracy',
    '- 16:9 landscape composition',
    '- no prompt artifact text, no provenance text, no unrelated diseases or mechanisms',
    '',
    'Capsule guidance:',
    agentGuidance,
  ].join('\n')

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
