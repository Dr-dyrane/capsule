'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { processNote } from '@/app/actions/process'
import { generateCard } from '@/app/actions/generate'

export default function ProcessingView({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<any>(null)
  const [points, setPoints] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [status, setStatus] = useState<'loading' | 'processing' | 'generating' | 'complete' | 'error'>('loading')
  const supabase = createClient()

  useEffect(() => {
    async function start() {
      // 1. Initial Load
      const { data: initialSession } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', sessionId)
        .single()
      
      setSession(initialSession)
      setStatus(initialSession?.status || 'loading')

      // 2. Start Processing if needed
      if (initialSession?.status === 'processing') {
        try {
          await processNote(sessionId)
        } catch (e) {
          setStatus('error')
        }
      }
    }

    start()

    // 3. Real-time Subscriptions
    const pointsSub = supabase
      .channel('points')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'points', filter: `session_id=eq.${sessionId}` }, 
        (payload) => {
          setPoints(current => [...current, payload.new].sort((a,b) => a.sort_order - b.sort_order))
        }
      )
      .subscribe()

    const cardsSub = supabase
      .channel('cards')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setCards(current => [...current, payload.new].sort((a,b) => a.created_at.localeCompare(b.created_at)))
        }
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cards', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setCards(current => current.map(c => c.id === payload.new.id ? payload.new : c))
        }
      )
      .subscribe()

    const sessionSub = supabase
      .channel('session_status')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          setStatus(payload.new.status)
          setSession(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(pointsSub)
      supabase.removeChannel(cardsSub)
      supabase.removeChannel(sessionSub)
    }
  }, [sessionId])

  // 4. Sequential Generation Trigger
  useEffect(() => {
    if (status === 'generating' && points.length > 0) {
      // Find points without cards
      const pointsWithoutCards = points.filter(p => !cards.find(c => c.point_id === p.id))
      if (pointsWithoutCards.length > 0) {
        // Start generating for the next one sequentially
        const nextPoint = pointsWithoutCards[0]
        generateCard(nextPoint.id).catch(console.error)
      } else if (cards.length === points.length && points.length > 0) {
        // All done
        supabase.from('sessions').update({ status: 'complete' }).eq('id', sessionId).then(() => setStatus('complete'))
      }
    }
  }, [status, points, cards, sessionId])

  return (
    <div className="processing-view animate-fade-in">
      <div className="status-header glass surface-1">
        <div className="progress-info">
          <p className="caption">{status.toUpperCase()}</p>
          <h2 className="title-2">
            {status === 'complete' ? 'Cards Complete' : `Generating ${cards.length} of ${points.length || '?'} cards`}
          </h2>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar accent" 
            style={{ width: `${(cards.length / (points.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="content-grid">
        <section className="points-list">
          <h3 className="subhead">Extracted Points</h3>
          <div className="points-container no-scrollbar">
            {points.map((point, i) => (
              <div key={point.id} className="point-item animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="point-bullet">•</span>
                <p className="body">{point.text}</p>
              </div>
            ))}
            {status === 'processing' && <div className="point-skeleton shimmer surface-1" />}
          </div>
        </section>

        <section className="cards-grid">
          <h3 className="subhead">Generated Cards</h3>
          <div className="grid-container">
            {cards.map((card) => (
              <div key={card.id} className="card-item surface-1 glass animate-fade-in">
                {card.status === 'complete' ? (
                  <img src={supabase.storage.from('cards').getPublicUrl(card.image_url).data.publicUrl} alt={card.title} />
                ) : (
                  <div className="card-skeleton shimmer" />
                )}
                <div className="card-title-bar glass">{card.title}</div>
              </div>
            ))}
            {status === 'generating' && cards.length < points.length && (
              <div className="card-item surface-1 glass shimmer" />
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .processing-view {
          display: flex;
          flex-direction: column;
          gap: var(--space-40);
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .status-header {
          padding: var(--space-24);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-16);
        }
        
        .progress-bar-container {
          height: 4px;
          background-color: var(--surface-2);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        
        .progress-bar {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s var(--ease-apple);
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: var(--space-40);
        }
        
        .points-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-16);
          margin-top: var(--space-16);
        }
        
        .point-item {
          display: flex;
          gap: var(--space-12);
        }
        
        .point-bullet {
          color: var(--accent);
        }
        
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-20);
          margin-top: var(--space-16);
        }
        
        .card-item {
          aspect-ratio: 4/5;
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
        }
        
        .card-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .card-skeleton {
          width: 100%;
          height: 100%;
          background-color: var(--surface-1);
        }
        
        .shimmer {
          background: linear-gradient(90deg, var(--surface-1) 25%, var(--surface-2) 50%, var(--surface-1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
        
        .card-title-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-12);
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 767px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
