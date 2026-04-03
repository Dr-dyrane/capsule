import Image from 'next/image'
import { Archive, ChevronRight, User } from 'lucide-react'

import type { CommunityLibraryRecord } from '@/app/actions/community'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import PendingLink from '@/components/ui/PendingLink'
import styles from './CommunityLibraryCard.module.css'

export default function CommunityLibraryCard({
  library,
  imageUrl,
}: {
  library: CommunityLibraryRecord
  imageUrl?: string
}) {
  const authorName = library.author_name || 'Anonymous'
  const topic = library.concept || library.category

  return (
    <PendingLink href={`/community/library/${library.session_id}`} className={styles.card}>
      <div className={styles.cover}>
        <div className={styles.coverFrame}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={library.title || 'Published library'}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={66}
              placeholder="blur"
              blurDataURL={APP_IMAGE_BLUR_DATA_URL}
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

      <div className={styles.trailing}>
        <ChevronRight size={18} />
      </div>
    </PendingLink>
  )
}
