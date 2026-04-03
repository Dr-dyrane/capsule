import Link from 'next/link'
import Image from 'next/image'
import { Bookmark, Flag, Globe, Heart, Repeat2, User } from 'lucide-react'

import type { CommunityCardRecord } from '@/app/actions/community'
import styles from './CommunityCard.module.css'

export default function CommunityCard({
  card,
  imageUrl,
  layout = 'grid',
  liked = false,
  saved = false,
  reported = false,
  onToggleLike,
  onToggleSave,
  onReport,
}: {
  card: CommunityCardRecord
  imageUrl?: string
  layout?: 'grid' | 'list'
  liked?: boolean
  saved?: boolean
  reported?: boolean
  onToggleLike?: () => void
  onToggleSave?: () => void
  onReport?: () => void
}) {
  const authorName = card.author_name || 'Anonymous'
  const cardHref = `/scan?remix=${card.card_id}`
  const remixHref = `/scan?remix=${card.card_id}`
  const authorHref = card.published_by ? `/community/author/${card.published_by}` : null
  const topic = card.concept || card.category
  const showInteractiveActions = Boolean(onToggleLike || onToggleSave || onReport)

  return (
    <article className={`${styles.root} ${layout === 'list' ? styles.list : ''}`}>
      <Link href={cardHref} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          <div className={styles.imageFrame}>
            <div className={styles.authorBadge}>
              {card.author_avatar_url ? (
                <Image
                  src={card.author_avatar_url}
                  alt={authorName}
                  width={18}
                  height={18}
                  unoptimized
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarFallback}>
                  <User size={12} />
                </div>
              )}
              <span className={styles.authorName}>{authorName}</span>
            </div>

            <div className={styles.status}>
              <Globe size={12} className={styles.globe} />
              <span>Published</span>
            </div>

            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={card.title || 'Community card'}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
              />
            ) : (
              <div className={styles.placeholder}>Preview unavailable</div>
            )}
          </div>
        </div>
      </Link>

      <div className={styles.meta}>
        <Link href={cardHref} className={styles.titleLink}>
          <p className={styles.title}>{card.title || 'Untitled'}</p>
        </Link>
        <div className={styles.metaRow}>
          <span className={styles.hint}>{(card.community_template || 'mechanism-board').replace(/-/g, ' ')}</span>
          {topic ? (
            <>
              <span className={styles.dot}>&middot;</span>
              <span className={styles.hint}>{topic}</span>
            </>
          ) : null}
          <span className={styles.dot}>&middot;</span>
          {authorHref ? (
            <Link href={authorHref} className={styles.authorLink}>
              by {authorName}
            </Link>
          ) : (
            <span className={styles.hint}>by {authorName}</span>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        {showInteractiveActions ? (
          <>
            <button
              type="button"
              className={`${styles.actionChip} ${liked ? styles.actionChipActive : ''}`}
              onClick={onToggleLike}
            >
              <Heart size={14} />
              <span>{card.like_count}</span>
            </button>
            <button
              type="button"
              className={`${styles.actionChip} ${saved ? styles.actionChipActive : ''}`}
              onClick={onToggleSave}
            >
              <Bookmark size={14} />
              <span>{card.save_count}</span>
            </button>
          </>
        ) : (
          <div className={styles.metricsChip}>
            <Heart size={14} />
            <span>{card.like_count} likes</span>
          </div>
        )}
        <Link href={remixHref} className={styles.remixChip}>
          <Repeat2 size={14} />
          <span>Remix</span>
        </Link>
        {showInteractiveActions ? (
          <button
            type="button"
            className={`${styles.actionChip} ${reported ? styles.reportedChip : ''}`}
            onClick={onReport}
            disabled={reported}
          >
            <Flag size={14} />
            <span>{reported ? 'Reported' : 'Report'}</span>
          </button>
        ) : null}
      </div>
    </article>
  )
}
