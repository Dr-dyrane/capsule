import { Brain, Globe, RotateCcw, Sparkles } from 'lucide-react'

import { getReviewQueue } from '@/app/actions/review'
import ReviewQueue from '@/components/review/ReviewQueue'

import styles from '../AppScreen.module.css'

type ReviewEntryMode = 'latest' | 'card' | null

function getReviewEntryMode(value: string | undefined): ReviewEntryMode {
  if (value === 'latest' || value === 'card') {
    return value
  }

  return null
}

function getReviewCopy({
  entryMode,
  hasFocusCard,
  dueCount,
  savedCommunityCount,
  generatedCount,
}: {
  entryMode: ReviewEntryMode
  hasFocusCard: boolean
  dueCount: number
  savedCommunityCount: number
  generatedCount: number
}) {
  if (entryMode === 'latest' && hasFocusCard) {
    return 'Start with the newest card from this session, then continue through what is due.'
  }

  if (entryMode === 'card' && hasFocusCard) {
    return 'Start with this card, then continue through what is due.'
  }

  if (savedCommunityCount > 0 && generatedCount > 0) {
    return dueCount > 0
      ? 'This queue mixes due cards from your library with saved community cards.'
      : 'This queue mixes saved community cards with fresh cards you just opened for review.'
  }

  if (savedCommunityCount > 0) {
    return dueCount > 0
      ? 'Saved community cards are part of your due recall queue.'
      : 'You are starting from saved community cards first.'
  }

  return 'Recall the concept first. Reveal the wording second.'
}

function getFocusChipLabel(entryMode: ReviewEntryMode) {
  if (entryMode === 'latest') {
    return 'Latest first'
  }

  return 'Start here'
}

export default async function ReviewPage({
  searchParams,
}: {
  searchParams?: Promise<{
    card?: string
    entry?: string
  }>
}) {
  const params = searchParams ? await searchParams : {}
  const focusCardId = params?.card ?? null
  const entryMode = getReviewEntryMode(params?.entry)
  const reviewQueue = await getReviewQueue({
    focusCardId,
    limit: 20,
  })

  const {
    items,
    summary: { dueCount, generatedCount, savedCommunityCount, hasFocusCard, focusSourceType },
  } = reviewQueue

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Brain size={14} aria-hidden="true" />
          <span>Review</span>
        </div>
        <h1 className={styles.title}>Bring it back.</h1>
        <p className={styles.copy}>
          {getReviewCopy({
            entryMode,
            hasFocusCard,
            dueCount,
            savedCommunityCount,
            generatedCount,
          })}
        </p>
      </header>

      {(dueCount > 0 || hasFocusCard || savedCommunityCount > 0 || generatedCount > 0) && (
        <>
          <div className={styles.metaRow}>
            {dueCount > 0 ? (
              <div className={styles.chip}>
                <RotateCcw size={14} aria-hidden="true" />
                <span>Due now {dueCount}</span>
              </div>
            ) : null}
            {hasFocusCard ? (
              <div className={styles.chip}>
                <Sparkles size={14} aria-hidden="true" />
                <span>{getFocusChipLabel(entryMode)}</span>
              </div>
            ) : null}
            {generatedCount > 0 ? (
              <div className={styles.chip}>
                <Brain size={14} aria-hidden="true" />
                <span>Yours {generatedCount}</span>
              </div>
            ) : null}
            {savedCommunityCount > 0 ? (
              <div className={styles.chip}>
                <Globe size={14} aria-hidden="true" />
                <span>Saved {savedCommunityCount}</span>
              </div>
            ) : null}
          </div>
          <p className={styles.mutedText}>
            {hasFocusCard
              ? focusSourceType === 'saved_community'
                ? 'The queue begins with this saved community card, then rolls into the rest of what is due.'
                : 'The queue begins with the selected card, then rolls into the rest of what is due.'
              : savedCommunityCount > 0
                ? 'Saved public cards review exactly like your own cards once they enter the queue.'
                : 'Due cards come first. Fresh cards only appear when you explicitly start from one.'}
          </p>
        </>
      )}

      <ReviewQueue initialItems={items} dueCount={dueCount} />
    </div>
  )
}
