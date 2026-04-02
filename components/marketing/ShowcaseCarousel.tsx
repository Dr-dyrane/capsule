'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

import styles from './ShowcaseCarousel.module.css'

type ShowcaseCard = {
  src: string
  alt: string
}

type Props = {
  cards: ShowcaseCard[]
}

const SWIPE_THRESHOLD = 36

export default function ShowcaseCarousel({ cards }: Props) {
  const [activeIndex, setActiveIndex] = useState(1)
  const pointerStartX = useRef<number | null>(null)

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
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.glow} />

      <div
        className={styles.canvas}
        role="region"
        aria-roledescription="carousel"
        aria-label="Learning card examples"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {cards.map((card, index) => {
          const positionClassName = getPosition(index)
          const isActive = index === activeIndex
          const label = isActive ? `${card.alt}, current card` : `Show ${card.alt}`

          return (
            <button
              key={card.src}
              type="button"
              className={`${styles.card} ${positionClassName}`}
              onClick={() => {
                if (!isActive) {
                  goToIndex(index)
                }
              }}
              aria-label={label}
              aria-pressed={isActive}
            >
              <Image
                src={card.src}
                alt={card.alt}
                fill
                priority={isActive}
                sizes={
                  isActive
                    ? '(max-width: 1023px) min(100vw - 48px, 36rem), 42vw'
                    : '(max-width: 1023px) 38vw, 24vw'
                }
                className={styles.cardImage}
              />
            </button>
          )
        })}

        <p className={styles.srOnly}>
          Swipe or use the left and right arrow keys to cycle through example cards.
        </p>
      </div>
    </div>
  )
}
