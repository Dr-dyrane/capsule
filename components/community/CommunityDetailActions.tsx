'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Bookmark, Flag, Heart, Loader2, Repeat2 } from 'lucide-react'

import { reportCommunityCard, toggleCommunityReaction } from '@/app/actions/community'
import styles from './CommunityDetailActions.module.css'

type CommunityDetailActionsProps = {
  cardId: string
  remixHref: string
  initialLiked: boolean
  initialSaved: boolean
  initialReported: boolean
  initialLikeCount: number
  initialSaveCount: number
}

export default function CommunityDetailActions({
  cardId,
  remixHref,
  initialLiked,
  initialSaved,
  initialReported,
  initialLikeCount,
  initialSaveCount,
}: CommunityDetailActionsProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [saved, setSaved] = useState(initialSaved)
  const [reported, setReported] = useState(initialReported)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [saveCount, setSaveCount] = useState(initialSaveCount)
  const [isPending, startTransition] = useTransition()

  function handleToggle(kind: 'like' | 'save') {
    const isLike = kind === 'like'
    const previous = isLike ? liked : saved
    const next = !previous

    if (isLike) {
      setLiked(next)
      setLikeCount((current) => Math.max(0, current + (next ? 1 : -1)))
    } else {
      setSaved(next)
      setSaveCount((current) => Math.max(0, current + (next ? 1 : -1)))
    }

    startTransition(async () => {
      try {
        await toggleCommunityReaction(cardId, kind)
      } catch {
        if (isLike) {
          setLiked(previous)
          setLikeCount((current) => Math.max(0, current + (next ? -1 : 1)))
        } else {
          setSaved(previous)
          setSaveCount((current) => Math.max(0, current + (next ? -1 : 1)))
        }
      }
    })
  }

  function handleReport() {
    if (reported) return

    setReported(true)

    startTransition(async () => {
      try {
        await reportCommunityCard(cardId)
      } catch {
        setReported(false)
      }
    })
  }

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={`${styles.actionChip} ${liked ? styles.activeChip : ''}`}
        onClick={() => handleToggle('like')}
        disabled={isPending}
      >
        {isPending ? <Loader2 size={14} className={styles.spinner} /> : <Heart size={14} />}
        <span>{likeCount}</span>
      </button>

      <button
        type="button"
        className={`${styles.actionChip} ${saved ? styles.activeChip : ''}`}
        onClick={() => handleToggle('save')}
        disabled={isPending}
      >
        {isPending ? <Loader2 size={14} className={styles.spinner} /> : <Bookmark size={14} />}
        <span>{saveCount}</span>
      </button>

      <Link href={remixHref} className={styles.remixChip}>
        <Repeat2 size={14} />
        <span>Remix</span>
      </Link>

      <button
        type="button"
        className={`${styles.actionChip} ${reported ? styles.reportedChip : ''}`}
        onClick={handleReport}
        disabled={reported || isPending}
      >
        <Flag size={14} />
        <span>{reported ? 'Reported' : 'Report'}</span>
      </button>
    </div>
  )
}
