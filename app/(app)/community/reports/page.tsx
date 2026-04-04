import Link from 'next/link'
import Image from 'next/image'
import { Flag, Globe } from 'lucide-react'

import { getCreatorModerationClarifications } from '@/app/actions/clarifications'
import { getCreatorModerationCardsWithUrls } from '@/app/actions/community'
import ClarificationModerationList from '@/components/clarifications/ClarificationModerationList'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import styles from '../../AppScreen.module.css'
import reportStyles from './ReportsPage.module.css'

export default async function CommunityReportsPage() {
  const [{ cards, signedUrls }, clarificationModeration] = await Promise.all([
    getCreatorModerationCardsWithUrls(24),
    getCreatorModerationClarifications(24),
  ])
  const clarificationItems = clarificationModeration.supported ? clarificationModeration.items : []
  const hasAnything = cards.length > 0 || clarificationItems.length > 0

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Flag size={14} aria-hidden="true" />
          <span>Moderation</span>
        </div>
        <h1 className={styles.title}>Reported activity.</h1>
        <p className={styles.copy}>Review flagged cards and clarifications from your public learning feed.</p>
      </header>

      {!hasAnything ? (
        <div className={styles.panel}>
          <div className={`${styles.panelInner} ${styles.emptyState}`}>
            <p className={styles.emptyTitle}>Nothing flagged right now</p>
            <p className={styles.emptyCopy}>If a published card or clarification gets flagged, it appears here for review.</p>
            <Link href="/community" className={styles.accentLink}>
              Open community
            </Link>
          </div>
        </div>
      ) : (
        <div className={reportStyles.stack}>
          {cards.length > 0 ? (
            <section className={reportStyles.section}>
              <div className={reportStyles.sectionHead}>
                <div>
                  <p className={reportStyles.sectionEyebrow}>Cards</p>
                  <h2 className={reportStyles.sectionTitle}>Reported cards</h2>
                </div>
              </div>

              <div className={reportStyles.grid}>
                {cards.map((card) => (
                  <article key={card.card_id} className={reportStyles.item}>
                    <div className={reportStyles.stage}>
                      <div className={reportStyles.frame}>
                        {card.image_url && signedUrls[card.image_url] ? (
                          <Image
                            src={signedUrls[card.image_url]}
                            alt={card.title || 'Reported card'}
                            fill
                            sizes="(max-width: 1023px) 100vw, 33vw"
                            quality={66}
                            placeholder="blur"
                            blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                            className={reportStyles.image}
                          />
                        ) : (
                          <div className={reportStyles.placeholder}>Preview unavailable</div>
                        )}
                      </div>
                    </div>

                    <div className={reportStyles.meta}>
                      <div className={reportStyles.copy}>
                        <p className={reportStyles.title}>{card.title || 'Untitled card'}</p>
                        <p className={reportStyles.hint}>
                          {card.report_count} reports <span aria-hidden="true">&middot;</span> {(card.community_template || 'mechanism-board').replace(/-/g, ' ')}
                        </p>
                      </div>

                      <div className={reportStyles.actions}>
                        <Link href={`/community/${card.card_id}`} className={reportStyles.primaryLink}>
                          Review card
                        </Link>
                        <Link href="/community" className={reportStyles.secondaryLink}>
                          <Globe size={14} aria-hidden="true" />
                          <span>Open feed</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {clarificationItems.length > 0 ? (
            <section className={reportStyles.section}>
              <div className={reportStyles.sectionHead}>
                <div>
                  <p className={reportStyles.sectionEyebrow}>Clarifications</p>
                  <h2 className={reportStyles.sectionTitle}>Reported clarification items</h2>
                </div>
              </div>

              <ClarificationModerationList items={clarificationItems} />
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}
