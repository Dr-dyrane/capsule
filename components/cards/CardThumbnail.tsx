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
      <div className="card-info glass">
        <p className="card-title">{card.title || 'Untitled'}</p>
      </div>

      <style jsx>{`
        .card-thumbnail {
          display: block;
          aspect-ratio: 4/5;
          border-radius: var(--radius-md);
          overflow: hidden;
          position: relative;
          transition: transform var(--duration-micro) var(--ease-apple),
                      box-shadow var(--duration-micro) var(--ease-standard);
        }
        
        .card-thumbnail:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-lg);
        }
        
        .card-thumbnail:active {
          transform: scale(0.98);
        }
        
        .image-container {
          width: 100%;
          height: 100%;
        }
        
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .card-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-12) var(--space-16);
          background: rgba(0, 0, 0, 0.4);
        }
        
        .card-title {
          font-size: 13px;
          font-weight: 600;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </Link>
  )
}
