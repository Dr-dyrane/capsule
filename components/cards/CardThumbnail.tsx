'use client'

import Link from 'next/link'
import Image from 'next/image'

import type { CardRecord } from '@/lib/types'
import styles from './CardThumbnail.module.css'

export default function CardThumbnail({ card, imageUrl }: { card: CardRecord; imageUrl?: string }) {
  const statusLabel =
    card.status === 'complete'
      ? 'Ready'
      : card.status === 'generating'
        ? 'Generating'
        : card.status === 'error'
          ? 'Error'
          : 'Queued'

  const hint =
    card.status === 'complete'
      ? 'Quick-scan learning card'
      : card.status === 'generating'
        ? 'Image in progress'
        : card.status === 'error'
          ? 'Needs retry'
          : 'Waiting to start'

  return (
    <Link href={`/cards/${card.id}`} className={styles.root}>
      <div className={styles.imageWrap}>
        <div className={styles.status}>{statusLabel}</div>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={card.title || 'Generated card'}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>Preview unavailable</div>
        )}
      </div>
      <div className={styles.meta}>
        <p className={styles.title}>{card.title || 'Untitled'}</p>
        <p className={styles.hint}>{hint}</p>
      </div>
    </Link>
  )
}
