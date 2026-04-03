import Link from 'next/link'

import ShowcaseCarousel from '@/components/marketing/ShowcaseCarousel'
import ThemeToggle from '@/components/marketing/ThemeToggle'
import Logo from '@/components/ui/Logo'
import { fetchCommunityCardsWithUrls } from '@/app/actions/community'
import styles from './MarketingPage.module.css'

const showcaseCards = [
  {
    src: '/demo/multiple-myeloma-learning-card.png',
    alt: 'Multiple myeloma learning card example',
  },
  {
    src: '/demo/acute-myeloid-leukemia-learning-card.png',
    alt: 'Acute myeloid leukemia learning card example',
  },
  {
    src: '/demo/tumor-lysis-syndrome-learning-card-v4.png',
    alt: 'Tumor lysis syndrome learning card example',
  },
]

export default async function MarketingPage() {
  let displayCards = showcaseCards
  try {
    const { cards, signedUrls } = await fetchCommunityCardsWithUrls(0, 10)
    const uniqueTemplates = new Set<string>()
    const dynamicCards = cards
      .reduce<Array<{ src: string; alt: string }>>((acc, card) => {
        const src = card.image_url ? signedUrls[card.image_url] : ''
        const templateKey = card.community_template || 'mechanism-board'

        if (!src) {
          return acc
        }

        if (!uniqueTemplates.has(templateKey)) {
          uniqueTemplates.add(templateKey)
          acc.push({
            src,
            alt: card.title || 'Community learning card',
          })
          return acc
        }

        if (acc.length < 6) {
          acc.push({
            src,
            alt: card.title || 'Community learning card',
          })
        }

        return acc
      }, [])

    if (dynamicCards.length >= 3) {
      displayCards = dynamicCards
    }
  } catch (error) {
    console.error('Failed to load community cards for hero fallback', error)
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <nav aria-label="Primary" className={styles.nav}>
          <Link href="/" aria-label="Capsule home" className={styles.brand}>
            <Logo size={40} showText />
          </Link>

          <div className={styles.navActions}>
            <Link href="#showcase" className={`${styles.quietNavLink} ${styles.examplesLink}`}>
              Examples
            </Link>
            <Link href="/login" className={styles.navButton}>
              Log in
            </Link>
          </div>
        </nav>

        <section aria-labelledby="marketing-title" className={styles.stage}>
          <div className={styles.hero}>
            <h1 id="marketing-title" className={styles.title}>
              Scan notes into cards.
            </h1>

            <Link href="/login" className={styles.primaryButton}>
              Get Started
            </Link>
          </div>

          <div id="showcase" className={styles.showcase}>
            <ShowcaseCarousel cards={displayCards} />
          </div>
        </section>

        <footer aria-label="Appearance" className={styles.footer}>
          <ThemeToggle />
        </footer>
      </div>
    </main>
  )
}
