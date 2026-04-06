'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useNavigationFeedback } from '@/components/providers/NavigationFeedbackProvider'
import StableDbImage from '@/components/ui/StableDbImage'
import { getCardRelationshipLabel } from '@/lib/community/relationships'
import type { CommunityCardRelationshipRecord } from '@/lib/types'

import styles from './RelatedCommunityCards.module.css'

type RelatedCommunityCardsProps = {
  cards: CommunityCardRelationshipRecord[]
  title?: string
  description?: string
}

const SWIPE_THRESHOLD = 36

export default function RelatedCommunityCards({
  cards,
  title = 'Related cards',
  description = 'Keep the story connected without leaving the idea behind.',
}: RelatedCommunityCardsProps) {
  const router = useRouter()
  const { beginNavigation } = useNavigationFeedback()
  const pointerStartX = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  if (cards.length === 0) {
    return null
  }

  function goToIndex(index: number) {
    setActiveIndex((index + cards.length) % cards.length)
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % cards.length)
  }

  function goToPrevious() {
    setActiveIndex((current) => (current - 1 + cards.length) % cards.length)
  }

  function getPosition(index: number) {
    const offset = (index - activeIndex + cards.length) % cards.length

    if (offset === 0) {
      return styles.center
    }

    if (offset === 1) {
      return styles.right
    }

    if (offset === cards.length - 1) {
      return styles.left
    }

    return styles.hidden
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStartX.current = event.clientX
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) {
      return
    }

    const deltaX = event.clientX - pointerStartX.current
    pointerStartX.current = null

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return
    }

    if (deltaX < 0) {
      goToNext()
      return
    }

    goToPrevious()
  }

  function handlePointerCancel() {
    pointerStartX.current = null
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPrevious()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNext()
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <p className={styles.label}>{title}</p>
          {cards.length > 1 ? <p className={styles.swipeHint}>Swipe to continue</p> : null}
        </div>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.root}>
        <div aria-hidden="true" className={styles.glow} />

        <div
          className={styles.canvas}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {cards.map((card, index) => {
            const positionClassName = getPosition(index)
            const isActive = index === activeIndex
            const topic = card.concept || card.category || 'Shared concept'
            const template = (card.community_template || 'mechanism-board').replace(/-/g, ' ')

            return (
              <button
                key={card.card_id}
                type="button"
                className={`${styles.card} ${positionClassName}`}
                onClick={() => {
                  if (!isActive) {
                    goToIndex(index)
                    return
                  }

                  const href = `/community/${card.card_id}`
                  beginNavigation(href)
                  router.push(href)
                }}
                aria-label={
                  isActive
                    ? `${card.title || 'Related card'}, current card`
                    : `Show ${card.title || 'related card'}`
                }
                aria-pressed={isActive}
              >
                <span className={styles.cardStage}>
                  <span className={styles.imageWrap}>
                    <StableDbImage
                      kind="card"
                      id={card.card_id}
                      alt={card.title || 'Related card'}
                      fill
                      sizes={
                        isActive
                          ? '(max-width: 767px) min(100vw - 48px, 22rem), min(36rem, 42vw)'
                          : '(max-width: 767px) 38vw, 20vw'
                      }
                      quality={68}
                      className={styles.image}
                    />
                  </span>

                  <span className={styles.meta}>
                    <span className={styles.relationshipChip}>
                      {getCardRelationshipLabel(card.relationship_type)}
                    </span>
                    <span className={styles.cardTitle}>{card.title || 'Untitled card'}</span>
                    <span className={styles.reason}>{card.relationship_reason}</span>
                    <span className={styles.hint}>
                      {topic}
                      <span className={styles.dot}>&middot;</span>
                      {template}
                    </span>
                  </span>
                </span>
              </button>
            )
          })}

          <p className={styles.srOnly}>Swipe or use the left and right arrow keys to move through related cards.</p>
        </div>
      </div>
    </section>
  )
}
