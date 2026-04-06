import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Globe, User } from 'lucide-react'

import { getCardClarifications } from '@/app/actions/clarifications'
import {
  getCommunityCardByIdWithUrl,
  getRelatedCommunityCards,
  getViewerCommunityReactions,
  getViewerCommunityReports,
} from '@/app/actions/community'
import { getCardImagePath } from '@/lib/assets/stable-image-paths'
import { getCommunityClarificationSignal } from '@/lib/community/clarification-signal'
import { getCommunityCardShareImageUrl, getCommunityCardShareUrl } from '@/lib/site'
import ImagePreview from '@/components/cards/ImagePreview'
import CardClarifications from '@/components/clarifications/CardClarifications'
import CommunityDetailActions from '@/components/community/CommunityDetailActions'
import RelatedCommunityCards from '@/components/community/RelatedCommunityCards'

import shellStyles from '../../AppScreen.module.css'
import styles from './CommunityDetailPage.module.css'

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CommunityDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const card = await getCommunityCardByIdWithUrl(id)

  if (!card) {
    return {
      title: 'Published card | Capsule',
    }
  }

  const title = card.title || 'Published card'
  const topic = card.concept || card.category || 'Shared clinical concept'
  const author = card.author_name || 'the community'
  const shareUrl = getCommunityCardShareUrl(card.card_id)
  const shareImageUrl = getCommunityCardShareImageUrl(card.card_id)
  const description = `${topic} by ${author} on Capsule.`

  return {
    title: `${title} | Capsule`,
    description,
    alternates: {
      canonical: shareUrl,
    },
    openGraph: {
      title,
      description,
      url: shareUrl,
      type: 'article',
      images: [
        {
          url: shareImageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImageUrl],
    },
  }
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = await params
  const card = await getCommunityCardByIdWithUrl(id)

  if (!card) {
    notFound()
  }

  const [viewerReactions, viewerReports, clarifications, relatedCards] = await Promise.all([
    getViewerCommunityReactions([id]),
    getViewerCommunityReports([id]),
    getCardClarifications(id),
    getRelatedCommunityCards(id, 4),
  ])

  const viewer = viewerReactions[id] ?? { liked: false, saved: false, reported: false }
  const reported = viewerReports[id] ?? viewer.reported ?? false
  const publishedAt = card.published_at
    ? new Date(card.published_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const template = (card.community_template || 'mechanism-board').replace(/-/g, ' ')
  const topic = card.concept || card.category || 'Shared concept'
  const authorName = card.author_name || 'Anonymous'
  const authorHref = card.published_by ? `/community/author/${card.published_by}` : null
  const remixHref = `/scan?remix=${card.card_id}`
  const reviewHref = `/review?card=${card.card_id}&entry=card`
  const clarificationSignal = getCommunityClarificationSignal(card)
  const shareUrl = getCommunityCardShareUrl(card.card_id)

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <Link href="/community" className={styles.backLink}>
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Back to community</span>
        </Link>

        <div className={shellStyles.eyebrow}>
          <Globe size={14} aria-hidden="true" />
          <span>Published card</span>
        </div>

        <h1 className={styles.pageTitle}>{card.title || 'Untitled card'}</h1>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <section className={shellStyles.panel}>
            <div className={`${shellStyles.panelInner} ${styles.imagePanel}`}>
              <div className={styles.imageWrap}>
                {card.image_url ? (
                  <ImagePreview src={getCardImagePath(card.card_id)} alt={card.title || 'Published card'} />
                ) : (
                  <div className={styles.placeholder}>Preview unavailable.</div>
                )}
              </div>
            </div>
          </section>

          {relatedCards.length > 0 ? (
            <section className={`${shellStyles.panel} ${styles.relatedPanel}`}>
              <div className={`${shellStyles.panelInner} ${styles.relatedPanelInner}`}>
                <RelatedCommunityCards
                  cards={relatedCards}
                  description="Continue with the cards that carry the same disease story, ruleset, or mechanism thread."
                />
              </div>
            </section>
          ) : null}

          <CardClarifications cardId={card.card_id} data={clarifications} />
        </div>

        <section className={`${shellStyles.panel} ${styles.sidePanel}`}>
          <div className={`${shellStyles.panelInner} ${styles.metaPanel}`}>
            <div className={styles.metaRow}>
              <div className={styles.chip}>
                <Globe size={14} aria-hidden="true" />
                <span>Published</span>
              </div>
              <div className={styles.chip}>{template}</div>
              <div className={styles.chip}>{topic}</div>
              {publishedAt ? <div className={styles.chip}>{publishedAt}</div> : null}
              {clarificationSignal ? (
                <div
                  className={`${styles.chip} ${
                    clarificationSignal.tone === 'warning'
                      ? styles.chipWarning
                      : clarificationSignal.tone === 'info'
                        ? styles.chipInfo
                        : styles.chipCalm
                  }`}
                >
                  {clarificationSignal.detailLabel}
                </div>
              ) : null}
            </div>

            <CommunityDetailActions
              cardId={card.card_id}
              remixHref={remixHref}
              initialLiked={viewer.liked}
              initialSaved={viewer.saved}
              initialReported={reported}
              initialLikeCount={card.like_count}
              initialSaveCount={card.save_count}
              reviewHref={reviewHref}
              shareUrl={shareUrl}
              shareTitle={card.title}
            />

            <div className={styles.section}>
              <p className={styles.label}>Author</p>
              {authorHref ? (
                <Link href={authorHref} className={styles.authorLink}>
                  <User size={14} aria-hidden="true" />
                  <span>{authorName}</span>
                </Link>
              ) : (
                <p className={styles.value}>{authorName}</p>
              )}
            </div>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Likes</div>
                <div className={styles.statValue}>{card.like_count}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Saves</div>
                <div className={styles.statValue}>{card.save_count}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Reports</div>
                <div className={styles.statValue}>{card.report_count}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
