import Image from 'next/image'
import { Bookmark, Brain, Flag, Globe, Heart, Repeat2, User } from 'lucide-react'

import type { CommunityCardRecord } from '@/app/actions/community'
import { getCommunityClarificationSignal } from '@/lib/community/clarification-signal'
import { getCommunityCardShareUrl } from '@/lib/site'
import PendingLink from '@/components/ui/PendingLink'
import ShareLinkButton from '@/components/ui/ShareLinkButton'
import StableDbImage from '@/components/ui/StableDbImage'
import styles from './CommunityCard.module.css'

export default function CommunityCard({
  card,
  layout = 'grid',
  showImageMeta = true,
  liked = false,
  saved = false,
  reported = false,
  reviewHref,
  onToggleLike,
  onToggleSave,
  onReport,
}: {
  card: CommunityCardRecord
  imageUrl?: string
  layout?: 'grid' | 'list'
  showImageMeta?: boolean
  liked?: boolean
  saved?: boolean
  reported?: boolean
  reviewHref?: string | null
  onToggleLike?: () => void
  onToggleSave?: () => void
  onReport?: () => void
}) {
  const authorName = card.author_name || 'Anonymous'
  const cardHref = `/community/${card.card_id}`
  const remixHref = `/scan?remix=${card.card_id}`
  const authorHref = card.published_by ? `/community/author/${card.published_by}` : null
  const topic = card.concept || card.category
  const showInteractiveActions = Boolean(onToggleLike || onToggleSave || onReport)
  const clarificationSignal = getCommunityClarificationSignal(card)
  const shareUrl = getCommunityCardShareUrl(card.card_id)

  return (
    <article className={`${styles.root} ${layout === 'list' ? styles.list : ''}`}>
      <PendingLink href={cardHref} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          <div className={styles.imageFrame}>
            {showImageMeta ? (
              <>
                <div className={styles.authorBadge}>
                  {card.author_avatar_url ? (
                    <Image
                      src={card.author_avatar_url}
                      alt={authorName}
                      width={18}
                      height={18}
                      quality={60}
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
              </>
            ) : null}

            {card.image_url ? (
              <StableDbImage
                kind="card"
                id={card.card_id}
                alt={card.title || 'Community card'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={68}
                className={styles.image}
              />
            ) : (
              <div className={styles.placeholder}>Preview unavailable</div>
            )}
          </div>
        </div>
      </PendingLink>

      <div className={styles.meta}>
        <PendingLink href={cardHref} className={styles.titleLink}>
          <p className={styles.title}>{card.title || 'Untitled'}</p>
        </PendingLink>
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
            <PendingLink href={authorHref} className={styles.authorLink}>
              by {authorName}
            </PendingLink>
          ) : (
            <span className={styles.hint}>by {authorName}</span>
          )}
        </div>
        {clarificationSignal ? (
          <div className={styles.signalRow}>
            <span
              className={`${styles.signalChip} ${
                clarificationSignal.tone === 'warning'
                  ? styles.signalChipWarning
                  : clarificationSignal.tone === 'info'
                    ? styles.signalChipInfo
                    : styles.signalChipCalm
              }`}
            >
              {clarificationSignal.compactLabel}
            </span>
          </div>
        ) : null}
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
        {saved && reviewHref ? (
          <PendingLink href={reviewHref} className={styles.reviewChip}>
            <Brain size={14} />
            <span>Study saved</span>
          </PendingLink>
        ) : null}
        <ShareLinkButton
          url={shareUrl}
          title={card.title || 'Published card'}
          label="Share"
          className={`${styles.actionChip} ${styles.secondaryAction}`}
        />
        <PendingLink href={remixHref} className={`${styles.remixChip} ${styles.secondaryAction}`}>
          <Repeat2 size={14} />
          <span>Remix</span>
        </PendingLink>
        {showInteractiveActions ? (
          <button
            type="button"
            className={`${styles.actionChip} ${styles.secondaryAction} ${reported ? styles.reportedChip : ''}`}
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
