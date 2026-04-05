'use client'
import { Archive, ChevronRight, User } from 'lucide-react'

import type { CommunityLibraryRecord } from '@/app/actions/community'
import { getCommunityLibraryShareUrl } from '@/lib/site'
import CommunityLibraryActions from '@/components/community/CommunityLibraryActions'
import PendingLink from '@/components/ui/PendingLink'
import StableDbImage from '@/components/ui/StableDbImage'
import styles from './CommunityLibraryCard.module.css'

export default function CommunityLibraryCard({
  library,
  liked = false,
  saved = false,
  reported = false,
}: {
  library: CommunityLibraryRecord
  imageUrl?: string
  liked?: boolean
  saved?: boolean
  reported?: boolean
}) {
  const authorName = library.author_name || 'Anonymous'
  const topic = library.concept || library.category
  const libraryHref = `/community/library/${library.session_id}`
  const shareUrl = getCommunityLibraryShareUrl(library.session_id)

  return (
    <article className={styles.root}>
      <PendingLink href={libraryHref} className={styles.cardLink}>
        <div className={styles.cover}>
          <div className={styles.coverFrame}>
            {library.cover_image_url ? (
              <StableDbImage
                kind="library"
                id={library.session_id}
                alt={library.title || 'Published library'}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={66}
                className={styles.image}
              />
            ) : (
              <div className={styles.placeholder}>Preview unavailable</div>
            )}
          </div>

          <div className={styles.collectionBadge}>
            <Archive size={12} />
            <span>Library</span>
          </div>

          <div className={styles.countBadge}>{library.card_count} cards</div>
        </div>

        <div className={styles.meta}>
          <p className={styles.title}>{library.title || 'Published library'}</p>

          <div className={styles.row}>
            <span className={styles.hint}>{topic || 'Shared collection'}</span>
            <span className={styles.dot}>&middot;</span>
            <span className={styles.author}>
              <User size={13} />
              <span>{authorName}</span>
            </span>
          </div>
        </div>
      </PendingLink>

      <div className={styles.footer}>
        <CommunityLibraryActions
          sessionId={library.session_id}
          shareUrl={shareUrl}
          shareTitle={library.title || 'Published library'}
          initialLiked={liked}
          initialSaved={saved}
          initialReported={reported}
          initialLikeCount={library.like_count}
          initialSaveCount={library.save_count}
          compact
        />

        <PendingLink href={libraryHref} className={styles.openChip}>
          <ChevronRight size={16} />
          <span>Open</span>
        </PendingLink>
      </div>
    </article>
  )
}
