'use server'

import { cookies } from 'next/headers'

import { registerGenerationSession } from '@/lib/generation/run-manager'
import { createClient } from '@/lib/supabase/server'
import { extractPointsFromImage } from '@/lib/ai/ocr'
import { findCommunityMatchesForPoints } from '@/lib/community/match'
import { planNotePoints } from '@/lib/generation/note-planner'
import { toExternalAssetUrl } from '@/lib/storage/asset-paths'
import { createSignedObjectUrl } from '@/lib/storage/signed-urls'

function getCardTitle(text: string) {
  const title = text.split(':')[0]?.trim()
  return title || 'Learning card'
}

export async function processNote(sessionId: string) {
  const supabase = await createClient()
  const cookieSnapshot = (await cookies()).getAll().map(({ name, value }) => ({ name, value }))

  // 1. Get Session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .update({ status: 'processing' })
    .eq('id', sessionId)
    .select()
    .single()

  if (sessionError) throw sessionError

  // 2. Create a short-lived signed URL for OCR instead of exposing the note publicly.
  const signedUrl = toExternalAssetUrl(await createSignedObjectUrl('notes', session.source_url, 60 * 10))

  // 3. Extract Points
  try {
    const result = await extractPointsFromImage(signedUrl)
    const points = result.points ?? []

    if (points.length === 0) {
      throw new Error('No teaching points were extracted from the page.')
    }

    // 4. Save Points to DB
    const pointsToInsert = points.map((p, index) => ({
      session_id: sessionId,
      text: p.text,
      category: p.category,
      concept: p.concept,
      sort_order: index,
      card_count: p.card_count,
    }))

    const { data: insertedPoints, error: pointsError } = await supabase
      .from('points')
      .insert(pointsToInsert)
      .select('id, text, category, concept, sort_order, card_count, session_id')

    if (pointsError) throw pointsError

    const typedPoints = (insertedPoints ?? []).map((point) => ({
      ...point,
      created_at: undefined,
    }))

    const notePlan = planNotePoints(typedPoints)
    const plannedRoles = new Map(notePlan.items.map((item) => [item.pointId, item.role]))
    const matchCandidates = await findCommunityMatchesForPoints(typedPoints)

    const { error: roleError } = await Promise.all(
      typedPoints.map((point) =>
        supabase
          .from('points')
          .update({ note_role: plannedRoles.get(point.id) ?? 'overflow' })
          .eq('id', point.id),
      ),
    ).then((results) => {
      const failed = results.find((result) => result.error)
      return { error: failed?.error ?? null }
    })

    if (roleError) throw roleError

    function getGenerationGate(pointId: string) {
      const role = plannedRoles.get(pointId) ?? 'overflow'
      if (role === 'hero') return 'automatic'
      if ((matchCandidates.get(pointId)?.[0]?.card_id ?? null) && role === 'support') return 'community-first'
      return 'manual'
    }

    const queuedCards = typedPoints.map((point) => {
      const cardId = crypto.randomUUID()
      const topMatch = matchCandidates.get(point.id)?.[0] ?? null

      return {
        id: cardId,
        point_id: point.id,
        session_id: sessionId,
        image_url: `${session.user_id}/${sessionId}/${cardId}.png`,
        title: getCardTitle(point.text),
        status: 'queued',
        card_order: point.sort_order ?? 0,
        generation_gate: getGenerationGate(point.id),
        community_match_card_id: topMatch?.card_id ?? null,
        community_match_score: topMatch?.score ?? null,
        visibility: session.visibility === 'published' ? 'published' : 'private',
      }
    })

    const { error: cardsError } = await supabase.from('cards').insert(queuedCards)

    if (cardsError) throw cardsError

    const { error: runError } = await supabase.from('generation_runs').upsert(
      {
        session_id: sessionId,
        user_id: session.user_id,
        status: 'queued',
        total_cards: queuedCards.filter((card) => card.generation_gate === 'automatic').length,
        completed_cards: 0,
        failed_cards: 0,
        active_card_id: null,
        last_error: null,
        started_at: null,
        finished_at: null,
      },
      { onConflict: 'session_id' },
    )

    if (runError) throw runError

    const queuedJobs = queuedCards
      .filter((card) => card.generation_gate === 'automatic')
      .map((card, index) => ({
        session_id: sessionId,
        card_id: card.id,
        point_id: card.point_id,
        user_id: session.user_id,
        status: 'queued',
        planner_mode: 'planner',
        attempt_count: 0,
        prompt_version: null,
        model: null,
        cache_key: null,
        prompt_hash: null,
        claimed_at: null,
        finished_at: null,
        last_error: null,
        created_at: new Date(Date.now() + index).toISOString(),
      }))

    if (queuedJobs.length > 0) {
      const { error: jobsError } = await supabase.from('card_jobs').upsert(queuedJobs, { onConflict: 'card_id' })

      if (jobsError) throw jobsError
    }

    // 5. Update Session
    await supabase
      .from('sessions')
      .update({
        status: 'generating',
        point_count: points.length,
        session_context: result.session_context,
      })
      .eq('id', sessionId)

    registerGenerationSession(sessionId, cookieSnapshot)

    return { success: true, count: points.length }
  } catch (error) {
    console.error(error)
    await supabase
      .from('sessions')
      .update({ status: 'error' })
      .eq('id', sessionId)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed',
    }
  }
}

export async function restartSession(sessionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (sessionError || !session) {
    throw new Error('Session not found')
  }

  await supabase.from('cards').delete().eq('session_id', sessionId)
  await supabase.from('card_jobs').delete().eq('session_id', sessionId)
  await supabase.from('points').delete().eq('session_id', sessionId)
  await supabase.from('generation_runs').delete().eq('session_id', sessionId)

  const { error: updateError } = await supabase
    .from('sessions')
    .update({
      status: 'processing',
      point_count: 0,
      card_count: 0,
    })
    .eq('id', sessionId)

  if (updateError) {
    throw updateError
  }

  return { success: true }
}
