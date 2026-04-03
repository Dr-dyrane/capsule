'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Lock,
  RefreshCcw,
  Repeat2,
  ScanText,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { getSignedCardUrls } from '@/app/actions/assets'
import { publishSession, unpublishSession } from '@/app/actions/community'
import {
  ensureCardPlaceholders,
  generateCard,
  getSessionRecommendations,
  useCommunityMatch as applyCommunityMatch,
} from '@/app/actions/generate'
import { processNote, restartSession } from '@/app/actions/process'
import ImagePreview from '@/components/cards/ImagePreview'
import { useFeedback } from '@/components/providers/FeedbackProvider'
import ActivitySteps, { type ActivityStepItem } from '@/components/ui/ActivitySteps'
import AdaptiveSheet from '@/components/ui/AdaptiveSheet'
import DeleteActionButton from '@/components/ui/DeleteActionButton'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import { createClient } from '@/lib/supabase/client'
import type {
  CardRecord,
  GenerationRunRecord,
  NoteRole,
  PointRecord,
  SessionRecommendationRecord,
  SessionRecord,
  SessionStatus,
} from '@/lib/types'

import styles from './ProcessingView.module.css'

const EMPTY_POINTS: PointRecord[] = []
const EMPTY_CARDS: CardRecord[] = []

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

function getPointPreview(text: string) {
  const compact = text.replace(/\s+/g, ' ').trim()
  return compact.length <= 120 ? compact : `${compact.slice(0, 117).trimEnd()}...`
}

function getRolePriority(role?: NoteRole) {
  if (role === 'hero') return 0
  if (role === 'support') return 1
  return 2
}

function getRoleLabel(role?: NoteRole) {
  if (role === 'hero') return 'Hero'
  if (role === 'support') return 'Support'
  return 'Later'
}

function getCardStatusLabel(card?: CardRecord, role?: NoteRole, recommendation?: SessionRecommendationRecord | null) {
  if (!card) return role === 'hero' ? 'Queued' : 'Draft'
  if (card.status === 'complete') return card.generation_gate === 'reused' ? 'Reused' : 'Ready'
  if (card.status === 'generating') return 'Generating'
  if (card.status === 'error') return 'Error'
  if (role === 'hero' || card.generation_gate === 'automatic' || card.generation_gate === 'premium') return 'Queued'
  if (recommendation?.match && card.generation_gate === 'community-first') return 'Community match'
  return role === 'overflow' ? 'Generate later' : 'On demand'
}

function getCardHint(card: CardRecord, role?: NoteRole) {
  if (card.status === 'complete') return card.generation_gate === 'reused' ? 'Used from community' : 'Open card'
  if (card.status === 'generating') return 'Rendering now'
  if (card.status === 'error') return 'Retry render'
  if (role === 'hero') return 'First card in line'
  if (card.generation_gate === 'community-first') return 'Reuse before rerender'
  return role === 'overflow' ? 'Generate when needed' : 'Generate next'
}

export default function ProcessingView({
  sessionId,
  sourceImageUrl,
  remixSource,
}: {
  sessionId: string
  sourceImageUrl?: string | null
  remixSource?: {
    card_id: string
    title: string | null
    signedUrl: string | null
    author_name?: string | null
  } | null
}) {
  const [session, setSession] = useState<SessionRecord | null>(null)
  const [points, setPoints] = useState<PointRecord[]>(EMPTY_POINTS)
  const [cards, setCards] = useState<CardRecord[]>(EMPTY_CARDS)
  const [generationRun, setGenerationRun] = useState<GenerationRunRecord | null>(null)
  const [cardUrls, setCardUrls] = useState<Record<string, string>>({})
  const [recommendations, setRecommendations] = useState<Record<string, SessionRecommendationRecord>>({})
  const [status, setStatus] = useState<SessionStatus | 'loading'>('loading')
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [isPlaceholderSyncing, setIsPlaceholderSyncing] = useState(false)
  const [placeholderError, setPlaceholderError] = useState<string | null>(null)
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false)
  const [recommendationError, setRecommendationError] = useState<string | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const [isActivityExpanded, setIsActivityExpanded] = useState(false)
  const [cardActionTarget, setCardActionTarget] = useState<string | null>(null)
  const [isRetrying, startRetryTransition] = useTransition()
  const [isPublishing, startPublishTransition] = useTransition()
  const [isCardActionPending, startCardActionTransition] = useTransition()
  const [publishPrompt, setPublishPrompt] = useState<'publish' | 'unpublish' | null>(null)

  const placeholderSyncRef = useRef(false)
  const processingStartedRef = useRef(false)
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const { showFeedback } = useFeedback()

  useEffect(() => {
    async function bootstrap() {
      const [{ data: initialSession }, { data: initialPoints }, { data: initialCards }, { data: initialRun }] = await Promise.all([
        supabase.from('sessions').select('*').eq('id', sessionId).single(),
        supabase.from('points').select('*').eq('session_id', sessionId).order('sort_order', { ascending: true }),
        supabase.from('cards').select('*').eq('session_id', sessionId).order('card_order', { ascending: true }),
        supabase.from('generation_runs').select('*').eq('session_id', sessionId).maybeSingle(),
      ])

      if (initialSession) {
        setSession(initialSession as SessionRecord)
        setStatus((initialSession.status as SessionStatus) || 'loading')
      }
      if (initialPoints) setPoints(initialPoints as PointRecord[])
      if (initialCards) setCards(initialCards as CardRecord[])
      if (initialRun) setGenerationRun(initialRun as GenerationRunRecord)
    }

    void bootstrap()

    const pointsSub = supabase
      .channel(`points:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'points', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setPoints((current) => [...current, payload.new as PointRecord].sort((a, b) => a.sort_order - b.sort_order))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'points', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setPoints((current) => current.map((point) => (point.id === payload.new.id ? (payload.new as PointRecord) : point)).sort((a, b) => a.sort_order - b.sort_order))
      })
      .subscribe()

    const cardsSub = supabase
      .channel(`cards:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setCards((current) => [...current, payload.new as CardRecord].sort((a, b) => (a.card_order ?? 0) - (b.card_order ?? 0)))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setCards((current) =>
          current.map((card) => (card.id === payload.new.id ? (payload.new as CardRecord) : card)).sort((a, b) => (a.card_order ?? 0) - (b.card_order ?? 0)),
        )
      })
      .subscribe()

    const sessionSub = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (payload) => {
        setStatus(payload.new.status as SessionStatus)
        setSession(payload.new as SessionRecord)
      })
      .subscribe()

    const runSub = supabase
      .channel(`generation-run:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'generation_runs', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setGenerationRun(payload.new as GenerationRunRecord)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'generation_runs', filter: `session_id=eq.${sessionId}` }, (payload) => {
        setGenerationRun(payload.new as GenerationRunRecord)
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'generation_runs', filter: `session_id=eq.${sessionId}` }, () => {
        setGenerationRun(null)
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(pointsSub)
      void supabase.removeChannel(cardsSub)
      void supabase.removeChannel(sessionSub)
      void supabase.removeChannel(runSub)
    }
  }, [sessionId, supabase])

  const hasMissingCards = useMemo(
    () => points.some((point) => !cards.some((card) => card.point_id === point.id)),
    [cards, points],
  )

  const missingPreviewPaths = useMemo(
    () => [...new Set(cards.filter((card) => card.status === 'complete' && !cardUrls[card.image_url]).map((card) => card.image_url))],
    [cardUrls, cards],
  )

  const syncPlaceholders = useCallback(async () => {
    if (points.length === 0 || !hasMissingCards || placeholderSyncRef.current) return

    placeholderSyncRef.current = true
    setIsPlaceholderSyncing(true)
    setPlaceholderError(null)

    try {
      await ensureCardPlaceholders(sessionId)
    } catch (error) {
      setPlaceholderError(getErrorMessage(error, 'Could not prepare card slots.'))
    } finally {
      placeholderSyncRef.current = false
      setIsPlaceholderSyncing(false)
    }
  }, [hasMissingCards, points.length, sessionId])

  const syncRecommendations = useCallback(async () => {
    if (points.length === 0 || cards.length === 0) return

    setIsRecommendationLoading(true)
    setRecommendationError(null)

    try {
      const rows = await getSessionRecommendations(sessionId)
      setRecommendations(
        rows.reduce<Record<string, SessionRecommendationRecord>>((acc, row) => {
          acc[row.point_id] = row
          return acc
        }, {}),
      )
    } catch (error) {
      setRecommendationError(getErrorMessage(error, 'Could not load reuse suggestions.'))
    } finally {
      setIsRecommendationLoading(false)
    }
  }, [cards.length, points.length, sessionId])

  const syncCardPreviews = useCallback(async (paths: string[]) => {
    if (paths.length === 0) return

    setIsPreviewLoading(true)
    setPreviewError(null)

    try {
      const urls = await getSignedCardUrls(paths)
      setCardUrls((current) => ({ ...current, ...urls }))
    } catch (error) {
      setPreviewError(getErrorMessage(error, 'Could not load card previews.'))
    } finally {
      setIsPreviewLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'processing' && !processingStartedRef.current) {
      processingStartedRef.current = true
      void processNote(sessionId)
        .then((result) => {
          if (!result.success) {
            setProcessingError(result.error || 'Could not read the note.')
            setStatus('error')
            return
          }

          setProcessingError(null)
        })
        .catch((error) => {
          setProcessingError(getErrorMessage(error, 'Could not read the note.'))
          setStatus('error')
        })
    }
  }, [sessionId, status])

  useEffect(() => {
    if (status === 'loading' || status === 'processing' || points.length === 0 || !hasMissingCards) return
    void syncPlaceholders()
  }, [hasMissingCards, points.length, status, syncPlaceholders])

  const recommendationKey = useMemo(
    () => cards.map((card) => `${card.point_id}:${card.generation_gate ?? ''}:${card.community_match_card_id ?? ''}:${card.status}`).join('|'),
    [cards],
  )

  useEffect(() => {
    if (points.length === 0 || cards.length === 0) return
    void syncRecommendations()
  }, [cards.length, points.length, recommendationKey, syncRecommendations])

  useEffect(() => {
    if (missingPreviewPaths.length === 0) return
    void syncCardPreviews(missingPreviewPaths)
  }, [missingPreviewPaths, syncCardPreviews])

  function handleRetrySession() {
    startRetryTransition(() => {
      void restartSession(sessionId)
        .then(() => {
          setPoints(EMPTY_POINTS)
          setCards(EMPTY_CARDS)
          setGenerationRun(null)
          setRecommendations({})
          setCardUrls({})
          setProcessingError(null)
          setIsPlaceholderSyncing(false)
          setPlaceholderError(null)
          setIsRecommendationLoading(false)
          setRecommendationError(null)
          setIsPreviewLoading(false)
          setPreviewError(null)
          setStatus('processing')
          placeholderSyncRef.current = false
          processingStartedRef.current = false
        })
        .catch((error) => {
          showFeedback({
            tone: 'error',
            title: 'Could not restart this session',
            message: getErrorMessage(error, 'Try again in a moment.'),
          })
        })
    })
  }

  function runCardAction(pointId: string, cardId: string, action: 'use' | 'generate' | 'remix', referenceCardId?: string | null) {
    setCardActionTarget(pointId)
    startCardActionTransition(() => {
      const task =
        action === 'use'
          ? applyCommunityMatch(cardId, referenceCardId ?? '')
          : generateCard(pointId, cardId, {
              mode: action === 'remix' ? 'remix' : 'default',
              referenceCardId: referenceCardId ?? null,
            })

      void task
        .catch((error) => {
          showFeedback({
            tone: 'error',
            title:
              action === 'use'
                ? 'Could not use this card'
                : action === 'remix'
                  ? 'Could not remix this card'
                  : 'Could not start rendering',
            message: getErrorMessage(error, 'Try again in a moment.'),
          })
        })
        .finally(() => setCardActionTarget(null))
    })
  }

  const completeCards = cards.filter((card) => card.status === 'complete')
  const pointsById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points])
  const cardsByPointId = useMemo(() => new Map(cards.map((card) => [card.point_id, card])), [cards])

  const orderedPoints = useMemo(
    () => [...points].sort((left, right) => {
      const roleDelta = getRolePriority(left.note_role) - getRolePriority(right.note_role)
      return roleDelta !== 0 ? roleDelta : left.sort_order - right.sort_order
    }),
    [points],
  )

  const visibleCards = useMemo(
    () =>
      [...cards]
        .filter((card) => {
          const point = pointsById.get(card.point_id)
          return card.status === 'complete' || card.status === 'generating' || card.status === 'error' || point?.note_role === 'hero'
        })
        .sort((left, right) => {
          const roleDelta = getRolePriority(pointsById.get(left.point_id)?.note_role) - getRolePriority(pointsById.get(right.point_id)?.note_role)
          return roleDelta !== 0 ? roleDelta : (left.card_order ?? 0) - (right.card_order ?? 0)
        }),
    [cards, pointsById],
  )

  const nextPoints = useMemo(
    () => orderedPoints.filter((point) => point.note_role !== 'hero' && cardsByPointId.get(point.id)?.status !== 'complete'),
    [cardsByPointId, orderedPoints],
  )

  const activePipelineCards = cards.filter((card) => card.status === 'generating' || ((card.generation_gate === 'automatic' || card.generation_gate === 'premium') && card.status === 'queued'))
  const suggestionCount = nextPoints.filter((point) => cardsByPointId.get(point.id)?.generation_gate === 'community-first').length
  const manualCount = Math.max(0, nextPoints.length - suggestionCount)
  const progressWidth = status === 'complete' ? 100 : Math.max(8, Math.min(100, (completeCards.length / Math.max(activePipelineCards.length, 1)) * 100))
  const supportCount = Number(Boolean(sourceImageUrl)) + Number(Boolean(remixSource))
  const isSessionPublished = session?.visibility === 'published'
  const activeRunCard = generationRun?.active_card_id ? cards.find((card) => card.id === generationRun.active_card_id) ?? null : null
  const firstErroredCard = cards.find((card) => card.status === 'error') ?? null
  const shouldShowActivity = status === 'loading' || status === 'processing' || status === 'generating' || isPlaceholderSyncing || isRecommendationLoading || isPreviewLoading || activePipelineCards.length > 0

  const statusTitle =
    status === 'complete'
      ? nextPoints.length > 0
        ? 'Lesson ready.'
        : 'Cards ready.'
      : status === 'processing'
        ? 'Extracting points.'
        : status === 'error'
          ? 'Generation paused.'
          : status === 'loading'
            ? 'Loading session.'
            : 'Building the first card.'

  const statusCopy =
    status === 'complete'
      ? nextPoints.length > 0
        ? 'Hero first. Reuse community cards or generate more only when you need them.'
        : 'Open any card or review the source note.'
      : status === 'processing'
        ? 'Pulling teachable points from the note first.'
        : status === 'error'
          ? processingError ?? generationRun?.last_error ?? 'Retry the session or rerun a single card.'
          : 'One automatic hero card starts the session. The rest stay lightweight until you ask for more.'

  const activitySteps = useMemo<ActivityStepItem[]>(() => {
    const extractionStatus: ActivityStepItem['status'] =
      processingError ? 'error' : points.length > 0 ? 'complete' : status === 'loading' || status === 'processing' ? 'active' : 'pending'

    const prepStatus: ActivityStepItem['status'] =
      placeholderError ? 'error' : points.length === 0 ? 'pending' : !hasMissingCards ? 'complete' : isPlaceholderSyncing || cards.length > 0 ? 'active' : 'pending'

    const matchesStatus: ActivityStepItem['status'] =
      recommendationError ? 'error' : points.length === 0 || cards.length === 0 ? 'pending' : isRecommendationLoading ? 'active' : 'complete'

    const renderStatus: ActivityStepItem['status'] =
      status === 'error' || generationRun?.status === 'error'
        ? 'error'
        : status === 'generating' || generationRun?.status === 'running' || generationRun?.status === 'queued' || activePipelineCards.length > 0
          ? 'active'
          : completeCards.length > 0 || status === 'complete'
            ? 'complete'
            : points.length > 0
              ? 'pending'
              : 'pending'

    const previewStatus: ActivityStepItem['status'] =
      previewError ? 'error' : completeCards.length === 0 ? 'pending' : missingPreviewPaths.length > 0 || isPreviewLoading ? 'active' : 'complete'

    return [
      {
        id: 'extract',
        title: 'Read note',
        detail: processingError
          ? processingError
          : points.length > 0
            ? `${points.length} teaching point${points.length === 1 ? '' : 's'} ready.`
            : 'Reading the note and pulling the core ideas out first.',
        status: extractionStatus,
      },
      {
        id: 'prepare',
        title: 'Prepare cards',
        detail: placeholderError
          ? placeholderError
          : points.length === 0
            ? 'Card slots appear after the note is parsed.'
            : !hasMissingCards
              ? `${cards.length} card slot${cards.length === 1 ? '' : 's'} prepared.`
              : `Preparing ${points.length} card slot${points.length === 1 ? '' : 's'} and roles.`,
        status: prepStatus,
        actionLabel: prepStatus === 'error' ? 'Retry' : undefined,
        onAction: prepStatus === 'error' ? () => void syncPlaceholders() : undefined,
      },
      {
        id: 'matches',
        title: 'Check reuse',
        detail: recommendationError
          ? recommendationError
          : points.length === 0 || cards.length === 0
            ? 'Reuse suggestions appear once the session structure is in place.'
            : isRecommendationLoading
              ? 'Checking community cards that can be reused or remixed fast.'
              : suggestionCount > 0
                ? `${suggestionCount} community match${suggestionCount === 1 ? '' : 'es'} ready.`
                : 'No community reuse is needed for this note.',
        status: matchesStatus,
        actionLabel: matchesStatus === 'error' ? 'Retry' : undefined,
        onAction: matchesStatus === 'error' ? () => void syncRecommendations() : undefined,
      },
      {
        id: 'render',
        title: 'Render cards',
        detail:
          renderStatus === 'error'
            ? generationRun?.last_error ?? processingError ?? (firstErroredCard ? `${firstErroredCard.title || 'A card'} stopped before finishing.` : 'Rendering stopped before finish.')
            : activeRunCard
              ? `Rendering ${activeRunCard.title || 'the next card'}.`
              : activePipelineCards.length > 0
                ? `${activePipelineCards.length} card${activePipelineCards.length === 1 ? '' : 's'} moving through the pipeline.`
                : generationRun?.completed_cards
                  ? `${generationRun.completed_cards} of ${generationRun.total_cards || generationRun.completed_cards} automatic card${generationRun.completed_cards === 1 ? '' : 's'} ready.`
                  : completeCards.length > 0
                    ? `${completeCards.length} card${completeCards.length === 1 ? '' : 's'} ready.`
                    : 'The hero card will start first.',
        status: renderStatus,
      },
      {
        id: 'preview',
        title: 'Load previews',
        detail: previewError
          ? previewError
          : completeCards.length === 0
            ? 'Previews appear the moment a card finishes.'
            : missingPreviewPaths.length > 0
              ? `Loading ${missingPreviewPaths.length} preview${missingPreviewPaths.length === 1 ? '' : 's'} for completed cards.`
              : `${completeCards.length} preview${completeCards.length === 1 ? '' : 's'} ready to open.`,
        status: previewStatus,
        actionLabel: previewStatus === 'error' ? 'Retry' : undefined,
        onAction: previewStatus === 'error' ? () => void syncCardPreviews(missingPreviewPaths) : undefined,
      },
    ]
  }, [
    activePipelineCards.length,
    activeRunCard,
    cards.length,
    completeCards.length,
    firstErroredCard,
    generationRun,
    hasMissingCards,
    isPlaceholderSyncing,
    isPreviewLoading,
    isRecommendationLoading,
    missingPreviewPaths,
    placeholderError,
    points.length,
    previewError,
    processingError,
    recommendationError,
    status,
    suggestionCount,
    syncCardPreviews,
    syncPlaceholders,
    syncRecommendations,
  ])

  useEffect(() => {
    if (shouldShowActivity) {
      setIsActivityExpanded(false)
      return
    }

    setIsActivityExpanded(false)
  }, [shouldShowActivity])

  function handleToggleSessionVisibility(nextPublishedState: boolean) {
    startPublishTransition(() => {
      setSession((current) => current ? { ...current, visibility: nextPublishedState ? 'published' : 'private' } : current)

      void (nextPublishedState ? publishSession(sessionId) : unpublishSession(sessionId))
        .then(() => {
          setPublishPrompt(null)
          showFeedback({
            tone: 'success',
            title: nextPublishedState ? 'Session published' : 'Session is private',
            message: nextPublishedState ? 'It is now visible in community.' : 'Only you can see it now.',
          })
        })
        .catch((error) => {
          setSession((current) => current ? { ...current, visibility: nextPublishedState ? 'private' : 'published' } : current)
          setPublishPrompt(null)
          showFeedback({
            tone: 'error',
            title: 'Could not update this session',
            message: getErrorMessage(error, 'Try again in a moment.'),
          })
        })
    })
  }

  return (
    <div className={styles.root}>
      <section className={styles.statusPanel}>
        <div className={styles.statusInner}>
          <div className={styles.statusMeta}>
            <div className={styles.statusCopyBlock}>
              <div className={styles.statusEyebrow}>
                <Sparkles size={14} aria-hidden="true" />
                <span>{status === 'loading' ? 'Loading' : status}</span>
              </div>
              <h2 className={styles.statusTitle}>{statusTitle}</h2>
              <p className={styles.statusCopy}>{statusCopy}</p>
            </div>
            <div className={styles.statusCount}>{completeCards.length} / {points.length || '?'}</div>
          </div>

          <div className={styles.statusFooter}>
            <div className={styles.statusLedger}>
              <div className={styles.statusChip}>Ready {completeCards.length}</div>
              <div className={styles.statusChip}>Live {activePipelineCards.length}</div>
              <div className={styles.statusChip}>Reuse {suggestionCount}</div>
              <div className={styles.statusChip}>Later {manualCount}</div>
            </div>
            <div className={styles.statusActions}>
              {status === 'error' ? (
                <button type="button" className={styles.primaryAction} onClick={handleRetrySession} disabled={isRetrying}>
                  {isRetrying ? 'Restarting...' : 'Restart session'}
                </button>
              ) : null}
              <button type="button" className={styles.secondaryAction} onClick={() => setPublishPrompt(isSessionPublished ? 'unpublish' : 'publish')} disabled={isPublishing}>
                {isPublishing ? (
                  'Saving...'
                ) : isSessionPublished ? (
                  <>
                    <Lock size={14} />
                    <span>Unpublish all</span>
                  </>
                ) : (
                  <>
                    <Globe size={14} />
                    <span>Publish all</span>
                  </>
                )}
              </button>
              <DeleteActionButton targetId={sessionId} targetType="session" redirectTo="/library" compactOnMobile />
            </div>
          </div>

          {shouldShowActivity ? (
            <div className={styles.statusActivity}>
              <button
                type="button"
                className={styles.activityToggle}
                onClick={() => setIsActivityExpanded((current) => !current)}
                aria-expanded={isActivityExpanded}
              >
                <span>{isActivityExpanded ? 'Hide processing details' : 'Show processing details'}</span>
                <ChevronDown size={16} className={`${styles.activityToggleIcon} ${isActivityExpanded ? styles.activityToggleIconExpanded : ''}`} />
              </button>

              {isActivityExpanded ? <ActivitySteps items={activitySteps} /> : null}
            </div>
          ) : null}

          <div className={styles.progressRail}>
            <motion.div className={styles.progressFill} initial={{ width: 0 }} animate={{ width: `${progressWidth}%` }} transition={{ type: 'spring', damping: 22, stiffness: 90 }} />
          </div>
        </div>
      </section>

      {sourceImageUrl || remixSource ? (
        <section className={`${styles.supportGrid} ${supportCount === 1 ? styles.supportGridSingle : ''}`}>
          {sourceImageUrl ? (
            <section className={`${styles.panel} ${styles.sourcePanel} ${supportCount === 1 ? styles.sourcePanelSingle : ''}`}>
              <div className={`${styles.panelInner} ${styles.sourceInner}`}>
                <div className={styles.sourceCopy}>
                  <div className={styles.panelEyebrow}><ScanText size={14} /><span>Original note</span></div>
                  <h3 className={styles.panelTitle}>Source scan</h3>
                  <p className={styles.panelCopy}>The uploaded page that started this session.</p>
                  <Link href="/library" className={styles.inlineAction}>Back to sessions</Link>
                </div>
                <div className={styles.sourcePreview}>
                  <ImagePreview src={sourceImageUrl} alt="Original note scan" variant="document" />
                </div>
              </div>
            </section>
          ) : null}

          {remixSource ? (
            <section className={styles.panel}>
              <div className={`${styles.panelInner} ${styles.sourceInner}`}>
                <div className={styles.sourceCopy}>
                  <div className={styles.panelEyebrow}><Repeat2 size={14} /><span>Reference card</span></div>
                  <h3 className={styles.panelTitle}>{remixSource.title || 'Community card reference'}</h3>
                  <p className={styles.panelCopy}>This session can still trace back to the community card that started the remix.</p>
                  <Link href="/community" className={styles.inlineAction}>Open community</Link>
                </div>
                <div className={styles.sourcePreview}>
                  {remixSource.signedUrl ? <ImagePreview src={remixSource.signedUrl} alt={remixSource.title || 'Community card reference'} /> : <div className={styles.referenceFallback}>Reference preview unavailable.</div>}
                </div>
              </div>
            </section>
          ) : null}
        </section>
      ) : null}

      <div className={styles.content}>
        <section className={`${styles.panel} ${styles.cardsPanel}`}>
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelTitle}>Cards</h3>
                <p className={styles.panelCopy}>Hero first. Completed and in-flight cards land here.</p>
              </div>
              <div className={styles.panelCount}>{visibleCards.length}</div>
            </div>

            {visibleCards.length === 0 ? (
              <div className={styles.cardsEmpty}>
                <p className={styles.cardsEmptyTitle}>No card has started yet</p>
                <p className={styles.cardsEmptyCopy}>Once the hero card spins up, it will appear here first.</p>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                <AnimatePresence mode="popLayout">
                  {visibleCards.map((card) => {
                    const linkedPoint = pointsById.get(card.point_id)
                    const recommendation = recommendations[card.point_id]
                    const signedUrl = card.image_url ? cardUrls[card.image_url] : undefined
                    const statusLabel = getCardStatusLabel(card, linkedPoint?.note_role, recommendation)
                    const pointPreview = linkedPoint ? getPointPreview(linkedPoint.text) : ''
                    const isClickable = card.status === 'complete'
                    const isBusy = isCardActionPending && cardActionTarget === card.point_id

                    return (
                      <motion.article
                        key={card.id}
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${styles.cardItem} ${isClickable ? styles.cardItemInteractive : ''}`}
                        role={isClickable ? 'button' : undefined}
                        tabIndex={isClickable ? 0 : -1}
                        onClick={isClickable ? () => router.push(`/cards/${card.id}`) : undefined}
                        onKeyDown={isClickable ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            router.push(`/cards/${card.id}`)
                          }
                        } : undefined}
                      >
                        <div className={styles.cardVisual}>
                          <div className={styles.cardStatus}>{statusLabel}</div>
                          <div className={styles.cardRole}>{getRoleLabel(linkedPoint?.note_role)}</div>

                          {card.status === 'complete' && signedUrl ? (
                            <div className={styles.cardFrame}>
                              <Image
                                src={signedUrl}
                                alt={card.title || 'Generated card'}
                                fill
                                sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 33vw"
                                quality={70}
                                placeholder="blur"
                                blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                                className={styles.cardImage}
                              />
                            </div>
                          ) : (
                            <div className={`${styles.cardPlaceholder} ${card.status === 'generating' ? styles.shimmering : ''}`}>
                              <div className={styles.cardPlaceholderBody}>
                                <div>
                                  <span className={styles.cardPlaceholderText}>
                                    {card.status === 'queued' ? linkedPoint?.note_role === 'hero' ? 'Preparing the hero card' : 'Waiting for your signal' : card.status === 'generating' ? 'Rendering image' : 'Stopped before finish'}
                                  </span>
                                  {pointPreview ? <p className={styles.cardPreview}>{pointPreview}</p> : null}
                                </div>
                                {card.status === 'error' ? (
                                  <button type="button" className={styles.inlineRetry} onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    runCardAction(card.point_id, card.id, 'generate')
                                  }} disabled={isBusy}>
                                    {isBusy ? 'Retrying...' : 'Retry'}
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className={styles.cardMeta}>
                          <div className={styles.cardTextBlock}>
                            <p className={styles.cardTitle}>{card.title || 'Learning card'}</p>
                            <p className={styles.cardHint}>{getCardHint(card, linkedPoint?.note_role)}</p>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelTitle}>Next cards</h3>
                <p className={styles.panelCopy}>Community first, then render on demand.</p>
              </div>
              <div className={styles.panelCount}>{nextPoints.length}</div>
            </div>

            {nextPoints.length === 0 ? (
              <div className={styles.pointEmpty}>
                <p className={styles.cardsEmptyTitle}>All grouped concepts are ready</p>
                <p className={styles.cardsEmptyCopy}>Nothing is waiting on a manual decision right now.</p>
              </div>
            ) : (
              <div className={styles.pointScroll}>
                <AnimatePresence mode="popLayout">
                  {nextPoints.map((point, index) => {
                    const card = cardsByPointId.get(point.id)
                    const recommendation = recommendations[point.id] ?? null
                    const match = recommendation?.match ?? null
                    const isBusy = isCardActionPending && cardActionTarget === point.id

                    return (
                      <motion.div key={point.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.pointItem}>
                        <div className={styles.pointMain}>
                          <div className={styles.pointIndex}>{index + 1}</div>
                          <div className={styles.pointBody}>
                            <div className={styles.pointTopRow}>
                              <div className={styles.pointBadges}>
                                <span className={styles.pointRole}>{getRoleLabel(point.note_role)}</span>
                                <span className={styles.pointState}>{getCardStatusLabel(card, point.note_role, recommendation)}</span>
                              </div>
                              {card?.status === 'complete' ? <CheckCircle2 size={14} className={styles.doneIcon} /> : null}
                            </div>

                            <p className={styles.pointText}>{getPointPreview(point.text)}</p>
                            <p className={styles.pointHint}>
                              {match ? 'Capsule found a similar published card you can reuse or remix first.' : point.note_role === 'overflow' ? 'This stays out of the auto pipeline until you ask for it.' : 'Generate this only if the hero card is not enough.'}
                            </p>

                            {match && card?.status !== 'complete' ? (
                              <div className={styles.matchCard}>
                                <div className={styles.matchFrame}>
                                  {match.signed_url ? (
                                    <Image
                                      src={match.signed_url}
                                      alt={match.title || 'Matched community card'}
                                      fill
                                      sizes="160px"
                                      quality={58}
                                      placeholder="blur"
                                      blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                                      className={styles.matchImage}
                                    />
                                  ) : (
                                    <div className={styles.matchFallback}>Preview unavailable</div>
                                  )}
                                </div>
                                <div className={styles.matchMeta}>
                                  <p className={styles.matchTitle}>{match.title || 'Community match'}</p>
                                  <p className={styles.matchCopy}>{match.author_name ? `From ${match.author_name}` : 'Published community card'}</p>
                                </div>
                              </div>
                            ) : null}

                            <div className={styles.pointActions}>
                              {card?.status === 'generating' ? (
                                <div className={styles.pointInlineStatus}>Rendering now.</div>
                              ) : card?.status === 'error' ? (
                                <button type="button" className={styles.pointActionPrimary} onClick={() => runCardAction(point.id, card.id, 'generate')} disabled={isBusy}>
                                  <RefreshCcw size={14} />
                                  <span>{isBusy ? 'Retrying...' : 'Retry render'}</span>
                                </button>
                              ) : card?.status === 'complete' ? (
                                <Link href={`/cards/${card.id}`} className={styles.pointActionPrimary}>
                                  <ArrowRight size={14} />
                                  <span>Open card</span>
                                </Link>
                              ) : match && card ? (
                                <>
                                  <button type="button" className={styles.pointActionPrimary} onClick={() => runCardAction(point.id, card.id, 'use', match.card_id)} disabled={isBusy}>
                                    <CheckCircle2 size={14} />
                                    <span>{isBusy ? 'Applying...' : 'Use this'}</span>
                                  </button>
                                  <button type="button" className={styles.pointAction} onClick={() => runCardAction(point.id, card.id, 'remix', match.card_id)} disabled={isBusy}>
                                    <Repeat2 size={14} />
                                    <span>Remix</span>
                                  </button>
                                  <button type="button" className={styles.pointAction} onClick={() => runCardAction(point.id, card.id, 'generate')} disabled={isBusy}>
                                    <Wand2 size={14} />
                                    <span>Generate new</span>
                                  </button>
                                </>
                              ) : card ? (
                                <button type="button" className={styles.pointActionPrimary} onClick={() => runCardAction(point.id, card.id, 'generate')} disabled={isBusy}>
                                  <Wand2 size={14} />
                                  <span>{isBusy ? 'Queueing...' : point.note_role === 'overflow' ? 'Generate later' : 'Generate card'}</span>
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </div>

      <AdaptiveSheet
        open={Boolean(publishPrompt)}
        onClose={() => setPublishPrompt(null)}
        title={publishPrompt === 'publish' ? 'Publish this session?' : 'Unpublish this session?'}
        description={
          publishPrompt === 'publish'
            ? 'Completed cards go live now. The remaining cards publish as they finish.'
            : 'This removes the session from community. You can publish again any time.'
        }
        eyebrow={
          publishPrompt ? (
            <>
              {publishPrompt === 'publish' ? <Globe size={14} /> : <Lock size={14} />}
              <span>{publishPrompt === 'publish' ? 'Community' : 'Private library'}</span>
            </>
          ) : null
        }
        size="compact"
        closeLabel="Close session visibility dialog"
        footer={
          <>
            <button
              type="button"
              className={styles.secondaryAction}
              onClick={() => setPublishPrompt(null)}
              disabled={isPublishing}
            >
              Cancel
            </button>
            <button
              type="button"
              className={publishPrompt === 'publish' ? styles.primaryAction : styles.destructiveAction}
              onClick={() => handleToggleSessionVisibility(publishPrompt === 'publish')}
              disabled={isPublishing}
            >
              {isPublishing ? 'Saving...' : publishPrompt === 'publish' ? 'Publish all cards' : 'Unpublish session'}
            </button>
          </>
        }
      >
        <div className={styles.publishPromptLedger}>
          <div className={styles.publishPromptChip}>Ready {completeCards.length}</div>
          <div className={styles.publishPromptChip}>Reuse {suggestionCount}</div>
          <div className={styles.publishPromptChip}>Later {manualCount}</div>
        </div>
      </AdaptiveSheet>
    </div>
  )
}
