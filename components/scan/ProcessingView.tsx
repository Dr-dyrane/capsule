'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

import { processNote } from '@/app/actions/process'
import { getSignedCardUrls } from '@/app/actions/assets'
import { generateSessionCards } from '@/app/actions/generate'
import { createClient } from '@/lib/supabase/client'
import type { CardRecord, PointRecord, SessionRecord, SessionStatus } from '@/lib/types'

const EMPTY_POINTS: PointRecord[] = []
const EMPTY_CARDS: CardRecord[] = []

export default function ProcessingView({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<SessionRecord | null>(null)
  const [points, setPoints] = useState<PointRecord[]>(EMPTY_POINTS)
  const [cards, setCards] = useState<CardRecord[]>(EMPTY_CARDS)
  const [cardUrls, setCardUrls] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<SessionStatus | 'loading'>('loading')
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
          setCards((current) => current.map((card) => (card.id === payload.new.id ? (payload.new as CardRecord) : card)))
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
      void processNote(sessionId).catch(() => setStatus('error'))
    }
  }, [sessionId, status])

  useEffect(() => {
    if (status === 'generating' && !generationStartedRef.current) {
      generationStartedRef.current = true
      void generateSessionCards(sessionId).catch(() => setStatus('error'))
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

  return (
    <div className="processing-view animate-fade-in">
      <div className="status-header glass surface-1">
        <div className="progress-info">
          <p className="caption">{status.toUpperCase()}</p>
          <h2 className="title-2">
            {status === 'complete'
              ? 'Cards Complete'
              : `Generating ${completeCards.length} of ${totalPoints || '?'} cards`}
          </h2>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar accent" style={{ width: `${progressWidth}%` }} />
        </div>
      </div>

      <div className="content-grid">
        <section className="points-list">
          <h3 className="subhead">Extracted Points</h3>
          <div className="points-container no-scrollbar">
            {points.map((point, index) => (
              <div
                key={point.id}
                className="point-item animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <span className="point-bullet">•</span>
                <p className="body">{point.text}</p>
              </div>
            ))}
            {status === 'processing' && <div className="point-skeleton shimmer surface-1" />}
          </div>
        </section>

        <section className="cards-grid-panel">
          <h3 className="subhead">Generated Cards</h3>
          <div className="grid-container">
            {cards.map((card) => {
              const signedUrl = cardUrls[card.image_url]

              return (
                <div key={card.id} className="card-item surface-1 glass animate-fade-in">
                  {card.status === 'complete' && signedUrl ? (
                    <Image
                      src={signedUrl}
                      alt={card.title || 'Generated card'}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="card-skeleton shimmer" />
                  )}
                  <div className="card-title-bar glass">{card.title}</div>
                </div>
              )
            })}
            {status === 'generating' && cards.length < totalPoints && (
              <div className="card-item surface-1 glass shimmer" />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
