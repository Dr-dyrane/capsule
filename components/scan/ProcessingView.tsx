'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowUp, CheckCircle2, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { getSignedCardUrls } from '@/app/actions/assets'
import { ensureCardPlaceholders, generateCard } from '@/app/actions/generate'
import { processNote, restartSession } from '@/app/actions/process'
import { createClient } from '@/lib/supabase/client'
import type { CardRecord, PointRecord, SessionRecord, SessionStatus } from '@/lib/types'

import styles from './ProcessingView.module.css'

const EMPTY_POINTS: PointRecord[] = []
const EMPTY_CARDS: CardRecord[] = []

function getCardStatusLabel(cardStatus: CardRecord['status']) {
  if (cardStatus === 'complete') return 'Ready'
  if (cardStatus === 'generating') return 'Generating'
  if (cardStatus === 'error') return 'Error'
  return 'Queued'
}

function getFallbackCardTitle(text: string) {
  const title = text.split(':')[0]?.trim()
  return title || 'Learning card'
}

function getPointPreview(text: string) {
  const compact = text.replace(/\s+/g, ' ').trim()
  if (compact.length <= 120) {
    return compact
  }

  return `${compact.slice(0, 117).trimEnd()}...`
}

export default function ProcessingView({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<SessionRecord | null>(null)
  const [points, setPoints] = useState<PointRecord[]>(EMPTY_POINTS)
  const [cards, setCards] = useState<CardRecord[]>(EMPTY_CARDS)
  const [cardUrls, setCardUrls] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<SessionStatus | 'loading'>('loading')
  const [isRetrying, startRetryTransition] = useTransition()
  const [queuedPointIds, setQueuedPointIds] = useState<string[]>([])
  const [activePointId, setActivePointId] = useState<string | null>(null)

  const activePointIdRef = useRef<string | null>(null)
  const placeholderSyncRef = useRef(false)
  const processingStartedRef = useRef(false)

  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()

  useEffect(() => {
    async function bootstrap() {
      const [{ data: initialSession }, { data: initialPoints }, { data: initialCards }] = await Promise.all([
        supabase.from('sessions').select('*').eq('id', sessionId).single(),
        supabase.from('points').select('*').eq('session_id', sessionId).order('sort_order', { ascending: true }),
        supabase.from('cards').select('*').eq('session_id', sessionId).order('card_order', { ascending: true }),
      ])

      if (initialSession) {
        setSession(initialSession as SessionRecord)
        setStatus((initialSession.status as SessionStatus) || 'loading')
      }

      if (initialPoints) {
        setPoints(initialPoints as PointRecord[])
      }

      if (initialCards) {
        setCards(initialCards as CardRecord[])
      }
    }

    void bootstrap()

    const pointsSub = supabase
      .channel(`points:${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'points', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setPoints((current) =>
            [...current, payload.new as PointRecord].sort((a, b) => a.sort_order - b.sort_order),
          )
        },
      )
      .subscribe()

    const cardsSub = supabase
      .channel(`cards:${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setCards((current) =>
            [...current, payload.new as CardRecord].sort((a, b) => (a.card_order ?? 0) - (b.card_order ?? 0)),
          )
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setCards((current) =>
            current
              .map((card) => (card.id === payload.new.id ? (payload.new as CardRecord) : card))
              .sort((a, b) => (a.card_order ?? 0) - (b.card_order ?? 0)),
          )
        },
      )
      .subscribe()

    const sessionSub = supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          setStatus(payload.new.status as SessionStatus)
          setSession(payload.new as SessionRecord)
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(pointsSub)
      void supabase.removeChannel(cardsSub)
      void supabase.removeChannel(sessionSub)
    }
  }, [sessionId, supabase])

  useEffect(() => {
    if (status === 'processing' && !processingStartedRef.current) {
      processingStartedRef.current = true
      void processNote(sessionId)
        .then((result) => {
          if (!result.success) {
            setStatus('error')
          }
        })
        .catch(() => setStatus('error'))
    }
  }, [sessionId, status])

  useEffect(() => {
    if (status === 'loading' || status === 'processing' || points.length === 0) {
      return
    }

    const hasMissingCards = points.some((point) => !cards.some((card) => card.point_id === point.id))
    if (!hasMissingCards || placeholderSyncRef.current) {
      return
    }

    placeholderSyncRef.current = true
    void ensureCardPlaceholders(sessionId)
      .catch((error) => {
        console.error('Placeholder sync failed:', error)
      })
      .finally(() => {
        placeholderSyncRef.current = false
      })
  }, [cards, points, sessionId, status])

  useEffect(() => {
    if (status !== 'generating') {
      return
    }

    setQueuedPointIds((current) => {
      const missingPointIds = points
        .filter((point) => {
          const card = cards.find((candidate) => candidate.point_id === point.id)
          return !card || card.status === 'queued'
        })
        .map((point) => point.id)

      const next = missingPointIds.filter((id) => !current.includes(id) && activePointIdRef.current !== id)
      return next.length > 0 ? [...current, ...next] : current
    })
  }, [cards, points, status])

  useEffect(() => {
    if (status !== 'generating' || activePointId || queuedPointIds.length === 0) {
      return
    }

    const [nextId, ...rest] = queuedPointIds

    queueMicrotask(() => {
      setActivePointId(nextId)
      activePointIdRef.current = nextId
      setQueuedPointIds(rest)

      void generateCard(nextId)
        .catch((error) => {
          console.error('Generation failure:', error)
        })
        .finally(() => {
          setActivePointId(null)
          activePointIdRef.current = null
        })
    })
  }, [activePointId, queuedPointIds, status])

  useEffect(() => {
    const freshPaths = cards
      .filter((card) => card.status === 'complete' && !cardUrls[card.image_url])
      .map((card) => card.image_url)

    if (freshPaths.length === 0) {
      return
    }

    void getSignedCardUrls(freshPaths)
      .then((urls) => {
        setCardUrls((current) => ({ ...current, ...urls }))
      })
      .catch(console.error)
  }, [cardUrls, cards])

  const handlePromote = useCallback(
    (id: string) => {
      if (activePointId === id) {
        return
      }

      setQueuedPointIds((current) => [id, ...current.filter((entry) => entry !== id)])
    },
    [activePointId],
  )

  const handleRefine = useCallback(async (pointId: string, cardId: string) => {
    try {
      await generateCard(pointId, cardId)
    } catch (error) {
      console.error('Refinement failed:', error)
    }
  }, [])

  function handleRetry() {
    startRetryTransition(() => {
      void restartSession(sessionId).then(() => {
        setPoints(EMPTY_POINTS)
        setCards(EMPTY_CARDS)
        setCardUrls({})
        setQueuedPointIds([])
        setActivePointId(null)
        activePointIdRef.current = null
        setStatus('processing')
        processingStartedRef.current = false
      })
    })
  }

  const completeCards = cards.filter((card) => card.status === 'complete')
  const generatingCards = cards.filter((card) => card.status === 'generating')
  const queuedCards = cards.filter((card) => card.status === 'queued')
  const erroredCards = cards.filter((card) => card.status === 'error')
  const totalPoints = points.length || session?.point_count || 0
  const progressWidth = totalPoints > 0 ? (completeCards.length / totalPoints) * 100 : 0

  const statusTitle =
    status === 'complete'
      ? 'Cards ready.'
      : status === 'processing'
        ? 'Extracting points.'
        : status === 'error'
          ? 'Generation paused.'
          : status === 'loading'
            ? 'Loading session.'
            : 'Building cards.'

  const statusCopy =
    status === 'complete'
      ? 'Open any card below.'
      : status === 'processing'
        ? 'The point list comes first, then the card queue fills in.'
        : status === 'error'
          ? 'Some cards can still be reviewed. Retry the session or restart individual cards below.'
          : 'Cards appear as soon as they enter the queue. You do not need to wait for the whole batch.'

  const displayCards =
    cards.length > 0
      ? cards
      : points.map((point, index) => ({
          id: `shadow-${point.id}`,
          point_id: point.id,
          session_id: sessionId,
          image_url: '',
          title: getFallbackCardTitle(point.text),
          status: 'queued' as const,
          card_order: index,
        }))

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

            <div className={styles.statusCount}>{completeCards.length} / {totalPoints || '?'}</div>
          </div>

          <div className={styles.statusLedger}>
            <div className={styles.statusChip}>Ready {completeCards.length}</div>
            <div className={styles.statusChip}>Generating {generatingCards.length}</div>
            <div className={styles.statusChip}>Queued {queuedCards.length}</div>
            {erroredCards.length > 0 ? <div className={styles.statusChip}>Errors {erroredCards.length}</div> : null}
          </div>

          {status === 'error' ? (
            <div className={styles.statusActions}>
              <button type="button" className={styles.primaryAction} onClick={handleRetry} disabled={isRetrying}>
                {isRetrying ? 'Restarting...' : 'Restart session'}
              </button>
            </div>
          ) : null}

          <div className={styles.progressRail}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ type: 'spring', damping: 22, stiffness: 90 }}
            />
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <section className={`${styles.panel} ${styles.cardsPanel}`}>
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelTitle}>Cards</h3>
                <p className={styles.panelCopy}>Each card advances on its own. Open it the moment it appears.</p>
              </div>
              <div className={styles.panelCount}>{displayCards.length}</div>
            </div>

            {displayCards.length === 0 ? (
              <div className={styles.cardsEmpty}>
                <p className={styles.cardsEmptyTitle}>No cards yet</p>
                <p className={styles.cardsEmptyCopy}>As soon as the queue starts, each card appears here on its own.</p>
              </div>
            ) : (
              <div className={styles.cardGrid}>
                <AnimatePresence mode="popLayout">
                  {displayCards.map((card) => {
                    const signedUrl = card.image_url ? cardUrls[card.image_url] : undefined
                    const statusLabel = getCardStatusLabel(card.status)
                    const isPersisted = !card.id.startsWith('shadow-')
                    const showRetry = card.status === 'error' && isPersisted

                    return (
                      <motion.article
                        key={card.id}
                        layout
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.cardItem}
                        role={isPersisted ? 'button' : undefined}
                        tabIndex={isPersisted ? 0 : -1}
                        onClick={isPersisted ? () => router.push(`/cards/${card.id}`) : undefined}
                        onKeyDown={
                          isPersisted
                            ? (event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault()
                                  router.push(`/cards/${card.id}`)
                                }
                              }
                            : undefined
                        }
                      >
                        <div className={styles.cardVisual}>
                          <div className={styles.cardStatus}>{statusLabel}</div>

                          {card.status === 'complete' && signedUrl ? (
                            <Image
                              src={signedUrl}
                              alt={card.title || 'Generated card'}
                              fill
                              unoptimized
                              sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 33vw"
                              className={styles.cardImage}
                            />
                          ) : (
                            <div className={`${styles.cardPlaceholder} ${card.status === 'generating' ? styles.shimmering : ''}`}>
                              <span className={styles.cardPlaceholderText}>
                                {card.status === 'queued'
                                  ? 'Waiting in queue'
                                  : card.status === 'generating'
                                    ? 'Rendering image'
                                    : card.status === 'error'
                                      ? 'Stopped before finish'
                                      : 'Preparing card'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={styles.cardMeta}>
                          <div className={styles.cardTextBlock}>
                            <p className={styles.cardTitle}>{card.title || 'Learning card'}</p>
                            <p className={styles.cardHint}>
                              {card.status === 'complete'
                                ? 'Open card'
                                : card.status === 'error'
                                  ? 'Retry or open detail'
                                  : 'Live batch state'}
                            </p>
                          </div>

                          {showRetry ? (
                            <button
                              type="button"
                              className={styles.inlineRetry}
                              onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()
                                void handleRefine(card.point_id, card.id)
                              }}
                            >
                              Retry
                            </button>
                          ) : null}
                        </div>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.queuePanel}`}>
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelTitle}>Queue</h3>
                <p className={styles.panelCopy}>Compact point summaries with live status.</p>
              </div>
              <div className={styles.panelCount}>{points.length}</div>
            </div>

            <div className={styles.pointScroll}>
              <AnimatePresence mode="popLayout">
                {points.map((point, index) => {
                  const card = cards.find((candidate) => candidate.point_id === point.id)
                  const pointState = activePointId === point.id ? 'Generating' : getCardStatusLabel(card?.status ?? 'queued')
                  const isDone = pointState === 'Ready'
                  const canPromote = pointState === 'Queued' && status === 'generating'

                  return (
                    <motion.div
                      key={point.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={styles.pointItem}
                    >
                      <div className={styles.pointMain}>
                        <div className={styles.pointIndex}>{index + 1}</div>
                        <div className={styles.pointBody}>
                          <div className={styles.pointTopRow}>
                            <span className={styles.pointState}>{pointState}</span>
                            {isDone ? <CheckCircle2 size={14} className={styles.doneIcon} /> : null}
                          </div>
                          <p className={styles.pointText}>{getPointPreview(point.text)}</p>
                        </div>
                      </div>

                      {canPromote ? (
                        <div className={styles.pointFooter}>
                          <button
                            type="button"
                            className={styles.promoteButton}
                            onClick={() => handlePromote(point.id)}
                          >
                            <ArrowUp size={14} aria-hidden="true" />
                            <span>Move next</span>
                          </button>
                        </div>
                      ) : null}
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {status === 'processing' ? <div className={styles.pointSkeleton} /> : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
