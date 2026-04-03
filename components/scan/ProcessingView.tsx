'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ScanText, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { getSignedCardUrls } from '@/app/actions/assets'
import { ensureCardPlaceholders, generateCard } from '@/app/actions/generate'
import { processNote, restartSession } from '@/app/actions/process'
import ImagePreview from '@/components/cards/ImagePreview'
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

export default function ProcessingView({
  sessionId,
  sourceImageUrl,
}: {
  sessionId: string
  sourceImageUrl?: string | null
}) {
  const [session, setSession] = useState<SessionRecord | null>(null)
  const [points, setPoints] = useState<PointRecord[]>(EMPTY_POINTS)
  const [cards, setCards] = useState<CardRecord[]>(EMPTY_CARDS)
  const [cardUrls, setCardUrls] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<SessionStatus | 'loading'>('loading')
  const [isRetrying, startRetryTransition] = useTransition()

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

  function handleRetry() {
    startRetryTransition(() => {
      void restartSession(sessionId).then(() => {
        setPoints(EMPTY_POINTS)
        setCards(EMPTY_CARDS)
        setCardUrls({})
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
  const pointsById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points])

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
      ? 'Open any card.'
      : status === 'processing'
        ? 'Extracting points first.'
        : status === 'error'
          ? 'Retry the session or a single card.'
          : 'Open cards as they appear.'

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

      {sourceImageUrl ? (
        <section className={`${styles.panel} ${styles.sourcePanel}`}>
          <div className={`${styles.panelInner} ${styles.sourceInner}`}>
            <div className={styles.sourceCopy}>
              <div className={styles.panelEyebrow}>
                <ScanText size={14} aria-hidden="true" />
                <span>Original note</span>
              </div>
              <h3 className={styles.panelTitle}>Source scan</h3>
              <p className={styles.panelCopy}>The note image that started this session.</p>
              <Link href="/library" className={styles.inlineAction}>
                Back to sessions
              </Link>
            </div>

            <div className={styles.sourcePreview}>
              <ImagePreview src={sourceImageUrl} alt="Original note scan" />
            </div>
          </div>
        </section>
      ) : null}

      <div className={styles.content}>
        <section className={`${styles.panel} ${styles.cardsPanel}`}>
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <div>
                <h3 className={styles.panelTitle}>Cards</h3>
                <p className={styles.panelCopy}>Live build state.</p>
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
                    const linkedPoint = pointsById.get(card.point_id)
                    const pointPreview = linkedPoint ? getPointPreview(linkedPoint.text) : ''

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
                            <div className={styles.cardFrame}>
                              <Image
                                src={signedUrl}
                                alt={card.title || 'Generated card'}
                                fill
                                unoptimized
                                sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 33vw"
                                className={styles.cardImage}
                              />
                            </div>
                          ) : (
                            <div className={`${styles.cardPlaceholder} ${card.status === 'generating' ? styles.shimmering : ''}`}>
                              <div className={styles.cardPlaceholderBody}>
                                <span className={styles.cardPlaceholderText}>
                                  {card.status === 'queued'
                                    ? 'Waiting in queue'
                                    : card.status === 'generating'
                                      ? 'Rendering image'
                                      : card.status === 'error'
                                        ? 'Stopped before finish'
                                        : 'Preparing card'}
                                </span>
                                {pointPreview ? <p className={styles.cardPreview}>{pointPreview}</p> : null}
                              </div>
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
                                void generateCard(card.point_id, card.id).catch((error) => {
                                  console.error('Refinement failed:', error)
                                })
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
                <p className={styles.panelCopy}>Point order.</p>
              </div>
              <div className={styles.panelCount}>{points.length}</div>
            </div>

            <div className={styles.pointScroll}>
              <AnimatePresence mode="popLayout">
                {points.map((point, index) => {
                  const card = cards.find((candidate) => candidate.point_id === point.id)
                  const pointState = getCardStatusLabel(card?.status ?? 'queued')
                  const isDone = pointState === 'Ready'

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
