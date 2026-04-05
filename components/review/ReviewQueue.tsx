'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Brain, CheckCircle2, Globe, Sparkles } from 'lucide-react'

import { submitReviewResult } from '@/app/actions/review'
import { useFeedback } from '@/components/providers/FeedbackProvider'
import PendingLink from '@/components/ui/PendingLink'
import { getStudyCue } from '@/lib/review/study-cues'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import type { ReviewQueueItem, ReviewScore } from '@/lib/types'

import styles from './ReviewQueue.module.css'

const WEAK_POINT_RESURFACE_GAP = 2

function normalizeReviewText(value: string | null | undefined) {
  return value?.replace(/\s+/g, ' ').trim().toLowerCase() ?? ''
}

function formatReviewSource(sourceType: ReviewQueueItem['source_type']) {
  return sourceType === 'saved_community' ? 'Saved from community' : 'Your card'
}

function getLeadingSourceStretch(items: ReviewQueueItem[]) {
  const firstItem = items[0]

  if (!firstItem) {
    return []
  }

  const stretch: ReviewQueueItem[] = []

  for (const item of items) {
    if (item.source_type !== firstItem.source_type) {
      break
    }

    stretch.push(item)
  }

  return stretch
}

function summarizeStretchTopics(items: ReviewQueueItem[]) {
  const labels = [...new Set(items.flatMap((item) => [item.category, item.concept]).filter(Boolean))] as string[]
  return labels.slice(0, 2)
}

function summarizeSourceStretch(items: ReviewQueueItem[]) {
  const firstItem = items[0]
  if (!firstItem) {
    return null
  }

  const uniqueSessionLabels = [...new Set(items.map((item) => item.session_label).filter(Boolean))] as string[]
  const topics = summarizeStretchTopics(items)
  const cardsLabel = `${items.length} ${items.length === 1 ? 'card' : 'cards'}`
  const sourceLabel = formatReviewSource(firstItem.source_type)
  const title =
    uniqueSessionLabels.length === 1
      ? uniqueSessionLabels[0]
      : uniqueSessionLabels.length > 1
        ? `${sourceLabel} run`
        : topics[0] ?? sourceLabel

  let description: string

  if (uniqueSessionLabels.length === 1) {
    description =
      firstItem.source_type === 'saved_community'
        ? `${cardsLabel} from this saved library.`
        : `${cardsLabel} from this session.`
  } else if (uniqueSessionLabels.length > 1) {
    description =
      firstItem.source_type === 'saved_community'
        ? `${cardsLabel} across ${uniqueSessionLabels.length} saved libraries.`
        : `${cardsLabel} across ${uniqueSessionLabels.length} sessions.`
  } else {
    description =
      firstItem.source_type === 'saved_community'
        ? `${cardsLabel} from saved community cards.`
        : `${cardsLabel} from your own queue.`
  }

  if (topics.length === 1) {
    description = `${description} Focus: ${topics[0]}.`
  } else if (topics.length > 1) {
    description = `${description} Focus: ${topics[0]} and ${topics[1]}.`
  }

  return {
    title,
    description,
  }
}

function formatPromptTitle(item: ReviewQueueItem, titleLeaksAnswer: boolean) {
  if (!titleLeaksAnswer && item.title) {
    return item.title
  }

  if (item.category) {
    return item.category
  }

  if (item.concept) {
    return item.concept
  }

  return 'Recall this card'
}

function formatPromptText(item: ReviewQueueItem, titleLeaksAnswer: boolean) {
  if (!titleLeaksAnswer) {
    return 'Try to explain the concept in your own words before you reveal the original point.'
  }

  if (item.category) {
    return `Use the illustration to recall the key teaching point tied to ${item.category}.`
  }

  if (item.concept) {
    return `Use the illustration to recall the key teaching point about ${item.concept}.`
  }

  return 'Use the illustration first, then reveal the original wording only after you have tried recall.'
}

function formatImageAlt(item: ReviewQueueItem) {
  if (item.concept && item.category) {
    return `Review illustration for ${item.concept} in ${item.category}`
  }

  if (item.concept) {
    return `Review illustration for ${item.concept}`
  }

  if (item.category) {
    return `Review illustration for ${item.category}`
  }

  return 'Review illustration'
}

export default function ReviewQueue({
  initialItems,
  dueCount,
}: {
  initialItems: ReviewQueueItem[]
  dueCount: number
}) {
  const [items, setItems] = useState(initialItems)
  const [liveDueCount, setLiveDueCount] = useState(dueCount)
  const [revealed, setRevealed] = useState(false)
  const [hideLabels, setHideLabels] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)
  const [againCount, setAgainCount] = useState(0)
  const [activeScore, setActiveScore] = useState<ReviewScore | null>(null)
  const [isPending, startTransition] = useTransition()
  const { showFeedback } = useFeedback()

  const currentItem = items[0] ?? null
  const currentStretch = getLeadingSourceStretch(items)
  const currentStretchSummary = summarizeSourceStretch(currentStretch)
  const nextStretch = items.slice(currentStretch.length)
  const nextStretchSummary = summarizeSourceStretch(getLeadingSourceStretch(nextStretch))
  const totalItems = initialItems.length
  const detailHref = currentItem
    ? currentItem.source_type === 'saved_community'
      ? `/community/${currentItem.card_id}`
      : `/cards/${currentItem.card_id}`
    : '/cards'
  const detailLabel = currentItem?.source_type === 'saved_community' ? 'Open community card' : 'Open card'
  const libraryHref = currentItem?.source_type === 'saved_community' ? '/community?saved=1' : '/library'
  const libraryLabel = currentItem?.source_type === 'saved_community' ? 'Saved cards' : 'Back to library'
  const titleLeaksAnswer =
    currentItem !== null &&
    normalizeReviewText(currentItem.title) !== '' &&
    normalizeReviewText(currentItem.title) === normalizeReviewText(currentItem.point_text)
  const sourceLabel = currentItem ? formatReviewSource(currentItem.source_type) : null
  const nextSourceLabel = nextStretch[0] ? formatReviewSource(nextStretch[0].source_type) : null
  const promptTitle = currentItem ? formatPromptTitle(currentItem, titleLeaksAnswer) : 'Learning card'
  const studyCue = currentItem ? getStudyCue(currentItem) : null
  const promptText = currentItem
    ? studyCue?.promptText ?? formatPromptText(currentItem, titleLeaksAnswer)
    : ''
  const imageAlt = currentItem ? formatImageAlt(currentItem) : 'Review illustration'
  const shouldMaskImage = Boolean(currentItem && hideLabels && !revealed)

  function getResurfacedQueue(queue: ReviewQueueItem[], item: ReviewQueueItem) {
    const remaining = queue.slice(1).filter((candidate) => candidate.review_item_id !== item.review_item_id)
    const insertIndex = Math.min(WEAK_POINT_RESURFACE_GAP, remaining.length)

    return [
      ...remaining.slice(0, insertIndex),
      item,
      ...remaining.slice(insertIndex),
    ]
  }

  function handleScore(score: ReviewScore) {
    if (!currentItem || isPending) {
      return
    }

    const snapshot = items
    const nextCompletedCount = completedCount + 1
    const nextAgainCount = againCount + (score === 'again' ? 1 : 0)
    const wasDue = new Date(currentItem.next_review_at).getTime() <= Date.now()
    const shouldResurface = score === 'again'

    setActiveScore(score)
    setItems((current) => (shouldResurface ? getResurfacedQueue(current, currentItem) : current.slice(1)))
    if (wasDue && !shouldResurface) {
      setLiveDueCount((current) => Math.max(0, current - 1))
    }
    setCompletedCount(nextCompletedCount)
    setAgainCount(nextAgainCount)
    setRevealed(false)

    startTransition(async () => {
      try {
        await submitReviewResult(currentItem.review_item_id, score)
      } catch (error) {
        setItems(snapshot)
        if (wasDue && !shouldResurface) {
          setLiveDueCount((current) => current + 1)
        }
        setCompletedCount(completedCount)
        setAgainCount(againCount)
        setRevealed(true)
        showFeedback({
          tone: 'error',
          title: 'Could not save that review',
          message: error instanceof Error ? error.message : 'Try again in a moment.',
        })
      } finally {
        setActiveScore(null)
      }
    })
  }

  if (!currentItem && completedCount === 0) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Brain size={20} aria-hidden="true" />
        </div>
        <div className={styles.emptyCopy}>
          <h2 className={styles.emptyTitle}>Nothing is due yet.</h2>
          <p className={styles.emptyText}>Saved community cards and finished renders will appear here automatically.</p>
        </div>
        <div className={styles.emptyActions}>
          <PendingLink href="/library" className={styles.primaryLink}>
            Open library
          </PendingLink>
          <PendingLink href="/scan" className={styles.secondaryLink}>
            Scan note
          </PendingLink>
        </div>
      </section>
    )
  }

  if (!currentItem) {
    return (
      <section className={styles.summary}>
        <div className={styles.summaryIcon}>
          <CheckCircle2 size={22} aria-hidden="true" />
        </div>
        <div className={styles.summaryCopy}>
          <h2 className={styles.summaryTitle}>Review complete.</h2>
          <p className={styles.summaryText}>You cleared the current queue. Capsule will bring the hard cards back at the right time.</p>
        </div>
        <div className={styles.summaryStats}>
          <div className={styles.summaryStat}>
            <span className={styles.summaryLabel}>Reviewed</span>
            <span className={styles.summaryValue}>{completedCount}</span>
          </div>
          <div className={styles.summaryStat}>
            <span className={styles.summaryLabel}>Again</span>
            <span className={styles.summaryValue}>{againCount}</span>
          </div>
        </div>
        <div className={styles.emptyActions}>
          <PendingLink href="/library" className={styles.primaryLink}>
            Back to library
          </PendingLink>
          <PendingLink href="/cards" className={styles.secondaryLink}>
            Open cards
          </PendingLink>
        </div>
      </section>
    )
  }

  return (
    <div className={styles.root}>
      <section className={styles.statusPanel}>
        <div className={styles.statusRow}>
          <div>
            <div className={styles.statusEyebrow}>
              <Sparkles size={14} aria-hidden="true" />
              <span>Review queue</span>
            </div>
            <h2 className={styles.statusTitle}>Recall before reading.</h2>
          </div>
          <div className={styles.statusLedger}>
            <div className={styles.statusChip}>Due {liveDueCount}</div>
            <div className={styles.statusChip}>Remaining {items.length}</div>
            <div className={styles.statusChip}>Done {completedCount}</div>
          </div>
        </div>

        <div className={styles.progressRail}>
          <div
            className={styles.progressFill}
            style={{ width: `${totalItems > 0 ? (completedCount / totalItems) * 100 : 0}%` }}
          />
        </div>
      </section>

      <section className={styles.stage}>
          <div className={styles.visualShell}>
          <div className={styles.cardMeta}>
            <div className={styles.cardChip}>{currentItem.note_role ?? 'support'}</div>
            {currentItem.category ? <div className={styles.cardChip}>{currentItem.category}</div> : null}
          </div>

          {currentItem.signed_url ? (
            <div className={styles.imageFrame}>
              <Image
                src={currentItem.signed_url}
                alt={imageAlt}
                fill
                sizes="(max-width: 767px) 100vw, 720px"
                quality={80}
                placeholder="blur"
                blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                className={`${styles.image} ${shouldMaskImage ? styles.imageMasked : ''}`}
              />
              {shouldMaskImage ? (
                <div className={styles.imageMask}>
                  <div className={styles.imageMaskBadge}>Labels hidden</div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className={styles.imageFallback}>Preview unavailable</div>
          )}

          {!revealed ? (
            <div className={styles.visualTools}>
              <button
                type="button"
                className={styles.visualToggle}
                onClick={() => setHideLabels((current) => !current)}
              >
                {hideLabels ? 'Show labels' : 'Hide labels'}
              </button>
              <span className={styles.visualHint}>
                Keep the image as a cue without letting the text give the answer away.
              </span>
            </div>
          ) : null}
        </div>

        <div className={styles.answerShell}>
          <div className={styles.sourceBlock}>
            <div className={styles.sourceHeader}>
              <div className={styles.sourceIcon}>
                {currentItem.source_type === 'saved_community' ? (
                  <Globe size={16} aria-hidden="true" />
                ) : (
                  <Brain size={16} aria-hidden="true" />
                )}
              </div>
              <div className={styles.sourceCopy}>
                <div className={styles.sourceMeta}>
                  <p className={styles.sourceLabel}>Current run</p>
                  {sourceLabel ? <div className={styles.sourceChip}>{sourceLabel}</div> : null}
                </div>
                <h3 className={styles.sourceTitle}>{currentStretchSummary?.title ?? sourceLabel}</h3>
                <p className={styles.sourceText}>{currentStretchSummary?.description ?? ''}</p>
              </div>
            </div>

            {nextStretchSummary && nextSourceLabel ? (
              <div className={styles.sourceHandoff}>
                <span className={styles.sourceHandoffLabel}>After this run</span>
                <span className={styles.sourceHandoffValue}>
                  {`${nextSourceLabel}: ${nextStretchSummary.title}`}
                </span>
              </div>
            ) : null}
          </div>

          <div className={styles.promptBlock}>
            <p className={styles.promptLabel}>Study cue</p>
            <div className={styles.promptMeta}>
              {studyCue ? <div className={styles.promptCue}>{studyCue.label}</div> : null}
              {sourceLabel ? <div className={styles.promptCue}>{sourceLabel}</div> : null}
              {currentItem.concept && currentItem.concept !== promptTitle ? (
                <div className={styles.promptCue}>{currentItem.concept}</div>
              ) : null}
            </div>
            <h3 className={styles.promptTitle}>{promptTitle}</h3>
            <p className={styles.promptText}>{promptText}</p>
          </div>

          {revealed ? (
            <div className={styles.answerBlock}>
              <p className={styles.answerLabel}>Original point</p>
              <p className={styles.answerText}>{currentItem.point_text}</p>
              {currentItem.concept ? <div className={styles.answerTag}>{currentItem.concept}</div> : null}
            </div>
          ) : (
            <div className={styles.coverBlock}>
              <p className={styles.coverTitle}>{studyCue?.coverTitle ?? 'Pause first.'}</p>
              <p className={styles.coverText}>
                {studyCue?.coverText ?? 'Use the image as your cue, then reveal the wording only after you have tried recall.'}
              </p>
            </div>
          )}

            <div className={styles.actionRow}>
            {revealed ? (
              <>
                <button
                  type="button"
                  className={`${styles.scoreButton} ${styles.scoreAgain}`}
                  onClick={() => handleScore('again')}
                  disabled={isPending}
                >
                  {activeScore === 'again' ? 'Saving...' : 'Again'}
                </button>
                <button
                  type="button"
                  className={`${styles.scoreButton} ${styles.scoreGood}`}
                  onClick={() => handleScore('good')}
                  disabled={isPending}
                >
                  {activeScore === 'good' ? 'Saving...' : 'Good'}
                </button>
                <button
                  type="button"
                  className={`${styles.scoreButton} ${styles.scoreEasy}`}
                  onClick={() => handleScore('easy')}
                  disabled={isPending}
                >
                  {activeScore === 'easy' ? 'Saving...' : 'Easy'}
                </button>
              </>
            ) : (
              <button type="button" className={styles.revealButton} onClick={() => setRevealed(true)}>
                {studyCue?.revealLabel ?? 'Reveal answer'}
              </button>
            )}
          </div>

          <div className={styles.secondaryRow}>
            <PendingLink href={detailHref} className={styles.secondaryLink}>
              {detailLabel}
            </PendingLink>
            <PendingLink href={libraryHref} className={styles.ghostLink}>
              {libraryLabel}
            </PendingLink>
          </div>
        </div>
      </section>
    </div>
  )
}
