import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Archive, ChevronLeft, Globe, User } from 'lucide-react'

import {
  getCommunityLibraryById,
  getViewerCommunityLibraryReactions,
  getViewerCommunityLibraryReports,
} from '@/app/actions/community'
import CommunityCard from '@/components/cards/CommunityCard'
import ImagePreview from '@/components/cards/ImagePreview'
import CommunityLibraryActions from '@/components/community/CommunityLibraryActions'
import { getLibraryImagePath } from '@/lib/assets/stable-image-paths'
import { getCommunityLibraryShareImageUrl, getCommunityLibraryShareUrl } from '@/lib/site'

import shellStyles from '../../../AppScreen.module.css'
import styles from './LibraryDetailPage.module.css'

type CommunityLibraryDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: CommunityLibraryDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getCommunityLibraryById(id)

  if (!data) {
    return {
      title: 'Published library | Capsule',
    }
  }

  const { library } = data
  const title = library.title || 'Published library'
  const topic = library.concept || library.category || 'Shared collection'
  const author = library.author_name || 'the community'
  const shareUrl = getCommunityLibraryShareUrl(library.session_id)
  const shareImageUrl = getCommunityLibraryShareImageUrl(library.session_id)
  const description = `${topic} with ${library.card_count} cards by ${author} on Capsule.`

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

export default async function CommunityLibraryDetailPage({ params }: CommunityLibraryDetailPageProps) {
  const { id } = await params
  const data = await getCommunityLibraryById(id)

  if (!data) {
    notFound()
  }

  const { library, cards } = data
  const publishedAt = library.published_at
    ? new Date(library.published_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const authorName = library.author_name || 'Anonymous'
  const authorHref = library.published_by ? `/community/author/${library.published_by}` : null
  const topic = library.concept || library.category || 'Shared collection'
  const shareUrl = getCommunityLibraryShareUrl(library.session_id)
  const [viewerReactions, viewerReports] = await Promise.all([
    getViewerCommunityLibraryReactions([library.session_id]),
    getViewerCommunityLibraryReports([library.session_id]),
  ])
  const viewerState = viewerReactions[library.session_id] ?? { liked: false, saved: false, reported: false }

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <Link href="/community" className={styles.backLink}>
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Back to community</span>
        </Link>

        <div className={shellStyles.eyebrow}>
          <Archive size={14} aria-hidden="true" />
          <span>Published library</span>
        </div>

        <h1 className={shellStyles.title}>{library.title || 'Published library'}</h1>
        <p className={shellStyles.copy}>A full shared collection of published cards.</p>
      </header>

      <section className={styles.hero}>
        <div className={`${shellStyles.panel} ${styles.coverPanel}`}>
          <div className={`${shellStyles.panelInner} ${styles.coverPanel}`}>
            <div className={styles.coverWrap}>
              {library.cover_image_url ? (
                <ImagePreview
                  src={getLibraryImagePath(library.session_id)}
                  alt={library.title || 'Published library'}
                />
              ) : (
                <div className={styles.placeholder}>Preview unavailable.</div>
              )}
            </div>
          </div>
        </div>

        <div className={`${shellStyles.panel} ${styles.metaPanel}`}>
          <div className={`${shellStyles.panelInner} ${styles.metaPanel}`}>
            <div className={styles.metaRow}>
              <div className={styles.chip}>
                <Globe size={14} />
                <span>Published</span>
              </div>
              <div className={styles.chip}>{library.card_count} cards</div>
              <div className={styles.chip}>{topic}</div>
              {publishedAt ? <div className={styles.chip}>{publishedAt}</div> : null}
            </div>

            <div className={styles.metaRow}>
              {authorHref ? (
                <Link href={authorHref} className={styles.chip}>
                  <User size={14} />
                  <span>{authorName}</span>
                </Link>
              ) : (
                <div className={styles.chip}>
                  <User size={14} />
                  <span>{authorName}</span>
                </div>
              )}
              <div className={styles.chip}>Likes {library.like_count}</div>
              <div className={styles.chip}>Saves {library.save_count}</div>
            </div>

            <CommunityLibraryActions
              sessionId={library.session_id}
              shareUrl={shareUrl}
              shareTitle={library.title || 'Published library'}
              initialLiked={viewerState.liked}
              initialSaved={viewerState.saved}
              initialReported={viewerReports[library.session_id] ?? false}
              initialLikeCount={library.like_count}
              initialSaveCount={library.save_count}
            />
          </div>
        </div>
      </section>

      <section className={styles.cardsSection}>
        <div className={styles.cardsHeader}>
          <h2 className={styles.cardsTitle}>Cards in this library</h2>
          <p className={styles.cardsCopy}>Open any card, save what helps, or remix it into your own note.</p>
        </div>

        <div className={styles.cardsGrid}>
          {cards.map((card) => (
            <CommunityCard
              key={card.card_id}
              card={card}
              showImageMeta={false}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
