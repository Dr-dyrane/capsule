import type { ReviewItemState, ReviewScore } from '@/lib/types'

const MINUTE = 60 * 1000
const DAY = 24 * 60 * MINUTE

const INTERVALS: Record<ReviewItemState, Record<ReviewScore, number>> = {
  new: {
    again: 10 * MINUTE,
    good: 1 * DAY,
    easy: 3 * DAY,
  },
  learning: {
    again: 30 * MINUTE,
    good: 3 * DAY,
    easy: 7 * DAY,
  },
  review: {
    again: 1 * DAY,
    good: 7 * DAY,
    easy: 14 * DAY,
  },
}

function getNextState(currentState: ReviewItemState, score: ReviewScore): ReviewItemState {
  if (score === 'again') {
    return 'learning'
  }

  if (score === 'easy') {
    return 'review'
  }

  return currentState === 'new' ? 'learning' : 'review'
}

export function getNextReviewSchedule(
  currentState: ReviewItemState,
  score: ReviewScore,
  now = new Date(),
) {
  const nextState = getNextState(currentState, score)
  const nextReviewAt = new Date(now.getTime() + INTERVALS[currentState][score]).toISOString()

  return {
    nextState,
    nextReviewAt,
    lapseIncrement: score === 'again' ? 1 : 0,
  }
}
