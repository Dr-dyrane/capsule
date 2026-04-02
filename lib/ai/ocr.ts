import 'server-only'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ExtractionPoint {
  text: string
  category: string
  concept: 'Drug' | 'Disease' | 'Mechanism' | 'Regimen' | 'Other'
  card_count: number
}

export interface ExtractionResult {
  points: ExtractionPoint[]
  session_context: string
}

type RawPoint = Record<string, unknown>

const VALID_CONCEPTS = new Set<ExtractionPoint['concept']>([
  'Drug',
  'Disease',
  'Mechanism',
  'Regimen',
  'Other',
])

function normalizeConcept(value: unknown): ExtractionPoint['concept'] {
  if (typeof value !== 'string') {
    return 'Other'
  }

  const normalized = value.trim().toLowerCase()

  if (normalized === 'drug') return 'Drug'
  if (normalized === 'disease') return 'Disease'
  if (normalized === 'mechanism') return 'Mechanism'
  if (normalized === 'regimen') return 'Regimen'
  if (VALID_CONCEPTS.has(value as ExtractionPoint['concept'])) return value as ExtractionPoint['concept']

  return 'Other'
}

function normalizeCardCount(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.min(parsed, 3)
}

function getPointText(point: RawPoint): string | null {
  const candidates = [
    point.text,
    point.point,
    point.teaching_point,
    point.summary,
    point.content,
    point.note,
    point.title,
  ]

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim()
    }
  }

  return null
}

function pickPointsArray(parsed: unknown): RawPoint[] {
  if (Array.isArray(parsed)) {
    return parsed.filter((item): item is RawPoint => typeof item === 'object' && item !== null)
  }

  if (!parsed || typeof parsed !== 'object') {
    return []
  }

  const record = parsed as Record<string, unknown>
  const candidates = [
    record.points,
    record.teaching_points,
    record.extracted_points,
    record.items,
    record.results,
    record.data,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is RawPoint => typeof item === 'object' && item !== null)
    }
  }

  return []
}

function normalizeExtractionResult(content: string): ExtractionResult {
  let parsed: unknown

  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('OCR returned invalid JSON.')
  }

  const points = pickPointsArray(parsed)
    .map((point) => {
      const text = getPointText(point)

      if (!text) {
        return null
      }

      return {
        text,
        category: typeof point.category === 'string' && point.category.trim() ? point.category.trim() : 'General',
        concept: normalizeConcept(point.concept),
        card_count: normalizeCardCount(point.card_count),
      } satisfies ExtractionPoint
    })
    .filter((point): point is ExtractionPoint => point !== null)

  if (points.length === 0) {
    throw new Error('No teaching points were extracted from the page.')
  }

  const parsedRecord = typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null
  const session_context =
    parsedRecord && typeof parsedRecord.session_context === 'string' && parsedRecord.session_context.trim()
      ? parsedRecord.session_context
      : 'Medical learning session'

  return { points, session_context }
}

export async function extractPointsFromImage(imageUrl: string): Promise<ExtractionResult> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are Capsule AI, a medical education expert.
Extract atomic teaching points from a single page of medical notes.
Also provide a 2-3 sentence 'session_context' that summarizes the main theme of the entire note.
Return JSON only.
Use this exact shape:
{"session_context": "...", "points":[{"text":"...","category":"...","concept":"Drug","card_count":1}]}
Allowed concept values: Drug, Disease, Mechanism, Regimen, Other.`,
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Extract high-yield teaching points as strict JSON.' },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0].message.content

  if (!content) {
    throw new Error('Failed to extract points from image.')
  }

  return normalizeExtractionResult(content)
}
