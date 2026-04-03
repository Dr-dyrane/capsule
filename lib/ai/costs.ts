export const AI_PRICING_VERSION = 'openai-2026-04-03'

type PlannerUsage = {
  prompt_tokens?: number | null
  completion_tokens?: number | null
  total_tokens?: number | null
}

type ImageUsage = {
  input_tokens?: number | null
  output_tokens?: number | null
  total_tokens?: number | null
  input_tokens_details?: {
    image_tokens?: number | null
    text_tokens?: number | null
  } | null
  output_tokens_details?: {
    image_tokens?: number | null
    text_tokens?: number | null
  } | null
}

const PLANNER_PRICING: Record<string, { inputPerMillion: number; outputPerMillion: number }> = {
  'gpt-4.1': {
    inputPerMillion: 2,
    outputPerMillion: 8,
  },
  'gpt-4.1-mini': {
    inputPerMillion: 0.4,
    outputPerMillion: 1.6,
  },
}

const IMAGE_FLAT_PRICING: Record<string, Record<string, Record<'low' | 'medium' | 'high', number>>> = {
  'gpt-image-1': {
    '1536x1024': { low: 0.013, medium: 0.05, high: 0.2 },
    '1024x1536': { low: 0.013, medium: 0.05, high: 0.2 },
    '1024x1024': { low: 0.01, medium: 0.04, high: 0.17 },
  },
  'gpt-image-1.5': {
    '1536x1024': { low: 0.013, medium: 0.05, high: 0.2 },
    '1024x1536': { low: 0.013, medium: 0.05, high: 0.2 },
    '1024x1024': { low: 0.01, medium: 0.04, high: 0.17 },
  },
}

function roundUsd(value: number) {
  return Number(value.toFixed(6))
}

export function estimatePlannerCostUsd(model: string, usage: PlannerUsage | null | undefined) {
  const pricing = PLANNER_PRICING[model]
  if (!pricing || !usage) {
    return 0
  }

  const promptTokens = usage.prompt_tokens ?? 0
  const completionTokens = usage.completion_tokens ?? 0

  return roundUsd(
    (promptTokens / 1_000_000) * pricing.inputPerMillion +
      (completionTokens / 1_000_000) * pricing.outputPerMillion,
  )
}

export function estimateImageCostUsd(
  model: string,
  size: '1024x1024' | '1024x1536' | '1536x1024',
  quality: 'low' | 'medium' | 'high',
) {
  const cost = IMAGE_FLAT_PRICING[model]?.[size]?.[quality]
  return roundUsd(cost ?? 0)
}

export function serializePlannerUsage(usage: PlannerUsage | null | undefined) {
  if (!usage) {
    return null
  }

  return {
    prompt_tokens: usage.prompt_tokens ?? null,
    completion_tokens: usage.completion_tokens ?? null,
    total_tokens: usage.total_tokens ?? null,
  }
}

export function serializeImageUsage(usage: ImageUsage | null | undefined) {
  if (!usage) {
    return null
  }

  return {
    input_tokens: usage.input_tokens ?? null,
    output_tokens: usage.output_tokens ?? null,
    total_tokens: usage.total_tokens ?? null,
    input_tokens_details: usage.input_tokens_details
      ? {
          image_tokens: usage.input_tokens_details.image_tokens ?? null,
          text_tokens: usage.input_tokens_details.text_tokens ?? null,
        }
      : null,
    output_tokens_details: usage.output_tokens_details
      ? {
          image_tokens: usage.output_tokens_details.image_tokens ?? null,
          text_tokens: usage.output_tokens_details.text_tokens ?? null,
        }
      : null,
  }
}
