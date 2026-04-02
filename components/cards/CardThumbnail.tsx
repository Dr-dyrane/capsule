'use client'

import Link from 'next/link'
import Image from 'next/image'

import type { CardRecord } from '@/lib/types'

export default function CardThumbnail({ card, imageUrl }: { card: CardRecord; imageUrl: string }) {
  return (
    <Link href={`/cards/${card.id}`} className="card-thumbnail surface-1 glass animate-fade-in">
      <div className="image-container">
        <Image
          src={imageUrl}
          alt={card.title || 'Generated card'}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="card-info">
        <p className="card-title">{card.title || 'Untitled'}</p>
      </div>
    </Link>
  )
}
