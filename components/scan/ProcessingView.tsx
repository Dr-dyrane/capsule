'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowUp, RefreshCcw, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { getSignedCardUrls } from '@/app/actions/assets'
import { generateCard } from '@/app/actions/generate'
import { processNote, restartSession } from '@/app/actions/process'
import { createClient } from '@/lib/supabase/client'
import type { CardRecord, PointRecord, SessionRecord, SessionStatus } from '@/lib/types'

import styles from './ProcessingView.module.css'

const EMPTY_POINTS: PointRecord[] = []
const EMPTY_CARDS: CardRecord[] = []

export default function ProcessingView({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<SessionRecord | null>(null)
  const [points, setPoints] = useState<PointRecord[]>(EMPTY_POINTS)
  const [cards, setCards] = useState<CardRecord[]>(EMPTY_CARDS)
  const [cardUrls, setCardUrls] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<SessionStatus | 'loading'>('loading')
  const [isRetrying, startRetryTransition] = useTransition()
  
  // Queue Management
  const [queuedPointIds, setQueuedPointIds] = useState<string[]>([])
  const [activePointId, setActivePointId] = useState<string | null>(null)
  const activePointIdRef = useRef<string | null>(null)

  const supabase = useMemo(() => createClient(), [])
  const processingStartedRef = useRef(false)
  const router = useRouter()

  // 1. Bootstrap & Subscriptions
  useEffect(() => {
    async function bootstrap() {
      const [{ data: initialSession }, { data: initialPoints }, { data: initialCards }] =
        await Promise.all([
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
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'points', filter: `session_id=eq.${sessionId}` }, (p) => {
        setPoints((curr) => [...curr, p.new as PointRecord].sort((a, b) => a.sort_order - b.sort_order))
      })
      .subscribe()

    const cardsSub = supabase
      .channel(`cards:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` }, (p) => {
        setCards((curr) => [...curr, p.new as CardRecord].sort((a, b) => (a.card_order ?? 0) - (b.card_order ?? 0)))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` }, (p) => {
        setCards((curr) =>
          curr
            .map((c) => (c.id === p.new.id ? (p.new as CardRecord) : c))
            .sort((a, b) => (a.card_order ?? 0) - (b.card_order ?? 0)),
        )
      })
      .subscribe()

    const sessionSub = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` }, (p) => {
        setStatus(p.new.status as SessionStatus)
        setSession(p.new as SessionRecord)
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(pointsSub)
      void supabase.removeChannel(cardsSub)
      void supabase.removeChannel(sessionSub)
    }
  }, [sessionId, supabase])

  // 2. OCR Processing (Phased Logic)
  useEffect(() => {
    if (status === 'processing' && !processingStartedRef.current) {
      processingStartedRef.current = true
      void processNote(sessionId).then((r) => { if (!r.success) setStatus('error') }).catch(() => setStatus('error'))
    }
  }, [sessionId, status])

  // 3. Queue Orchestrator (Phase 3 Core)
  useEffect(() => {
    if (status !== 'generating') return

    setQueuedPointIds((prev) => {
      const missingPointIds = points
        .filter((point) => {
          const card = cards.find((candidate) => candidate.point_id === point.id)
          return !card || card.status === 'queued'
        })
        .map(p => p.id)
      
      const toAdd = missingPointIds.filter(id => !prev.includes(id) && activePointIdRef.current !== id)
      if (toAdd.length > 0) return [...prev, ...toAdd]
      return prev
    })
  }, [points, cards, status])

  useEffect(() => {
    if (status !== 'generating' || activePointId || queuedPointIds.length === 0) return

    const [nextId, ...rest] = queuedPointIds
    queueMicrotask(() => {
      setActivePointId(nextId)
      activePointIdRef.current = nextId
      setQueuedPointIds(rest)

      void generateCard(nextId)
        .catch(err => console.error('Generation failure:', err))
        .finally(() => {
          setActivePointId(null)
          activePointIdRef.current = null
        })
    })
  }, [status, activePointId, queuedPointIds])

  // 4. Asset URL Handling
  useEffect(() => {
    const freshPaths = cards
      .filter((c) => c.status === 'complete' && !cardUrls[c.image_url])
      .map((c) => c.image_url)

    if (freshPaths.length > 0) {
      void getSignedCardUrls(freshPaths).then((urls) => {
        setCardUrls((curr) => ({ ...curr, ...urls }))
      }).catch(console.error)
    }
  }, [cards, cardUrls])

  // 5. Actions
  const handlePromote = useCallback((id: string) => {
    if (activePointId === id) return
    setQueuedPointIds(prev => [id, ...prev.filter(x => x !== id)])
  }, [activePointId])

  const handleRefine = useCallback(async (pointId: string, cardId: string) => {
    try {
      await generateCard(pointId, cardId)
    } catch (err) {
      console.error('Refinement failed:', err)
    }
  }, [])

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

  // Visual Helpers
  const completeCards = cards.filter((c) => c.status === 'complete')
  const totalPoints = points.length || session?.point_count || 0
  const progressWidth = totalPoints > 0 ? (completeCards.length / totalPoints) * 100 : 0

  function getCardStatusLabel(cardStatus: CardRecord['status']) {
    if (cardStatus === 'complete') return 'Ready'
    if (cardStatus === 'generating') return 'Generating'
    if (cardStatus === 'error') return 'Error'
    return 'Queued'
  }

  return (
    <div className={styles.root}>
      {/* Absolute Status Bar (Rule 6: Calm Feedback) */}
      <section className={styles.statusPanel}>
        <div className={styles.statusInner}>
          <div className={styles.statusMeta}>
            <div>
              <div className={styles.statusEyebrow}>
                <Sparkles size={14} />
                <span>{status.toUpperCase()}</span>
              </div>
              <h2 className={styles.statusTitle}>
                {status === 'complete' ? 'Collection ready.' : status === 'error' ? 'Session stalled.' : 'Building your visual archive.'}
              </h2>
            </div>
            <div className={styles.countText}>{completeCards.length} / {totalPoints || '?'}</div>
          </div>
          <div className={styles.progressRail}>
            <motion.div 
              className={styles.progressFill} 
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 60 }}
            />
          </div>
        </div>
      </section>

      <div className={styles.content}>
        {/* Points Sidebar (Rule 16: Reveal on Intent) */}
        <section className={styles.panel}>
          <div className={styles.panelInner}>
            <h3 className={styles.panelTitle}>Points Matrix</h3>
            <div className={styles.pointList}>
              <AnimatePresence mode="popLayout">
                {points.map((point) => {
                  const isActive = activePointId === point.id
                  const isDone = cards.some(c => c.point_id === point.id && c.status === 'complete')

                  return (
                    <motion.div 
                      key={point.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${styles.pointItem} ${isActive ? styles.activePoint : ''} ${isDone ? styles.donePoint : ''}`}
                    >
                      <div className={styles.pointMain}>
                        <CheckCircle2 size={12} className={styles.doneIcon} />
                        <p className={styles.pointText}>{point.text}</p>
                      </div>
                      {!isDone && !isActive && (
                        <button 
                          className={styles.promoteBtn} 
                          onClick={() => handlePromote(point.id)}
                          title="Promote to front"
                        >
                          <ArrowUp size={14} />
                        </button>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              {status === 'processing' && <div className={styles.pointSkeleton} />}
            </div>
          </div>
        </section>

        {/* Cards Gallery (Phase 3 Core: The Bloom) */}
        <section className={styles.panel}>
          <div className={styles.panelInner}>
            <h3 className={styles.panelTitle}>Visual Cards</h3>
            <div className={styles.cardGrid}>
              <AnimatePresence mode="popLayout">
                {cards.map((card) => {
                  const signedUrl = cardUrls[card.image_url]
                  const isGenerating = card.status === 'generating'

                  return (
                    <motion.div 
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={styles.cardItem}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/cards/${card.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          router.push(`/cards/${card.id}`)
                        }
                      }}
                    >
                      <div className={styles.cardStatus}>{getCardStatusLabel(card.status)}</div>
                      <div className={styles.cardVisual}>
                        {card.status === 'complete' && signedUrl ? (
                          <div className={styles.revealWrapper}>
                            <Image src={signedUrl} alt={card.title || ''} fill className={styles.cardImage} unoptimized />
                            <div className={styles.cardOverlay}>
                              <button 
                                className={styles.refineBtn}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleRefine(card.point_id, card.id)
                                }}
                              >
                                <RefreshCcw size={14} /> <span>Refine Visual</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`${styles.cardSkeleton} ${isGenerating ? styles.shimmering : ''}`}>
                            {isGenerating && <div className={styles.glowPulse} />}
                          </div>
                        )}
                      </div>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardTitle}>{card.title}</span>
                        {card.status === 'error' ? (
                          <button
                            type="button"
                            className={styles.inlineRetry}
                            onClick={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              void handleRefine(card.point_id, card.id)
                            }}
                          >
                            Retry card
                          </button>
                        ) : null}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      {status === 'error' && (
        <div className={styles.errorBanner}>
          <p>Generation encountered a limitation.</p>
          <button onClick={handleRetry} className={styles.retryBtn} disabled={isRetrying}>
            {isRetrying ? 'Restarting...' : 'Restart Session'}
          </button>
        </div>
      )}
    </div>
  )
}
