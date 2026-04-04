'use client'

import { useMemo, useState } from 'react'

import ThemeToggle from '@/components/marketing/ThemeToggle'
import Logo from '@/components/ui/Logo'
import PendingLink from '@/components/ui/PendingLink'
import styles from './DonatePage.module.css'

type CardType = 'donate' | 'sponsor' | 'premium'

type DonateCard = {
  type: CardType
  label: string
  word: string
  title: string
  detail: string
  subject: string
}

const CARDS: DonateCard[] = [
  {
    type: 'donate',
    label: 'Give',
    word: 'Open',
    title: 'Sponsor students',
    detail: 'Fund the free path students feel first.',
    subject: 'Capsule donation',
  },
  {
    type: 'sponsor',
    label: 'Fund',
    word: 'Access',
    title: 'Sponsor access',
    detail: 'Underwrite cohorts, schools, and shared learning.',
    subject: 'Capsule sponsorship',
  },
  {
    type: 'premium',
    label: 'Upgrade',
    word: 'Premium',
    title: 'Request premium',
    detail: 'For tutors, heavy users, and advanced workflows.',
    subject: 'Capsule premium request',
  },
]

function getThemeClass(type: CardType) {
  if (type === 'donate') return styles.themeDonate
  if (type === 'sponsor') return styles.themeSponsor
  return styles.themePremium
}

export default function DonatePage() {
  const [activeIndex, setActiveIndex] = useState(1)

  const activeCard = CARDS[activeIndex]

  const cardPositions = useMemo(
    () =>
      CARDS.map((_, index) => {
        const offset = (index - activeIndex + CARDS.length) % CARDS.length

        if (offset === 0) return styles.cardActive
        if (offset === 1) return styles.cardRight
        if (offset === CARDS.length - 1) return styles.cardLeft
        return styles.cardHidden
      }),
    [activeIndex],
  )

  function openEmail(subject: string) {
    window.location.assign(`mailto:hello@dyrane.tech?subject=${encodeURIComponent(subject)}`)
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav aria-label="Primary" className={styles.nav}>
          <PendingLink href="/" aria-label="Capsule home" className={styles.brand}>
            <Logo size={40} showText />
          </PendingLink>

          <div className={styles.navActions}>
            <PendingLink href="/login" className={styles.navButton}>
              Open
            </PendingLink>
          </div>
        </nav>

        <section aria-labelledby="donate-title" className={styles.stage}>
          <div className={styles.hero}>
            <div className={styles.eyebrow}>Support students</div>
            <h1 id="donate-title" className={styles.title}>
              Keep learning open.
            </h1>
          </div>

          <section className={styles.showcase} aria-label="Support options">
            <div className={styles.canvas}>
              <div aria-hidden="true" className={styles.glow} />

              {CARDS.map((card, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={card.type}
                    type="button"
                    className={`${styles.previewCard} ${cardPositions[index]} ${getThemeClass(card.type)}`}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    aria-label={card.title}
                  >
                    <span className={styles.cardFrame}>
                      <span className={styles.cardMeta}>
                        <span className={styles.cardTopRow}>
                          <span className={styles.logoPill}>
                            <Logo size={28} className={styles.cardLogo} />
                          </span>
                          <span className={styles.cardLabel}>{card.label}</span>
                        </span>

                        <span className={styles.cardCenter}>
                          <span className={styles.cardWord}>{card.word}</span>
                          <span className={styles.cardDetail}>{card.detail}</span>
                        </span>

                        <span className={styles.cardDock}>
                          <span className={styles.cardTitleBlock}>
                            <span className={styles.cardCaption}>{card.label}</span>
                            <span className={styles.cardTitle}>{card.title}</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className={styles.optionRail}>
              {CARDS.map((card, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    key={`${card.type}-option`}
                    type="button"
                    className={`${styles.optionButton} ${getThemeClass(card.type)} ${isActive ? styles.optionButtonActive : ''}`}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                  >
                    <span className={styles.optionLabel}>{card.label}</span>
                    <span className={styles.optionTitle}>{card.title}</span>
                  </button>
                )
              })}
            </div>

            <div className={`${styles.actionSurface} ${getThemeClass(activeCard.type)}`}>
              <p className={styles.selectionText}>{activeCard.detail}</p>
              <button type="button" className={styles.primaryButton} onClick={() => openEmail(activeCard.subject)}>
                Email us
              </button>
            </div>
          </section>
        </section>

        <footer aria-label="Appearance" className={styles.footer}>
          <div className={styles.footerLinks}>
            <PendingLink href="/" className={styles.footerLink}>
              Back home
            </PendingLink>
            <a href="mailto:hello@dyrane.tech?subject=Capsule%20sponsorship" className={styles.footerLink}>
              Sponsor access
            </a>
            <a href="mailto:hello@dyrane.tech" className={styles.footerLink}>
              hello@dyrane.tech
            </a>
          </div>
          <ThemeToggle />
        </footer>
      </div>
    </main>
  )
}
