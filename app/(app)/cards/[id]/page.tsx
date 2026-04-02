import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Share, MoreHorizontal } from 'lucide-react'

export default async function CardDetailPage({ params }: { params: { id: string } }) {
  const id = (await params).id
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('cards')
    .select('*, points(text, category)')
    .eq('id', id)
    .single()

  if (error || !card) {
    redirect('/cards')
  }

  const publicUrl = supabase.storage.from('cards').getPublicUrl(card.image_url).data.publicUrl

  return (
    <div className="detail-page animate-fade-in">
      <nav className="detail-nav glass">
        <Link href="/cards" className="nav-btn">
          <ChevronLeft size={24} />
        </Link>
        <div className="nav-actions">
          <button className="nav-btn"><Share size={20} /></button>
          <button className="nav-btn"><MoreHorizontal size={20} /></button>
        </div>
      </nav>

      <div className="card-container">
        <div className="card-main surface-1 glass animate-slide-up">
          <div className="card-image-wrap">
            <img src={publicUrl} alt={card.title} />
          </div>
          <div className="card-content">
            <div className="card-meta">
              <span className="category-chip accent">{card.points.category}</span>
              <span className="date-hint">{new Date(card.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="title-1">{card.title}</h1>
            <p className="body point-text">{card.points.text}</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-page {
          min-height: 100vh;
          background-color: var(--canvas);
          position: relative;
        }
        
        .detail-nav {
          position: sticky;
          top: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-12) var(--space-16);
          z-index: 100;
        }
        
        .nav-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--text-primary);
          transition: background-color var(--duration-micro) var(--ease-standard);
        }
        
        .nav-btn:hover {
          background-color: var(--surface-1);
        }
        
        .nav-actions {
          display: flex;
          gap: var(--space-8);
        }
        
        .card-container {
          padding: var(--space-16);
          max-width: 800px;
          margin: 0 auto;
        }
        
        .card-main {
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        
        .card-image-wrap {
          width: 100%;
          aspect-ratio: 1/1;
          background-color: var(--surface-2);
        }
        
        .card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .card-content {
          padding: var(--space-32);
          display: flex;
          flex-direction: column;
          gap: var(--space-16);
        }
        
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .category-chip {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          background-color: var(--surface-2);
          color: var(--accent);
        }
        
        .date-hint {
          font-size: 12px;
          color: var(--text-tertiary);
        }
        
        .point-text {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 767px) {
          .card-content {
            padding: var(--space-24);
          }
        }
      `}</style>
    </div>
  )
}
