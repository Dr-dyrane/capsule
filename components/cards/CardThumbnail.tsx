'use client'

import Link from 'next/link'
import Image from 'next/image'

import type { CardRecord } from '@/lib/types'
import styles from './CardThumbnail.module.css'

export default function CardThumbnail({ card, imageUrl }: { card: CardRecord; imageUrl: string }) {
  return (
    <Link href={`/cards/${card.id}`} className={styles.root}>
      <div className={styles.imageWrap}>
        <Image
          src={imageUrl}
          alt={card.title || 'Generated card'}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>
      <div className={styles.meta}>
        <p className={styles.title}>{card.title || 'Untitled'}</p>
        <p className={styles.hint}>Quick-scan learning card</p>
      </div>
    </Link>
  )
}
