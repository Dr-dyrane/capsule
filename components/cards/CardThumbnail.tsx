'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Edit3, Loader2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { deleteCard } from '@/app/actions/card-actions'
import type { CardRecord } from '@/lib/types'
import styles from './CardThumbnail.module.css'

export default function CardThumbnail({ 
  card, 
  imageUrl,
  onEdit,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}: { 
  card: CardRecord; 
  imageUrl?: string;
  onEdit?: (card: CardRecord) => void;
  selectionMode?: boolean
  selected?: boolean
  onToggleSelect?: (cardId: string) => void
}) {
  const [isDeleting, startDeleteTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  const statusLabel =
    card.status === 'complete'
      ? 'Ready'
      : card.status === 'generating'
        ? 'Generating'
        : card.status === 'error'
          ? 'Error'
          : 'Queued'

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    startDeleteTransition(async () => {
      try {
        await deleteCard(card.id)
      } catch (err) {
        console.error('Delete failed:', err)
        setShowConfirm(false)
      }
    })
  }

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onEdit?.(card)
  }

  function handleToggleSelect(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onToggleSelect?.(card.id)
  }

  return (
    <div className={`${styles.root} ${selectionMode ? styles.selectionMode : ''} ${selected ? styles.selected : ''}`}>
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
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className={styles.actionsOverlay}
              >
                <div className={styles.actionGroup}>
                  <button 
                    className={styles.actionBtn} 
                    onClick={handleEdit}
                    title="Edit title"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${showConfirm ? styles.confirmDelete : ''}`} 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    title={showConfirm ? "Confirm Delete" : "Delete card"}
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className={styles.spinner} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
                {showConfirm && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.confirmTip}
                  >
                    Click again to confirm
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {imageUrl ? (
            <div className={styles.imageFrame}>
              <Image
                src={imageUrl}
                alt={card.title || 'Generated card'}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
