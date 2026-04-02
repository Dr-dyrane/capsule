'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function CardThumbnail({ card }: { card: any }) {
  const supabase = createClient()
  const publicUrl = supabase.storage.from('cards').getPublicUrl(card.image_url).data.publicUrl

  return (
    <Link href={`/cards/${card.id}`} className="card-thumbnail surface-1 glass animate-fade-in">
      <div className="image-container">
        <img src={publicUrl} alt={card.title} loading="lazy" />
      </div>
      <div className="card-info">
        <p className="card-title">{card.title || 'Untitled'}</p>
      </div>
    </Link>
  )
}
