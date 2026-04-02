import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Share, MoreHorizontal } from 'lucide-react'
import { createSignedObjectUrlSafe } from '@/lib/storage/signed-urls'

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

  const signedUrl = await createSignedObjectUrlSafe('cards', card.image_url)

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
            {signedUrl ? (
              <Image src={signedUrl} alt={card.title} fill unoptimized sizes="100vw" />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--text-secondary)',
                  background: 'var(--surface-2)',
                }}
              >
                Preview unavailable
              </div>
            )}
          </div>
          <div className="card-content">
            <div className="card-meta">
              <span className="category-chip">{card.points.category}</span>
              <span className="date-hint">{new Date(card.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="title-1">{card.title}</h1>
            <p className="body point-text">{card.points.text}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
