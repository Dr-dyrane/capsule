'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'

import type { CardRecord } from '@/lib/types'
import DeleteActionButton from '@/components/ui/DeleteActionButton'
import StableDbImage from '@/components/ui/StableDbImage'
import styles from './CardThumbnail.module.css'

export default function CardThumbnail({ 
  card, 
  selectionMode = false,
  selected = false,
  onToggleSelect,
}: { 
  card: CardRecord; 
  imageUrl?: string;
  selectionMode?: boolean
  selected?: boolean
  onToggleSelect?: (cardId: string) => void
}) {
  const statusLabel =
    card.status === 'complete'
      ? 'Ready'
      : card.status === 'generating'
        ? 'Generating'
        : card.status === 'error'
          ? 'Error'
          : 'Queued'

  function handleToggleSelect(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onToggleSelect?.(card.id)
  }

  return (
    <div className={`${styles.root} ${selectionMode ? styles.selectionMode : ''} ${selected ? styles.selected : ''}`}>
      {!selectionMode ? (
        <div className={styles.actionSlot}>
          <DeleteActionButton targetId={card.id} targetType="card" iconOnly className={styles.actionButton} />
        </div>
      ) : null}

      <Link
        href={`/cards/${card.id}`}
        className={styles.cardLink}
        onClick={selectionMode ? handleToggleSelect : undefined}
      >
        <div className={styles.imageWrap}>
          <div className={styles.status}>{statusLabel}</div>

          {selectionMode ? (
            <button
              type="button"
              className={`${styles.selectionBadge} ${selected ? styles.selectionBadgeActive : ''}`}
              onClick={handleToggleSelect}
              aria-pressed={selected}
              aria-label={selected ? 'Deselect card' : 'Select card'}
            >
              {selected ? <Check size={14} /> : null}
              <span>{selected ? 'Selected' : 'Select'}</span>
            </button>
          ) : null}

          {card.image_url ? (
            <div className={styles.imageFrame}>
              <StableDbImage
                kind="card"
                id={card.id}
                alt={card.title || 'Generated card'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={68}
                className={styles.image}
              />
            </div>
          ) : (
            <div className={styles.placeholder}>Preview unavailable</div>
          )}
        </div>
        <div className={styles.meta}>
          <p className={styles.title}>{card.title || 'Untitled'}</p>
          <p className={styles.hint}>{card.status === 'complete' ? 'Learning card' : 'In progress'}</p>
        </div>
      </Link>
    </div>
  )
}
