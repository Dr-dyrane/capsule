'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'

import { getSignedCardUrls } from '@/app/actions/assets'
import { generateSessionCards } from '@/app/actions/generate'
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
  const supabase = useMemo(() => createClient(), [])
  const processingStartedRef = useRef(false)
  const generationStartedRef = useRef(false)

  useEffect(() => {
    async function bootstrap() {
      const [{ data: initialSession }, { data: initialPoints }, { data: initialCards }] =
        await Promise.all([
          supabase.from('sessions').select('*').eq('id', sessionId).single(),
          supabase.from('points').select('*').eq('session_id', sessionId).order('sort_order', { ascending: true }),
          supabase.from('cards').select('*').eq('session_id', sessionId).order('created_at', { ascending: true }),
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
            [...current, payload.new as CardRecord].sort((a, b) =>
              (a.created_at || '').localeCompare(b.created_at || ''),
            ),
          )
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setCards((current) =>
            current.map((card) => (card.id === payload.new.id ? (payload.new as CardRecord) : card)),
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
    if (status !== 'processing') {
      processingStartedRef.current = false
    }
  }, [status])

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
    if (status !== 'generating') {
      generationStartedRef.current = false
    }
  }, [status])

  useEffect(() => {
    if (status === 'generating' && !generationStartedRef.current) {
      generationStartedRef.current = true
      void generateSessionCards(sessionId)
        .then((result) => {
          if (!result.success) {
            setStatus('error')
          }
        })
        .catch(() => setStatus('error'))
    }
  }, [sessionId, status])

  useEffect(() => {
    const completePaths = cards
      .filter((card) => card.status === 'complete')
      .map((card) => card.image_url)
      .filter((path) => !cardUrls[path])

    if (completePaths.length === 0) {
      return
    }

    void getSignedCardUrls(completePaths)
      .then((urls) => {
        setCardUrls((current) => ({ ...current, ...urls }))
      })
      .catch((error) => {
        console.error(error)
      })
  }, [cardUrls, cards])

  const completeCards = cards.filter((card) => card.status === 'complete')
  const totalPoints = points.length || session?.point_count || 0
  const progressWidth = totalPoints > 0 ? (completeCards.length / totalPoints) * 100 : 0
  const title =
    status === 'complete'
      ? 'Card set ready'
      : status === 'processing'
        ? 'Extracting the note'
        : status === 'error'
          ? 'Something interrupted the flow'
          : 'Generating the card set'
  const copy =
    status === 'complete'
      ? 'Your points and cards are ready to review.'
      : status === 'processing'
        ? 'We are isolating the teachable points before image generation starts.'
        : status === 'error'
          ? 'Try this session again.'
          : 'Capsule is turning each extracted point into a quick-scan learning card.'

  function handleRetry() {
    startRetryTransition(() => {
      void restartSession(sessionId)
        .then(() => {
          setPoints(EMPTY_POINTS)
          setCards(EMPTY_CARDS)
          setCardUrls({})
          setSession((current) =>
            current
              ? {
                  ...current,
                  status: 'processing',
                  point_count: 0,
                  card_count: 0,
                }
              : current,
          )
          setStatus('processing')
        })
        .catch((error) => {
          console.error(error)
          setStatus('error')
        })
    })
  }

  return (
    <div className={styles.root}>
      <section className={styles.statusPanel}>
        <div className={styles.statusInner}>
          <div className={styles.statusMeta}>
            <div>
              <div className={styles.statusEyebrow}>
                <Sparkles size={14} aria-hidden="true" />
                <span>{status.toUpperCase()}</span>
              </div>
              <h2 className={styles.statusTitle}>{title}</h2>
            </div>

            <div className={styles.count}>
              {completeCards.length} / {totalPoints || '?'}
            </div>
          </div>

          <p className={styles.statusCopy}>{copy}</p>
          {status === 'error' ? (
            <div className={styles.statusActions}>
              <button type="button" className={styles.retryButton} onClick={handleRetry} disabled={isRetrying}>
                {isRetrying ? 'Retrying...' : 'Try again'}
              </button>
            </div>
          ) : null}
          <div className={styles.progressRail}>
            <div className={styles.progressFill} style={{ width: `${progressWidth}%` }} />
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.panel}>
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Extracted points</h3>
              <div className={styles.count}>{points.length || 0}</div>
            </div>

            <div className={styles.pointList}>
              {points.map((point) => (
                <div key={point.id} className={styles.pointItem}>
                  <span className={styles.pointBullet}>•</span>
                  <p className={styles.pointText}>{point.text}</p>
                </div>
              ))}
              {status === 'processing' ? <div className={styles.pointSkeleton} /> : null}
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelInner}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>Generated cards</h3>
              <div className={styles.count}>{completeCards.length}</div>
            </div>

            <div className={styles.cardGrid}>
              {cards.map((card) => {
                const signedUrl = cardUrls[card.image_url]

                return (
                  <div key={card.id} className={styles.cardItem}>
                    {card.status === 'complete' && signedUrl ? (
                      <Image
                        src={signedUrl}
                        alt={card.title || 'Generated card'}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.cardImage}
                      />
                    ) : (
                      <div className={styles.cardSkeleton} />
                    )}
                    <div className={styles.cardTitle}>{card.title || 'Generating card'}</div>
                  </div>
                )
              })}
              {status === 'generating' && cards.length < totalPoints ? (
                <div className={styles.cardItem}>
                  <div className={styles.cardSkeleton} />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
