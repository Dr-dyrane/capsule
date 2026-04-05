'use client'

import { useState, useTransition } from 'react'
import { Bookmark, Flag, Heart } from 'lucide-react'

import {
  reportCommunityLibrary,
  toggleCommunityLibraryReaction,
} from '@/app/actions/community'
import { useFeedback } from '@/components/providers/FeedbackProvider'
import ShareLinkButton from '@/components/ui/ShareLinkButton'
import styles from './CommunityLibraryActions.module.css'

type CommunityLibraryActionsProps = {
  sessionId: string
  shareUrl: string
  shareTitle?: string | null
  initialLiked: boolean
  initialSaved: boolean
  initialReported: boolean
  initialLikeCount: number
  initialSaveCount: number
  compact?: boolean
}

export default function CommunityLibraryActions({
  sessionId,
  shareUrl,
  shareTitle = null,
  initialLiked,
  initialSaved,
  initialReported,
  initialLikeCount,
  initialSaveCount,
  compact = false,
}: CommunityLibraryActionsProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [saved, setSaved] = useState(initialSaved)
  const [reported, setReported] = useState(initialReported)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [saveCount, setSaveCount] = useState(initialSaveCount)
  const [isPending, startTransition] = useTransition()
  const { showFeedback } = useFeedback()

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
        await toggleCommunityLibraryReaction(sessionId, kind)
      } catch {
        if (isLike) {
          setLiked(previous)
          setLikeCount((current) => Math.max(0, current + (next ? -1 : 1)))
        } else {
          setSaved(previous)
          setSaveCount((current) => Math.max(0, current + (next ? -1 : 1)))
        }

        showFeedback({
          tone: 'error',
          title: isLike ? 'Could not update like' : 'Could not update saved libraries',
          message: 'Try again in a moment.',
        })
      }
    })
  }

  function handleReport() {
    if (reported) return

    setReported(true)

    startTransition(async () => {
      try {
        await reportCommunityLibrary(sessionId)
        showFeedback({
          tone: 'success',
          title: 'Report sent',
          message: 'Thanks for flagging this library.',
        })
      } catch {
        setReported(false)
        showFeedback({
          tone: 'error',
          title: 'Could not send report',
          message: 'Try again in a moment.',
        })
      }
    })
  }

  return (
    <div className={`${styles.actions} ${compact ? styles.compact : ''}`}>
      <button
        type="button"
        className={`${styles.actionChip} ${liked ? styles.activeChip : ''}`}
        onClick={() => handleToggle('like')}
        disabled={isPending}
      >
        <Heart size={14} />
        <span>{likeCount}</span>
      </button>

      <button
        type="button"
        className={`${styles.actionChip} ${saved ? styles.activeChip : ''}`}
        onClick={() => handleToggle('save')}
        disabled={isPending}
      >
        <Bookmark size={14} />
        <span>{saveCount}</span>
      </button>

      <ShareLinkButton
        url={shareUrl}
        title={shareTitle ?? undefined}
        label="Share"
        className={`${styles.actionChip} ${styles.secondaryAction}`}
      />

      <button
        type="button"
        className={`${styles.actionChip} ${styles.secondaryAction} ${reported ? styles.reportedChip : ''}`}
        onClick={handleReport}
        disabled={reported || isPending}
      >
        <Flag size={14} />
        <span>{reported ? 'Reported' : 'Report'}</span>
      </button>
    </div>
  )
}
