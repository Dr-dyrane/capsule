import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import { buildRenderCacheKey, buildPromptHash } from '@/lib/ai/cache-keys'
import { recordGenerationCosts } from '@/lib/ai/cost-ledger'
import { estimateImageCostUsd, estimatePlannerCostUsd, serializeImageUsage, serializePlannerUsage } from '@/lib/ai/costs'
import { generateCardImage } from '@/lib/ai/generate'
import { upsertRenderCache, findRenderCache } from '@/lib/ai/render-cache'
import { resolveGenerationStrategy } from '@/lib/ai/strategy'
import { getCurrentUserEntitlement, refundGenerationCredit } from '@/lib/billing/entitlements'
import { chooseRenderProfile } from '@/lib/generation/render-policy'
import { ensureReviewItemExists } from '@/lib/review/queue'
import type { CardJobRecord, GenerationRunStatus, RenderCreditKind } from '@/lib/types'

type ProcessCardJobOptions = {
  skipClaim?: boolean
  rethrowOnHandledError?: boolean
}

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

async function refundReservedCreditIfNeeded(
  supabase: SupabaseClient,
  job: Pick<CardJobRecord, 'entitlement_kind' | 'entitlement_units'>,
) {
  if (!job.entitlement_kind || !job.entitlement_units || job.entitlement_units < 1) {
    return
  }

  await refundGenerationCredit(supabase, job.entitlement_kind as RenderCreditKind, job.entitlement_units)
}

export async function syncGenerationRunState(supabase: SupabaseClient, sessionId: string) {
  const [{ data: jobs, error: jobsError }, { data: runningCard }, { count: completeCardCount, error: cardsError }] = await Promise.all([
    supabase
      .from('card_jobs')
      .select('status, card_id, last_error')
      .eq('session_id', sessionId),
    supabase
      .from('card_jobs')
      .select('card_id')
      .eq('session_id', sessionId)
      .eq('status', 'running')
      .limit(1)
      .maybeSingle(),
    supabase
      .from('cards')
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .eq('status', 'complete'),
  ])

  if (jobsError) throw jobsError
  if (cardsError) throw cardsError

  const jobList = (jobs ?? []) as Array<Pick<CardJobRecord, 'status' | 'card_id' | 'last_error'>>
  const totalCards = jobList.length
  const completedCards = jobList.filter((job) => job.status === 'complete').length
  const failedCards = jobList.filter((job) => job.status === 'error').length
  const runningCards = jobList.filter((job) => job.status === 'running').length
  const queuedCards = jobList.filter((job) => job.status === 'queued').length
  const latestError = jobList.find((job) => job.status === 'error' && job.last_error)?.last_error ?? null

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
        last_error: failedCards > 0 ? latestError : null,
        finished_at: runStatus === 'complete' || runStatus === 'error' ? now : null,
        started_at: totalCards > 0 ? now : null,
      })
      .eq('session_id', sessionId),
    supabase
      .from('sessions')
      .update({
        status: sessionStatus,
        card_count: completeCardCount ?? 0,
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

export async function claimNextCardJob(supabase: SupabaseClient, sessionId: string) {
  const { data, error } = await supabase.rpc('claim_next_card_job', {
    p_session_id: sessionId,
  })

  if (error) throw error

  return (data as string | null) ?? null
}

export async function processCardJob(
  supabase: SupabaseClient,
  jobId: string,
  { skipClaim = false, rethrowOnHandledError = true }: ProcessCardJobOptions = {},
) {
  const { data: job, error: jobError } = await supabase
    .from('card_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (jobError) throw jobError

  const typedJob = job as CardJobRecord

  const [{ data: point, error: pointError }, { data: session, error: sessionError }, { data: card, error: cardError }] =
    await Promise.all([
      supabase
        .from('points')
        .select('id, text, category, concept, sort_order, note_role')
        .eq('id', typedJob.point_id)
        .single(),
      supabase
        .from('sessions')
        .select('id, user_id, session_context, visibility')
        .eq('id', typedJob.session_id)
        .single(),
      supabase
        .from('cards')
        .select('id, generation_gate, community_match_card_id, community_match_score, status')
        .eq('id', typedJob.card_id)
        .single(),
    ])

  if (pointError) throw pointError
  if (sessionError) throw sessionError
  if (cardError) throw cardError

  const strategy = resolveGenerationStrategy(point.text, point.category, point.concept)
  const entitlement = await getCurrentUserEntitlement(supabase)
  const renderProfile = chooseRenderProfile({
    noteRole: point.note_role ?? 'support',
    generationGate: card.generation_gate ?? 'manual',
    strategy,
    sessionVisibility: session.visibility ?? null,
    forcePremium: card.generation_gate === 'premium',
    allowHighQuality: entitlement.can_high_quality,
  })

  const { data: authData } = await supabase.auth.getUser()
  const preferences = authData.user?.user_metadata?.preferences || {}

  let referenceContext = ''

  if (typedJob.reference_card_id) {
    const { data: referenceCard } = await supabase
      .from('community_index')
      .select('title, community_template, category, concept, author_name')
      .eq('card_id', typedJob.reference_card_id)
      .maybeSingle()

    if (referenceCard) {
      const referenceSummary = [
        referenceCard.title ? `title=${referenceCard.title}` : null,
        referenceCard.community_template ? `template=${referenceCard.community_template}` : null,
        referenceCard.category ? `category=${referenceCard.category}` : null,
        referenceCard.concept ? `concept=${referenceCard.concept}` : null,
        referenceCard.author_name ? `author=${referenceCard.author_name}` : null,
      ]
        .filter(Boolean)
        .join('; ')

      if (referenceSummary) {
        referenceContext = `\nReference card for remix: ${referenceSummary}`
      }
    }
  }

  const effectiveSessionContext = `${session.session_context ?? ''}${referenceContext}`.trim()

  const cacheKey = buildRenderCacheKey({
    pointText: point.text,
    category: point.category,
    concept: point.concept,
    sessionContext: effectiveSessionContext,
    plannerMode: strategy.plannerMode,
    profileId: strategy.profileId,
    toonTemplateId: strategy.templateId,
    routeLevel: strategy.routeLevel,
    density: preferences.density,
    specialty: preferences.specialty,
    model: renderProfile.imageModel,
    quality: renderProfile.imageQuality,
    size: renderProfile.imageSize,
  })

  const claimUpdate = skipClaim
    ? {
        planner_mode: strategy.plannerMode,
        cache_key: cacheKey,
      }
    : {
        status: 'running',
        planner_mode: strategy.plannerMode,
        cache_key: cacheKey,
        attempt_count: typedJob.attempt_count + 1,
        claimed_at: new Date().toISOString(),
        last_error: null,
      }

  const claimQuery = supabase
    .from('card_jobs')
    .update(claimUpdate)
    .eq('id', jobId)

  if (!skipClaim) {
    claimQuery.eq('status', 'queued')
  }

  const { error: claimError } = await claimQuery

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
      await refundReservedCreditIfNeeded(supabase, typedJob)

      const { error: cardCompleteError } = await supabase
        .from('cards')
      .update({
          image_url: cached.image_url,
          title: getCardTitle(point.text),
          status: 'complete',
          render_model: cached.model,
          render_quality: renderProfile.imageQuality,
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
          entitlement_units: 0,
          finished_at: new Date().toISOString(),
          last_error: null,
        })
        .eq('id', jobId)

      if (jobCompleteError) throw jobCompleteError

      await ensureReviewItemExists(supabase, {
        userId: session.user_id,
        cardId: typedJob.card_id,
      })

      await recordGenerationCosts(supabase, [
        {
          userId: session.user_id,
          sessionId: typedJob.session_id,
          cardId: typedJob.card_id,
          pointId: typedJob.point_id,
          stage: 'cache_hit',
          model: cached.model,
          promptVersion: cached.prompt_version,
          profileId: strategy.profileId,
          templateId: strategy.templateId,
          routeLevel: strategy.routeLevel,
          estimatedCostUsd: 0,
          metadata: {
            cache_key: cacheKey,
            prompt_hash: cached.prompt_hash,
          },
        },
      ])

      await syncGenerationRunState(supabase, typedJob.session_id)
      return { fromCache: true }
    }

    const {
      imageBase64,
      prompt,
      plan,
      plannerMode,
      profileId,
      templateId,
      model,
      plannerModel,
      quality,
      size,
      promptVersion,
      plannerUsage,
      imageUsage,
    } = await generateCardImage(
      point.text,
      point.concept || point.category || 'Learning card',
      effectiveSessionContext,
      preferences,
      {
        strategy,
        imageModel: renderProfile.imageModel,
        plannerModel: renderProfile.plannerModel,
        quality: renderProfile.imageQuality,
        size: renderProfile.imageSize,
      },
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
          render_model: model,
          render_quality: quality,
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

    await ensureReviewItemExists(supabase, {
      userId: session.user_id,
      cardId: typedJob.card_id,
    })

    await recordGenerationCosts(supabase, [
      {
        userId: session.user_id,
        sessionId: typedJob.session_id,
        cardId: typedJob.card_id,
        pointId: typedJob.point_id,
        stage: 'planner',
        model: plannerModel,
        profileId: profileId,
        templateId,
        routeLevel: strategy.routeLevel,
        promptVersion,
        estimatedCostUsd: estimatePlannerCostUsd(plannerModel, plannerUsage),
        inputTokens: plannerUsage?.prompt_tokens ?? null,
        outputTokens: plannerUsage?.completion_tokens ?? null,
        totalTokens: plannerUsage?.total_tokens ?? null,
        metadata: {
          usage: serializePlannerUsage(plannerUsage),
          point_category: point.category,
          point_concept: point.concept,
        },
      },
      {
        userId: session.user_id,
        sessionId: typedJob.session_id,
        cardId: typedJob.card_id,
        pointId: typedJob.point_id,
        stage: 'image',
        model,
        quality,
        size,
        profileId,
        templateId,
        routeLevel: strategy.routeLevel,
        promptVersion,
        estimatedCostUsd: estimateImageCostUsd(model, size, quality),
        inputTokens: imageUsage?.input_tokens ?? null,
        outputTokens: imageUsage?.output_tokens ?? null,
        totalTokens: imageUsage?.total_tokens ?? null,
        inputTextTokens: imageUsage?.input_tokens_details?.text_tokens ?? null,
        inputImageTokens: imageUsage?.input_tokens_details?.image_tokens ?? null,
        outputTextTokens: imageUsage?.output_tokens_details?.text_tokens ?? null,
        outputImageTokens: imageUsage?.output_tokens_details?.image_tokens ?? null,
        metadata: {
          usage: serializeImageUsage(imageUsage),
          point_category: point.category,
          point_concept: point.concept,
        },
      },
    ])

    await syncGenerationRunState(supabase, typedJob.session_id)
    return { fromCache: false }
  } catch (error) {
    const message = getErrorMessage(error)

    await refundReservedCreditIfNeeded(supabase, typedJob)

    await Promise.all([
      supabase
        .from('cards')
        .update({ status: 'error' })
        .eq('id', typedJob.card_id),
      supabase
        .from('card_jobs')
        .update({
          status: 'error',
          entitlement_units: 0,
          last_error: message,
          finished_at: new Date().toISOString(),
        })
        .eq('id', jobId),
    ])

    await syncGenerationRunState(supabase, typedJob.session_id)

    if (rethrowOnHandledError) {
      throw error
    }

    return { fromCache: false, failed: true, error: message }
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
