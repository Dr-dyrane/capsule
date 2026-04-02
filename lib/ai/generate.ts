import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateCardImage(text: string, category: string): Promise<string> {
  const prompt = `A professional, premium, illustrative medical learning card about: ${text}. 
  Category: ${category}.
  STYLE: Apple HIG inspired, clean, minimal clutter, editorial educational tone.
  Visual story type: Illustrative mechanism or anatomy. 
  NO TEXT except for a few micro-labels if necessary. 
  High contrast, dark mode compatible, vibrant but professional colors. 
  Cinematic lighting, high resolution.`

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
    response_format: "url",
  })

  const imageUrl = response.data[0].url
  if (!imageUrl) throw new Error("Failed to generate card image")

  return imageUrl
}
