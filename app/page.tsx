import ShowcaseCarousel from '@/components/marketing/ShowcaseCarousel'
import ThemeToggle from '@/components/marketing/ThemeToggle'
import Logo from '@/components/ui/Logo'
import PendingLink from '@/components/ui/PendingLink'
import { fetchCommunityCardsWithUrls } from '@/app/actions/community'
import { signOut } from '@/app/actions/user'
import { curateShowcaseCards } from '@/lib/community/curation'
import { createClient } from '@/lib/supabase/server'
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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let continueHref = '/scan'
  let continueLabel = 'Continue'

  if (user) {
    const { data: activeSession } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['uploading', 'processing', 'generating'])
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (activeSession?.id) {
      continueHref = `/scan/${activeSession.id}`
      continueLabel = 'Continue session'
    } else {
      const { data: latestSession } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (latestSession?.id) {
        continueHref = '/library'
      }
    }
  }

  let displayCards = showcaseCards.map((card) => ({
    ...card,
    fallbackSrc: card.src,
  }))
  try {
    const { cards, signedUrls } = await fetchCommunityCardsWithUrls(0, 18, { sort: 'trending' })
    const dynamicCards = curateShowcaseCards(
      cards.flatMap((card) => {
        const src = card.image_url ? signedUrls[card.image_url] : ''
        if (!src) return []

        return [
          {
            src,
            alt: card.title || 'Community learning card',
            template: card.community_template,
            authorId: card.published_by,
          },
        ]
      }),
      6,
    ).map(({ src, alt }, index) => ({
      src,
      alt,
      fallbackSrc: showcaseCards[index % showcaseCards.length]?.src ?? showcaseCards[0].src,
    }))

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
          <PendingLink href="/" aria-label="Capsule home" className={styles.brand}>
            <Logo size={40} showText />
          </PendingLink>

          <div className={styles.navActions}>
            <PendingLink href="/donate" className={`${styles.quietNavLink} ${styles.examplesLink}`}>
              Donate
            </PendingLink>
            {user ? (
              <form action={signOut}>
                <button type="submit" className={styles.navGhostButton}>
                  Log out
                </button>
              </form>
            ) : (
              <PendingLink href="/login" className={styles.navButton}>
                Log in
              </PendingLink>
            )}
          </div>
        </nav>

        <section aria-labelledby="marketing-title" className={styles.stage}>
          <div className={styles.hero}>
            <h1 id="marketing-title" className={styles.title}>
              Scan notes into cards.
            </h1>

            <PendingLink href={user ? continueHref : '/login'} className={styles.primaryButton}>
              {user ? continueLabel : 'Get Started'}
            </PendingLink>
          </div>

          <div id="showcase" className={styles.showcase}>
            <ShowcaseCarousel cards={displayCards} />
          </div>
        </section>

        <footer aria-label="Appearance" className={styles.footer}>
          <div className={styles.footerLinks}>
            <PendingLink href="/donate" className={styles.footerLink}>
              Support students
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
