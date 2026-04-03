'use client'

import { useState, useTransition } from 'react'
import { Globe, Lock, Loader2 } from 'lucide-react'
import { publishCard, unpublishCard } from '@/app/actions/community'
import styles from './PublishToggle.module.css'

export default function PublishToggle({ 
  cardId, 
  initialVisibility 
}: { 
  cardId: string; 
  initialVisibility: 'private' | 'published' 
}) {
  const [isPending, startTransition] = useTransition()
  const [isPublished, setIsPublished] = useState(initialVisibility === 'published')

  function togglePublish() {
    // Optimistic update
    const nextState = !isPublished
    setIsPublished(nextState)

    startTransition(async () => {
      try {
        if (nextState) {
          await publishCard(cardId)
        } else {
          await unpublishCard(cardId)
        }
      } catch (error) {
        console.error('Failed to update visibility', error)
        // Revert on error
        setIsPublished(!nextState)
      }
    })
  }

  return (
    <button 
      className={`${styles.toggle} ${isPublished ? styles.published : styles.private}`}
      onClick={togglePublish}
      disabled={isPending}
      aria-label={isPublished ? 'Unpublish card' : 'Publish card'}
    >
      {isPending ? (
        <Loader2 size={14} className={styles.spinner} />
      ) : isPublished ? (
        <Globe size={14} />
      ) : (
        <Lock size={14} />
      )}
      <span>{isPublished ? 'Published' : 'Private'}</span>
    </button>
  )
}
