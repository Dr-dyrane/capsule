import 'server-only'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCardImage(text: string, category: string): Promise<string> {
  const prompt = `A professional medical learning card about: ${text}. Category: ${category}. Apple HIG inspired, clean, minimal clutter, editorial tone. NO TEXT. High contrast, dark mode compatible, vibrant colors.`

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
    response_format: "url",
  })

  const imageUrl = response?.data?.[0].url
  if (!imageUrl) throw new Error("Failed to generate card image")

  return imageUrl
}
