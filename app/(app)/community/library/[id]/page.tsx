import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Archive, ChevronLeft, Globe, User } from 'lucide-react'

import { getCommunityLibraryById } from '@/app/actions/community'
import CommunityCard from '@/components/cards/CommunityCard'
import ImagePreview from '@/components/cards/ImagePreview'

import shellStyles from '../../../AppScreen.module.css'
import styles from './LibraryDetailPage.module.css'

type CommunityLibraryDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function CommunityLibraryDetailPage({ params }: CommunityLibraryDetailPageProps) {
  const { id } = await params
  const data = await getCommunityLibraryById(id)

  if (!data) {
    notFound()
  }

  const { library, cards, signedUrls } = data
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
              {library.cover_image_url && signedUrls[library.cover_image_url] ? (
                <ImagePreview
                  src={signedUrls[library.cover_image_url]}
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
              imageUrl={card.image_url ? signedUrls[card.image_url] : undefined}
              showImageMeta={false}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
