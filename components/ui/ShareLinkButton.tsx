'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'

import { useFeedback } from '@/components/providers/FeedbackProvider'

type ShareLinkButtonProps = {
  url: string
  title?: string
  text?: string
  label?: string
  className: string
}

export default function ShareLinkButton({
  url,
  title,
  text,
  label = 'Share',
  className,
}: ShareLinkButtonProps) {
  const [isSharing, setIsSharing] = useState(false)
  const { showFeedback } = useFeedback()

  async function handleShare() {
    if (isSharing) {
      return
    }

    setIsSharing(true)

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            url,
            title,
            text,
          })

          return
        } catch (error) {
          const name = error instanceof Error ? error.name : ''

          if (name === 'AbortError') {
            return
          }
        }
      }

      await navigator.clipboard.writeText(url)
      showFeedback({
        tone: 'success',
        title: 'Link copied',
        message: 'Share it anywhere.',
      })
    } catch {
      showFeedback({
        tone: 'error',
        title: 'Could not share',
        message: 'Try again in a moment.',
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <button type="button" className={className} onClick={handleShare} disabled={isSharing}>
      <Share2 size={14} aria-hidden="true" />
      <span>{isSharing ? 'Sharing...' : label}</span>
    </button>
  )
}
