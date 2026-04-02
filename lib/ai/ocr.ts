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
}

export async function extractPointsFromImage(imageUrl: string): Promise<ExtractionResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are Capsule AI, a medical education expert. 
        Your goal is to extract atomic teaching points from handwritten or printed medical notes.
        Return ONLY a JSON object matching the ExtractionResult interface.`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract teaching points from structured JSON." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    response_format: { type: "json_object" },
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error("Failed to extract points from image")

  return JSON.parse(content) as ExtractionResult
}
