'use client'

import Image from 'next/image'
import {
  CheckCircle2,
  ChevronDown,
  CornerDownLeft,
  Flag,
  Loader2,
  MessageCirclePlus,
  ShieldAlert,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition, type FormEvent } from 'react'

import {
  createClarification,
  deleteClarificationItem,
  replyToClarification,
  reportClarificationItem,
  resolveClarification,
} from '@/app/actions/clarifications'
import { useFeedback } from '@/components/providers/FeedbackProvider'
import AdaptiveSheet from '@/components/ui/AdaptiveSheet'
import type { CardClarificationListResult, CardClarificationThreadView, ClarificationKind } from '@/lib/types'

import styles from './CardClarifications.module.css'

type CardClarificationsProps = {
  cardId: string
  data: CardClarificationListResult
}

type ComposerState =
  | {
      mode: 'create'
      kind: ClarificationKind
    }
  | {
      mode: 'reply'
      threadId: string
    }

const KIND_LABELS: Record<ClarificationKind, string> = {
  question: 'Question',
  clarification: 'Clarification',
  correction: 'Correction',
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

function getInitial(value: string | null) {
  return value?.trim().slice(0, 1).toUpperCase() || 'C'
}

function ClarificationAvatar({
  name,
  avatarUrl,
}: {
  name: string | null
  avatarUrl: string | null
}) {
  return (
    <div className={styles.avatar} aria-hidden="true">
      {avatarUrl ? (
        <Image src={avatarUrl} alt="" fill sizes="36px" />
      ) : (
        <span>{getInitial(name)}</span>
      )}
    </div>
  )
}

function ClarificationThread({
  thread,
  disabled,
  onReply,
  onResolve,
  onDelete,
  onReport,
}: {
  thread: CardClarificationThreadView
  disabled: boolean
  onReply: (threadId: string) => void
  onResolve: (threadId: string) => void
  onDelete: (itemId: string) => void
  onReport: (itemId: string) => void
}) {
  const root = thread.root

  if (!root) {
    return null
  }

  return (
    <article className={styles.thread}>
      <div className={styles.threadRow}>
        <ClarificationAvatar name={root.author_name} avatarUrl={root.author_avatar_url} />
        <div className={styles.threadBody}>
          <div className={styles.threadMeta}>
            <span className={styles.threadAuthor}>{root.author_name || 'Capsule learner'}</span>
            <span className={styles.kindChip}>{KIND_LABELS[thread.kind]}</span>
            {root.author_is_card_owner ? <span className={styles.ownerChip}>Author</span> : null}
            {thread.status === 'resolved' ? (
              <span className={styles.resolvedChip}>
                <CheckCircle2 size={12} aria-hidden="true" />
                <span>Resolved</span>
              </span>
            ) : null}
            <time className={styles.threadTime} dateTime={root.created_at}>
              {formatRelativeTime(root.created_at)}
            </time>
          </div>

          <p className={styles.threadCopy}>{root.body}</p>

          <div className={styles.actionRow}>
            {thread.can_reply ? (
              <button type="button" className={styles.actionButton} onClick={() => onReply(thread.id)} disabled={disabled}>
                <CornerDownLeft size={14} aria-hidden="true" />
                <span>Reply</span>
              </button>
            ) : null}

            {thread.can_resolve ? (
              <button type="button" className={styles.actionButton} onClick={() => onResolve(thread.id)} disabled={disabled}>
                <CheckCircle2 size={14} aria-hidden="true" />
                <span>Resolve</span>
              </button>
            ) : null}

            {root.can_delete ? (
              <button type="button" className={styles.actionButton} onClick={() => onDelete(root.id)} disabled={disabled}>
                <Trash2 size={14} aria-hidden="true" />
                <span>Delete</span>
              </button>
            ) : null}

            {root.can_report ? (
              <button type="button" className={styles.actionButton} onClick={() => onReport(root.id)} disabled={disabled}>
                <Flag size={14} aria-hidden="true" />
                <span>{root.has_reported ? 'Flagged' : 'Flag'}</span>
              </button>
            ) : null}
          </div>

          {thread.replies.length > 0 ? (
            <div className={styles.replyList}>
              {thread.replies.map((reply) => (
                <div key={reply.id} className={styles.replyRow}>
                  <ClarificationAvatar name={reply.author_name} avatarUrl={reply.author_avatar_url} />
                  <div className={styles.replyBody}>
                    <div className={styles.replyMeta}>
                      <span className={styles.threadAuthor}>{reply.author_name || 'Capsule learner'}</span>
                      {reply.author_is_card_owner ? <span className={styles.ownerChip}>Author</span> : null}
                      <time className={styles.threadTime} dateTime={reply.created_at}>
                        {formatRelativeTime(reply.created_at)}
                      </time>
                    </div>
                    <p className={styles.replyCopy}>{reply.body}</p>
                    <div className={styles.actionRow}>
                      {reply.can_delete ? (
                        <button type="button" className={styles.actionButton} onClick={() => onDelete(reply.id)} disabled={disabled}>
                          <Trash2 size={14} aria-hidden="true" />
                          <span>Delete</span>
                        </button>
                      ) : null}
                      {reply.can_report ? (
                        <button type="button" className={styles.actionButton} onClick={() => onReport(reply.id)} disabled={disabled}>
                          <Flag size={14} aria-hidden="true" />
                          <span>{reply.has_reported ? 'Flagged' : 'Flag'}</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function CardClarifications({ cardId, data }: CardClarificationsProps) {
  const router = useRouter()
  const { showFeedback } = useFeedback()
  const [composerState, setComposerState] = useState<ComposerState | null>(null)
  const [body, setBody] = useState('')
  const [resolvedOpen, setResolvedOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const openThreads = useMemo(
    () => data.threads.filter((thread) => thread.status === 'open'),
    [data.threads],
  )
  const resolvedThreads = useMemo(
    () => data.threads.filter((thread) => thread.status === 'resolved'),
    [data.threads],
  )
  const activeCreateKind = composerState?.mode === 'create' ? composerState.kind : 'question'
  const composerTitle = composerState?.mode === 'reply' ? 'Reply' : 'Clarify'

  function closeComposer() {
    if (isPending) return
    setComposerState(null)
    setBody('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!composerState) {
      return
    }

    startTransition(async () => {
      try {
        if (composerState.mode === 'reply') {
          await replyToClarification(composerState.threadId, body)
          showFeedback({
            tone: 'success',
            title: 'Reply added',
            message: 'Now live on this card.',
          })
        } else {
          await createClarification(cardId, activeCreateKind, body)
          showFeedback({
            tone: 'success',
            title: 'Clarification posted',
            message: 'Now live on this card.',
          })
        }

        setComposerState(null)
        setBody('')
        router.refresh()
      } catch (error) {
        showFeedback({
          tone: 'error',
          title: composerState.mode === 'reply' ? 'Could not add reply' : 'Could not post clarification',
          message: error instanceof Error ? error.message : 'Try again in a moment.',
        })
      }
    })
  }

  function handleResolve(threadId: string) {
    startTransition(async () => {
      try {
        await resolveClarification(threadId)
        showFeedback({
          tone: 'success',
          title: 'Marked resolved',
          message: 'Moved out of open.',
        })
        router.refresh()
      } catch (error) {
        showFeedback({
          tone: 'error',
          title: 'Could not resolve',
          message: error instanceof Error ? error.message : 'Try again in a moment.',
        })
      }
    })
  }

  function handleDelete(itemId: string) {
    startTransition(async () => {
      try {
        await deleteClarificationItem(itemId)
        showFeedback({
          tone: 'success',
          title: 'Removed',
          message: 'Removed from this card.',
        })
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

  function handleReport(itemId: string) {
    startTransition(async () => {
      try {
        await reportClarificationItem(itemId)
        showFeedback({
          tone: 'success',
          title: 'Flag sent',
          message: 'Flag received.',
        })
        router.refresh()
      } catch (error) {
        showFeedback({
          tone: 'error',
          title: 'Could not send report',
          message: error instanceof Error ? error.message : 'Try again in a moment.',
        })
      }
    })
  }

  return (
    <section className={styles.section}>
      <div className={styles.summary}>
        <div className={styles.summaryCopy}>
          <p className={styles.eyebrow}>Card clarifications</p>
          <h2 className={styles.title}>Clarify</h2>
          <p className={styles.copy}>Questions, fixes, context.</p>
        </div>

        {data.supported ? (
          <button
            type="button"
            className={styles.primaryAction}
            onClick={() => setComposerState({ mode: 'create', kind: 'question' })}
            disabled={isPending}
          >
            <MessageCirclePlus size={16} aria-hidden="true" />
            <span>Clarify</span>
          </button>
        ) : null}
      </div>

      <div className={styles.summaryMeta}>
        <div className={styles.summaryStat}>
          <span className={styles.summaryValue}>{data.open_count}</span>
          <span className={styles.summaryLabel}>Open</span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryValue}>{data.resolved_count}</span>
          <span className={styles.summaryLabel}>Resolved</span>
        </div>
      </div>

      {!data.supported ? (
        <div className={styles.empty}>
          <ShieldAlert size={16} aria-hidden="true" />
          <span>Not available yet.</span>
        </div>
      ) : openThreads.length === 0 && resolvedThreads.length === 0 ? (
        <div className={styles.empty}>
          <MessageCirclePlus size={16} aria-hidden="true" />
          <span>No clarifications yet.</span>
        </div>
      ) : (
        <div className={styles.stack}>
          {openThreads.map((thread) => (
            <ClarificationThread
              key={thread.id}
              thread={thread}
              disabled={isPending}
              onReply={(threadId) => {
                setComposerState({ mode: 'reply', threadId })
                setBody('')
              }}
              onResolve={handleResolve}
              onDelete={handleDelete}
              onReport={handleReport}
            />
          ))}

          {resolvedThreads.length > 0 ? (
            <div className={styles.resolvedBlock}>
              <button
                type="button"
                className={styles.resolvedToggle}
                onClick={() => setResolvedOpen((current) => !current)}
                aria-expanded={resolvedOpen ? 'true' : 'false'}
              >
                <span>Resolved</span>
                <span className={styles.resolvedCount}>{resolvedThreads.length}</span>
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`${styles.chevron} ${resolvedOpen ? styles.chevronOpen : ''}`}
                />
              </button>

              {resolvedOpen ? (
                <div className={styles.stack}>
                  {resolvedThreads.map((thread) => (
                    <ClarificationThread
                      key={thread.id}
                      thread={thread}
                      disabled={isPending}
                      onReply={(threadId) => {
                        setComposerState({ mode: 'reply', threadId })
                        setBody('')
                      }}
                      onResolve={handleResolve}
                      onDelete={handleDelete}
                      onReport={handleReport}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      <AdaptiveSheet
        open={composerState !== null}
        onClose={closeComposer}
        title={composerTitle}
        description={composerState?.mode === 'reply' ? 'Reply here.' : 'Add a question, clarification, or correction.'}
        size="compact"
        footer={
          <div className={styles.sheetFooter}>
            <button type="button" className={styles.sheetButton} onClick={closeComposer} disabled={isPending}>
              Cancel
            </button>
            <button type="submit" form="clarification-form" className={styles.sheetPrimary} disabled={isPending}>
              {isPending ? 'Posting...' : composerState?.mode === 'reply' ? 'Reply' : 'Post'}
            </button>
          </div>
        }
      >
        <form id="clarification-form" className={styles.sheetForm} onSubmit={handleSubmit}>
          {composerState?.mode === 'create' ? (
            <div className={styles.kindRow}>
              {(['question', 'clarification', 'correction'] as ClarificationKind[]).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className={`${styles.kindButton} ${activeCreateKind === kind ? styles.kindButtonActive : ''}`}
                  onClick={() => setComposerState({ mode: 'create', kind })}
                  disabled={isPending}
                >
                  {KIND_LABELS[kind]}
                </button>
              ))}
            </div>
          ) : null}

          <label className={styles.textareaWrap}>
            <span className={styles.textareaLabel}>
              {composerState?.mode === 'reply' ? 'Reply' : KIND_LABELS[activeCreateKind]}
            </span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className={styles.textarea}
              rows={5}
              maxLength={1200}
              disabled={isPending}
              placeholder={
                composerState?.mode === 'reply'
                  ? 'Add a short reply.'
                  : activeCreateKind === 'correction'
                    ? 'Point out what should change.'
                    : activeCreateKind === 'clarification'
                      ? 'Add the missing context.'
                      : 'Ask what needs clarifying.'
              }
            />
          </label>
          <div className={styles.counter}>{body.trim().length}/1200</div>
        </form>
      </AdaptiveSheet>

      {isPending ? (
        <div className={styles.pending} aria-live="polite">
          <Loader2 size={14} className={styles.spinner} aria-hidden="true" />
          <span>Updating clarifications…</span>
        </div>
      ) : null}
    </section>
  )
}
