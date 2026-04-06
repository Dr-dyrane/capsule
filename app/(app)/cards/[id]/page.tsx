import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, Images, Repeat2, ScanText, Sparkles } from 'lucide-react'

import { getCommunityCardByIdWithUrl, getRelatedCommunityCards } from '@/app/actions/community'
import { getCardImagePath } from '@/lib/assets/stable-image-paths'
import { getSafeCommunityVisibility, isCommunitySchemaError } from '@/lib/community/schema'
import { getCommunityCardShareUrl } from '@/lib/site'
import { createSignedObjectUrlSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'

import shellStyles from '../../AppScreen.module.css'
import styles from './CardDetailPage.module.css'
import ImagePreview from '@/components/cards/ImagePreview'
import PublishToggle from '@/components/cards/PublishToggle'
import RelatedCommunityCards from '@/components/community/RelatedCommunityCards'
import DeleteActionButton from '@/components/ui/DeleteActionButton'
import ShareLinkButton from '@/components/ui/ShareLinkButton'


type CardDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const cardWithCommunity = await supabase
    .from('cards')
    .select('id, title, image_url, created_at, status, session_id, visibility, points(text, category)')
    .eq('id', id)
    .single()

  let card = cardWithCommunity.data
  let communityEnabled = true

  if (cardWithCommunity.error) {
    if (!isCommunitySchemaError(cardWithCommunity.error)) {
      redirect('/cards')
    }

    const fallbackCard = await supabase
      .from('cards')
      .select('id, title, image_url, created_at, status, session_id, points(text, category)')
      .eq('id', id)
      .single()

    if (fallbackCard.error || !fallbackCard.data) {
      redirect('/cards')
    }

    card = {
      ...fallbackCard.data,
      visibility: 'private',
    }
    communityEnabled = false
  }

  if (!card) {
    redirect('/cards')
  }

  const { data: session } = await supabase
    .from('sessions')
    .select('id, source_url, remix_source_card_id')
    .eq('id', card.session_id)
    .single()

  const sourceNoteUrl = session?.source_url ? await createSignedObjectUrlSafe('notes', session.source_url) : null
  const [remixSource, relatedCards] = await Promise.all([
    session?.remix_source_card_id ? getCommunityCardByIdWithUrl(session.remix_source_card_id) : Promise.resolve(null),
    card.visibility === 'published' && card.status === 'complete'
      ? getRelatedCommunityCards(card.id, 3)
      : Promise.resolve([]),
  ])
  const point = Array.isArray(card.points) ? card.points[0] : card.points
  const category = point?.category ?? 'Learning card'
  const statusLabel =
    card.status === 'complete'
      ? 'Ready'
      : card.status === 'generating'
        ? 'Generating'
        : card.status === 'error'
          ? 'Error'
          : 'Queued'
  const createdAt = card.created_at
    ? new Date(card.created_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null
  const shareUrl = card.visibility === 'published' ? getCommunityCardShareUrl(card.id) : null

  return (
    <div className={shellStyles.screen}>
      <header className={shellStyles.header}>
        <Link href="/cards" className={styles.backLink}>
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Back to cards</span>
        </Link>

        <div className={shellStyles.eyebrow}>
          <Images size={14} aria-hidden="true" />
          <span>Card detail</span>
        </div>

        <h1 className={shellStyles.title}>{card.title || 'Untitled card'}</h1>
      </header>

      <div className={styles.layout}>
        <section className={`${shellStyles.panel} ${styles.imageShell}`}>
          <div className={styles.imagePanel}>
            <div className={styles.imageWrap}>
              {card.status === 'complete' && card.image_url ? (
                <ImagePreview
                  src={getCardImagePath(card.id)}
                  alt={card.title || 'Generated card'}
                />
              ) : (
                <div className={styles.placeholder}>
                  {card.status === 'generating'
                    ? 'Image is generating.'
                    : card.status === 'queued'
                      ? 'This card is waiting its turn.'
                      : card.status === 'error'
                        ? 'This card stopped before it finished.'
                        : 'Preview unavailable'}
                </div>
              )}
            </div>
          </div>
        </section>


        <section className={shellStyles.panel}>
          <div className={`${shellStyles.panelInner} ${styles.infoPanel}`}>
            <div className={styles.metaRow}>
              {communityEnabled ? (
                <PublishToggle cardId={card.id} initialVisibility={getSafeCommunityVisibility(card.visibility)} />
              ) : null}
              <div className={styles.chip}>
                <Sparkles size={14} aria-hidden="true" />
                <span>{category}</span>
              </div>
              <div className={styles.chip}>{statusLabel}</div>
              {createdAt ? <div className={styles.chip}>{createdAt}</div> : null}
            </div>

            <div className={styles.actionRow}>
              {card.status === 'complete' ? (
                <Link href={`/review?card=${card.id}&entry=card`} className={styles.reviewAction}>
                  Study this
                </Link>
              ) : null}
              {shareUrl ? (
                <ShareLinkButton
                  url={shareUrl}
                  title={card.title || 'Published card'}
                  label="Share"
                  className={styles.reviewAction}
                />
              ) : null}
              <DeleteActionButton targetId={card.id} targetType="card" redirectTo="/cards" compactOnMobile />
            </div>

            <div className={styles.section}>
              <p className={styles.label}>Source point</p>
              <p className={styles.pointText}>{point?.text ?? 'Original point unavailable.'}</p>
            </div>

            {relatedCards.length > 0 ? (
              <div className={styles.relatedSection}>
                <RelatedCommunityCards
                  cards={relatedCards}
                  title="Related public cards"
                  description="Keep this concept connected to the rest of the public story."
                />
              </div>
            ) : null}

            {card.session_id ? (
              <div className={styles.section}>
                <p className={styles.label}>Original note</p>
                <Link href={`/scan/${card.session_id}`} className={styles.sourceLink}>
                  <div className={styles.sourceLinkCopy}>
                    <div className={styles.sourceLinkTitle}>
                      <ScanText size={14} aria-hidden="true" />
                      <span>Open source scan</span>
                    </div>
                  </div>
                  {sourceNoteUrl ? (
                    <div className={styles.sourceThumb}>
                      <Image
                        src={sourceNoteUrl}
                        alt="Original note"
                        fill
                        sizes="72px"
                        quality={55}
                        placeholder="blur"
                        blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                        className={styles.sourceThumbImage}
                      />
                    </div>
                  ) : null}
                </Link>
              </div>
            ) : null}

            {remixSource ? (
              <div className={styles.section}>
                <p className={styles.label}>Reference card</p>
                <Link href={`/scan?remix=${remixSource.card_id}`} className={styles.sourceLink}>
                  <div className={styles.sourceLinkCopy}>
                    <div className={styles.sourceLinkTitle}>
                      <Repeat2 size={14} aria-hidden="true" />
                      <span>{remixSource.title || 'Reopen remix reference'}</span>
                    </div>
                  </div>
                  {remixSource.signedUrl ? (
                    <div className={styles.sourceThumb}>
                      <Image
                        src={remixSource.signedUrl}
                        alt={remixSource.title || 'Reference card'}
                        fill
                        sizes="72px"
                        quality={55}
                        placeholder="blur"
                        blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                        className={styles.sourceThumbImage}
                      />
                    </div>
                  ) : null}
                </Link>
              </div>
            ) : null}

          </div>
        </section>
      </div>
    </div>
  )
}
