import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import { buildRenderCacheKey, buildPromptHash } from '@/lib/ai/cache-keys'
import { generateCardImage, resolveGenerationStrategy } from '@/lib/ai/generate'
import { upsertRenderCache, findRenderCache } from '@/lib/ai/render-cache'
import type { CardJobRecord, GenerationRunStatus } from '@/lib/types'

function getCardTitle(text: string) {
  const title = text.split(':')[0]?.trim()
  return title || 'Learning card'
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Generation failed'
}

export async function syncGenerationRunState(supabase: SupabaseClient, sessionId: string) {
  const [{ data: jobs, error: jobsError }, { data: runningCard }] = await Promise.all([
    supabase
      .from('card_jobs')
      .select('status, card_id')
      .eq('session_id', sessionId),
    supabase
      .from('card_jobs')
      .select('card_id')
      .eq('session_id', sessionId)
      .eq('status', 'running')
      .limit(1)
      .maybeSingle(),
  ])

  if (jobsError) throw jobsError

  const jobList = (jobs ?? []) as Array<Pick<CardJobRecord, 'status' | 'card_id'>>
  const totalCards = jobList.length
  const completedCards = jobList.filter((job) => job.status === 'complete').length
  const failedCards = jobList.filter((job) => job.status === 'error').length
  const runningCards = jobList.filter((job) => job.status === 'running').length
  const queuedCards = jobList.filter((job) => job.status === 'queued').length

  let runStatus: GenerationRunStatus = 'queued'
  let sessionStatus: 'processing' | 'generating' | 'complete' | 'error' = 'processing'

  if (totalCards === 0) {
    runStatus = 'queued'
    sessionStatus = 'processing'
  } else if (runningCards > 0 || queuedCards > 0) {
    runStatus = 'running'
    sessionStatus = 'generating'
  } else if (failedCards > 0) {
    runStatus = 'error'
    sessionStatus = 'error'
  } else {
    runStatus = 'complete'
    sessionStatus = 'complete'
  }

  const now = new Date().toISOString()

  const [{ error: runError }, { error: sessionError }] = await Promise.all([
    supabase
      .from('generation_runs')
      .update({
        status: runStatus,
        total_cards: totalCards,
        completed_cards: completedCards,
        failed_cards: failedCards,
        active_card_id: runningCard?.card_id ?? null,
        finished_at: runStatus === 'complete' || runStatus === 'error' ? now : null,
        started_at: totalCards > 0 ? now : null,
      })
      .eq('session_id', sessionId),
    supabase
      .from('sessions')
      .update({
        status: sessionStatus,
        card_count: completedCards,
      })
      .eq('id', sessionId),
  ])

  if (runError) throw runError
  if (sessionError) throw sessionError

  return {
    totalCards,
    completedCards,
    failedCards,
    runStatus,
  }
}

export async function processCardJob(supabase: SupabaseClient, jobId: string) {
  const { data: job, error: jobError } = await supabase
    .from('card_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (jobError) throw jobError

  const typedJob = job as CardJobRecord

  const [{ data: point, error: pointError }, { data: session, error: sessionError }, { error: cardError }] =
    await Promise.all([
      supabase
        .from('points')
        .select('id, text, category, concept, sort_order')
        .eq('id', typedJob.point_id)
        .single(),
      supabase
        .from('sessions')
        .select('id, user_id, session_context')
        .eq('id', typedJob.session_id)
        .single(),
      supabase
        .from('cards')
        .select('id')
        .eq('id', typedJob.card_id)
        .single(),
    ])

  if (pointError) throw pointError
  if (sessionError) throw sessionError
  if (cardError) throw cardError

  const strategy = resolveGenerationStrategy(point.text, point.category, point.concept)

  const { data: authData } = await supabase.auth.getUser()
  const preferences = authData.user?.user_metadata?.preferences || {}

  const cacheKey = buildRenderCacheKey({
    pointText: point.text,
    category: point.category,
    concept: point.concept,
    sessionContext: session.session_context,
    plannerMode: strategy.plannerMode,
    profileId: strategy.profileId,
    toonTemplateId: strategy.templateId,
    routeLevel: strategy.routeLevel,
    density: preferences.density,
    specialty: preferences.specialty,
  })

  const { error: claimError } = await supabase
    .from('card_jobs')
    .update({
      status: 'running',
      planner_mode: strategy.plannerMode,
      cache_key: cacheKey,
      attempt_count: typedJob.attempt_count + 1,
      claimed_at: new Date().toISOString(),
      last_error: null,
    })
    .eq('id', jobId)

  if (claimError) throw claimError

  const { error: cardQueueError } = await supabase
    .from('cards')
    .update({
      title: getCardTitle(point.text),
      status: 'generating',
      card_order: point.sort_order ?? 0,
    })
    .eq('id', typedJob.card_id)

  if (cardQueueError) throw cardQueueError

  try {
    const cached = await findRenderCache(supabase, session.user_id, cacheKey)

    if (cached) {
      const { error: cardCompleteError } = await supabase
        .from('cards')
        .update({
          image_url: cached.image_url,
          title: getCardTitle(point.text),
          status: 'complete',
          community_template: strategy.templateId,
          community_hash: cacheKey,
        })
        .eq('id', typedJob.card_id)

      if (cardCompleteError) throw cardCompleteError

      const { error: jobCompleteError } = await supabase
        .from('card_jobs')
        .update({
          status: 'complete',
          prompt_hash: cached.prompt_hash,
          model: cached.model,
          prompt_version: cached.prompt_version,
          finished_at: new Date().toISOString(),
          last_error: null,
        })
        .eq('id', jobId)

      if (jobCompleteError) throw jobCompleteError

      await syncGenerationRunState(supabase, typedJob.session_id)
      return { fromCache: true }
    }

    const { imageBase64, prompt, plan, plannerMode, templateId, model, promptVersion } = await generateCardImage(
      point.text,
      point.concept || point.category || 'Learning card',
      session.session_context || '',
      preferences,
      { strategy },
    )

    const promptHash = buildPromptHash(prompt)
    const cacheImagePath = `${session.user_id}/cache/${cacheKey}.png`
    const imageBuffer = Buffer.from(imageBase64, 'base64')

    const { error: uploadError } = await supabase.storage.from('cards').upload(cacheImagePath, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    })

    if (uploadError) throw uploadError

    await upsertRenderCache(supabase, {
      userId: session.user_id,
      cacheKey,
      promptHash,
      promptVersion,
      model,
      imageUrl: cacheImagePath,
      prompt,
      plan: plan as unknown as Record<string, unknown>,
      conceptType: plan.conceptType,
    })

    const [{ error: cardCompleteError }, { error: jobCompleteError }] = await Promise.all([
      supabase
        .from('cards')
        .update({
          image_url: cacheImagePath,
          title: getCardTitle(point.text),
          status: 'complete',
          community_template: templateId,
          community_hash: cacheKey,
        })
        .eq('id', typedJob.card_id),
      supabase
        .from('card_jobs')
        .update({
          status: 'complete',
          planner_mode: plannerMode,
          prompt_hash: promptHash,
          model,
          prompt_version: promptVersion,
          finished_at: new Date().toISOString(),
          last_error: null,
        })
        .eq('id', jobId),
    ])

    if (cardCompleteError) throw cardCompleteError
    if (jobCompleteError) throw jobCompleteError

    await syncGenerationRunState(supabase, typedJob.session_id)
    return { fromCache: false }
  } catch (error) {
    const message = getErrorMessage(error)

    await Promise.all([
      supabase
        .from('cards')
        .update({ status: 'error' })
        .eq('id', typedJob.card_id),
      supabase
        .from('card_jobs')
        .update({
          status: 'error',
          last_error: message,
          finished_at: new Date().toISOString(),
        })
        .eq('id', jobId),
    ])

    await syncGenerationRunState(supabase, typedJob.session_id)
    throw error
  }
}

export async function queueCardForRetry(supabase: SupabaseClient, cardId: string) {
  const { data: job, error: jobError } = await supabase
    .from('card_jobs')
    .select('id, session_id')
    .eq('card_id', cardId)
    .single()

  if (jobError) throw jobError

  const { error: resetCardError } = await supabase
    .from('cards')
    .update({ status: 'queued' })
    .eq('id', cardId)

  if (resetCardError) throw resetCardError

  const { error: resetJobError } = await supabase
    .from('card_jobs')
    .update({
      status: 'queued',
      claimed_at: null,
      finished_at: null,
      last_error: null,
    })
    .eq('id', job.id)

  if (resetJobError) throw resetJobError

  await syncGenerationRunState(supabase, job.session_id)
}
