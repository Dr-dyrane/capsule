import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Archive, ChevronLeft, Globe, ScanText, Sparkles, User } from 'lucide-react'

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

function getPointPreview(text: string) {
  const compact = text.replace(/\s+/g, ' ').trim()
  return compact.length <= 140 ? compact : `${compact.slice(0, 137).trimEnd()}...`
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

  const { library, cards, session, points, sourceSignedUrl } = data
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
  const recapLabels = [...new Set(points.map((point) => point.concept || point.category).filter(Boolean))].slice(0, 4) as string[]
  const recapPoints = points.slice(0, Math.min(4, points.length))
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
        <p className={shellStyles.copy}>
          {session?.session_context || 'The full published session, including the session story and every public card.'}
        </p>
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

      {session?.session_context || sourceSignedUrl ? (
        <section className={styles.storyGrid}>
          {session?.session_context ? (
            <section className={`${shellStyles.panel} ${styles.storyPanel}`}>
              <div className={`${shellStyles.panelInner} ${styles.storyInner}`}>
                <div className={styles.storyHeader}>
                  <div className={styles.storyEyebrow}>
                    <Archive size={14} />
                    <span>Session story</span>
                  </div>
                  <div className={styles.storyCount}>{points.length || library.card_count}</div>
                </div>

                <p className={styles.storyCopy}>{session.session_context}</p>

                <div className={styles.storyMeta}>
                  <div className={styles.storyChip}>{points.length || library.card_count} ideas</div>
                  <div className={styles.storyChip}>{library.card_count} cards</div>
                  <div className={styles.storyChip}>{topic}</div>
                </div>
              </div>
            </section>
          ) : null}

          {sourceSignedUrl ? (
            <section className={`${shellStyles.panel} ${styles.sourcePanel}`}>
              <div className={`${shellStyles.panelInner} ${styles.sourceInner}`}>
                <div className={styles.sourceCopy}>
                  <div className={styles.storyEyebrow}>
                    <ScanText size={14} />
                    <span>Source note</span>
                  </div>
                  <h2 className={styles.subTitle}>Original page</h2>
                  <p className={styles.subCopy}>Community can follow the session all the way back to the note that produced it.</p>
                </div>

                <div className={styles.sourcePreview}>
                  <ImagePreview src={sourceSignedUrl} alt={library.title || 'Published source note'} variant="document" />
                </div>
              </div>
            </section>
          ) : null}
        </section>
      ) : null}

      {points.length > 0 ? (
        <section className={`${shellStyles.panel} ${styles.recapPanel}`}>
          <div className={`${shellStyles.panelInner} ${styles.recapInner}`}>
            <div className={styles.recapHeader}>
              <div>
                <div className={styles.storyEyebrow}>
                  <Sparkles size={14} />
                  <span>Key ideas in this note</span>
                </div>
                <h2 className={styles.subTitle}>Quick recap</h2>
                <p className={styles.subCopy}>The same session-level orientation a user sees privately, now visible in community too.</p>
              </div>
              <div className={styles.storyCount}>{points.length}</div>
            </div>

            {recapLabels.length > 0 ? (
              <div className={styles.recapTags}>
                {recapLabels.map((label) => (
                  <div key={label} className={styles.storyChip}>
                    {label}
                  </div>
                ))}
              </div>
            ) : null}

            <div className={styles.recapList}>
              {recapPoints.map((point) => (
                <div key={point.id} className={styles.recapItem}>
                  <div className={styles.recapBullet} />
                  <div className={styles.recapBody}>
                    <p className={styles.recapText}>{getPointPreview(point.text)}</p>
                    {point.concept || point.category ? (
                      <span className={styles.recapMeta}>{point.concept || point.category}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.cardsSection}>
        <div className={styles.cardsHeader}>
          <h2 className={styles.cardsTitle}>Cards in this library</h2>
          <p className={styles.cardsCopy}>The full card set from this published session, not just a cover-level preview.</p>
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
