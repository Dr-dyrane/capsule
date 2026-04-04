'use client'

import Image from 'next/image'
import { Flag, Loader2, ShieldCheck, ShieldX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import {
  clearClarificationReports,
  removeClarificationItemAsCreator,
} from '@/app/actions/clarifications'
import { useFeedback } from '@/components/providers/FeedbackProvider'
import AdaptiveSheet from '@/components/ui/AdaptiveSheet'
import PendingLink from '@/components/ui/PendingLink'
import type { CardClarificationModerationItem } from '@/lib/types'

import styles from './ClarificationModerationList.module.css'

type ClarificationModerationListProps = {
  items: CardClarificationModerationItem[]
}

function formatRelativeTime(value: string) {
  const date = new Date(value)
  const deltaSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absSeconds = Math.abs(deltaSeconds)

  if (absSeconds < 60) {
    return 'now'
  }

  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

  if (absSeconds < 3600) {
    return rtf.format(Math.round(deltaSeconds / 60), 'minute')
  }

  if (absSeconds < 86400) {
    return rtf.format(Math.round(deltaSeconds / 3600), 'hour')
  }

  if (absSeconds < 604800) {
    return rtf.format(Math.round(deltaSeconds / 86400), 'day')
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

function getInitial(name: string | null) {
  return name?.trim().slice(0, 1).toUpperCase() || 'C'
}

const KIND_LABEL = {
  question: 'Question',
  clarification: 'Clarification',
  correction: 'Correction',
} as const

export default function ClarificationModerationList({ items }: ClarificationModerationListProps) {
  const router = useRouter()
  const { showFeedback } = useFeedback()
  const [isPending, startTransition] = useTransition()
  const [removingItem, setRemovingItem] = useState<CardClarificationModerationItem | null>(null)

  function handleKeep(itemId: string) {
    startTransition(async () => {
      try {
        await clearClarificationReports(itemId)
        showFeedback({
          tone: 'success',
          title: 'Reports cleared',
          message: 'The clarification stays live on the card.',
        })
        router.refresh()
      } catch (error) {
        showFeedback({
          tone: 'error',
          title: 'Could not clear reports',
          message: error instanceof Error ? error.message : 'Try again in a moment.',
        })
      }
    })
  }

  function handleRemove() {
    if (!removingItem) {
      return
    }

    startTransition(async () => {
      try {
        await removeClarificationItemAsCreator(removingItem.item_id)
        showFeedback({
          tone: 'success',
          title: 'Clarification removed',
          message: 'It is no longer visible on the card.',
        })
        setRemovingItem(null)
        router.refresh()
      } catch (error) {
        showFeedback({
          tone: 'error',
          title: 'Could not remove clarification',
          message: error instanceof Error ? error.message : 'Try again in a moment.',
        })
      }
    })
  }

  return (
    <>
      <div className={styles.list}>
        {items.map((item) => (
          <article key={item.item_id} className={styles.item}>
            <div className={styles.head}>
              <div className={styles.identity}>
                <div className={styles.avatar} aria-hidden="true">
                  {item.author_avatar_url ? (
                    <Image src={item.author_avatar_url} alt="" fill sizes="36px" />
                  ) : (
                    <span className={styles.initial}>{getInitial(item.author_name)}</span>
                  )}
                </div>

                <div className={styles.meta}>
                  <div className={styles.metaRow}>
                    <span className={styles.author}>{item.author_name || 'Capsule learner'}</span>
                    <span className={styles.kind}>{KIND_LABEL[item.thread_kind]}</span>
                    {item.parent_item_id ? <span className={styles.reply}>Reply</span> : null}
                  </div>
                  <div className={styles.submeta}>
                    <span>{item.card_title || 'Untitled card'}</span>
                    <span aria-hidden="true">&middot;</span>
                    <time dateTime={item.item_created_at}>{formatRelativeTime(item.item_created_at)}</time>
                  </div>
                </div>
              </div>

              <div className={styles.reportCount}>
                <Flag size={14} aria-hidden="true" />
                <span>{item.report_count}</span>
              </div>
            </div>

            <p className={styles.body}>{item.item_body}</p>

            <div className={styles.actions}>
              <PendingLink href={`/community/${item.card_id}`} className={styles.linkAction}>
                Open card
              </PendingLink>
              <button
                type="button"
                className={styles.keepAction}
                onClick={() => handleKeep(item.item_id)}
                disabled={isPending}
              >
                {isPending ? <Loader2 size={14} className={styles.spinner} /> : <ShieldCheck size={14} aria-hidden="true" />}
                <span>Keep live</span>
              </button>
              <button
                type="button"
                className={styles.removeAction}
                onClick={() => setRemovingItem(item)}
                disabled={isPending}
              >
                <ShieldX size={14} aria-hidden="true" />
                <span>Remove item</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <AdaptiveSheet
        open={removingItem !== null}
        onClose={() => {
          if (!isPending) {
            setRemovingItem(null)
          }
        }}
        title="Remove reported clarification?"
        description="This takes the clarification off the card and clears the current reports."
        size="compact"
        footer={
          <div className={styles.sheetFooter}>
            <button
              type="button"
              className={styles.sheetButton}
              onClick={() => setRemovingItem(null)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button type="button" className={styles.sheetPrimary} onClick={handleRemove} disabled={isPending}>
              {isPending ? 'Removing...' : 'Remove item'}
            </button>
          </div>
        }
      >
        {removingItem ? (
          <div className={styles.sheetBody}>
            <p className={styles.sheetLead}>
              {removingItem.parent_item_id ? 'This reply will disappear from the thread.' : 'This thread entry will disappear from the card.'}
            </p>
            <p className={styles.sheetCopy}>{removingItem.item_body}</p>
          </div>
        ) : null}
      </AdaptiveSheet>
    </>
  )
}
