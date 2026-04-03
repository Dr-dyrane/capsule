'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
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
import AdaptiveSheet from '@/components/ui/AdaptiveSheet'
import DeleteActionButton from '@/components/ui/DeleteActionButton'
import { createClient } from '@/lib/supabase/client'
import type { CardRecord, NoteRole, PointRecord, SessionRecommendationRecord, SessionRecord, SessionStatus } from '@/lib/types'

import styles from './ProcessingView.module.css'

const EMPTY_POINTS: PointRecord[] = []
const EMPTY_CARDS: CardRecord[] = []

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
  const [cardUrls, setCardUrls] = useState<Record<string, string>>({})
  const [recommendations, setRecommendations] = useState<Record<string, SessionRecommendationRecord>>({})
  const [status, setStatus] = useState<SessionStatus | 'loading'>('loading')
  const [cardActionTarget, setCardActionTarget] = useState<string | null>(null)
  const [isRetrying, startRetryTransition] = useTransition()
  const [isPublishing, startPublishTransition] = useTransition()
  const [isCardActionPending, startCardActionTransition] = useTransition()
  const [publishPrompt, setPublishPrompt] = useState<'publish' | 'unpublish' | null>(null)

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
      if (initialPoints) setPoints(initialPoints as PointRecord[])
      if (initialCards) setCards(initialCards as CardRecord[])
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
          if (!result.success) setStatus('error')
        })
        .catch(() => setStatus('error'))
    }
  }, [sessionId, status])

  useEffect(() => {
    if (status === 'loading' || status === 'processing' || points.length === 0) return
    const hasMissingCards = points.some((point) => !cards.some((card) => card.point_id === point.id))
    if (!hasMissingCards || placeholderSyncRef.current) return

    placeholderSyncRef.current = true
    void ensureCardPlaceholders(sessionId)
      .catch((error) => console.error('Placeholder sync failed:', error))
      .finally(() => {
        placeholderSyncRef.current = false
      })
  }, [cards, points, sessionId, status])

  const recommendationKey = useMemo(
    () => cards.map((card) => `${card.point_id}:${card.generation_gate ?? ''}:${card.community_match_card_id ?? ''}:${card.status}`).join('|'),
    [cards],
  )

  useEffect(() => {
    if (points.length === 0 || cards.length === 0) return
    let active = true

    void getSessionRecommendations(sessionId)
      .then((rows) => {
        if (!active) return
        setRecommendations(rows.reduce<Record<string, SessionRecommendationRecord>>((acc, row) => {
          acc[row.point_id] = row
          return acc
        }, {}))
      })
      .catch((error) => console.error('Recommendation sync failed:', error))

    return () => {
      active = false
    }
  }, [sessionId, points.length, cards.length, recommendationKey])

  useEffect(() => {
    const freshPaths = cards.filter((card) => card.status === 'complete' && !cardUrls[card.image_url]).map((card) => card.image_url)
    if (freshPaths.length === 0) return

    void getSignedCardUrls(freshPaths)
      .then((urls) => setCardUrls((current) => ({ ...current, ...urls })))
      .catch(console.error)
  }, [cardUrls, cards])

  function handleRetrySession() {
    startRetryTransition(() => {
      void restartSession(sessionId).then(() => {
        setPoints(EMPTY_POINTS)
        setCards(EMPTY_CARDS)
        setRecommendations({})
        setCardUrls({})
        setStatus('processing')
        processingStartedRef.current = false
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

      void task.catch((error) => console.error('Card action failed:', error)).finally(() => setCardActionTarget(null))
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
          ? 'Retry the session or rerun a single card.'
          : 'One automatic hero card starts the session. The rest stay lightweight until you ask for more.'

  function handleToggleSessionVisibility(nextPublishedState: boolean) {
    startPublishTransition(() => {
      setSession((current) => current ? { ...current, visibility: nextPublishedState ? 'published' : 'private' } : current)

      void (nextPublishedState ? publishSession(sessionId) : unpublishSession(sessionId))
        .then(() => setPublishPrompt(null))
        .catch((error) => {
          console.error('Failed to update session visibility', error)
          setSession((current) => current ? { ...current, visibility: nextPublishedState ? 'private' : 'published' } : current)
          setPublishPrompt(null)
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
                {isPublishing ? 'Saving...' : isSessionPublished ? <><Lock size={14} /><span>Unpublish all</span></> : <><Globe size={14} /><span>Publish all</span></>}
              </button>
              <DeleteActionButton targetId={sessionId} targetType="session" redirectTo="/library" compactOnMobile />
            </div>
          </div>

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
                              <Image src={signedUrl} alt={card.title || 'Generated card'} fill unoptimized sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 33vw" className={styles.cardImage} />
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
                                    <Image src={match.signed_url} alt={match.title || 'Matched community card'} fill unoptimized sizes="160px" className={styles.matchImage} />
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
