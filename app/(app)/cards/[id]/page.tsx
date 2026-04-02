import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft, Images, Sparkles } from 'lucide-react'

import { createSignedObjectUrlSafe } from '@/lib/storage/signed-urls'
import { createClient } from '@/lib/supabase/server'

import shellStyles from '../../AppScreen.module.css'
import styles from './CardDetailPage.module.css'

type CardDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function CardDetailPage({ params }: CardDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('cards')
    .select('id, title, image_url, created_at, status, points(text, category)')
    .eq('id', id)
    .single()

  if (error || !card) {
    redirect('/cards')
  }

  const signedUrl = card.status === 'complete' ? await createSignedObjectUrlSafe('cards', card.image_url) : null
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
        <p className={shellStyles.copy}>One card. One point.</p>
      </header>

      <div className={styles.layout}>
        <section className={shellStyles.panel}>
          <div className={`${shellStyles.panelInner} ${styles.imagePanel}`}>
            <div className={styles.imageWrap}>
              {signedUrl ? (
                <Image
                  src={signedUrl}
                  alt={card.title || 'Generated card'}
                  fill
                  unoptimized
                  sizes="(max-width: 1023px) 100vw, 60vw"
                  className={styles.image}
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

            <p className={styles.caption}>
              {card.status === 'complete' ? 'Generated 16:9 card.' : 'This card updates here as it moves through the queue.'}
            </p>
          </div>
        </section>

        <section className={shellStyles.panel}>
          <div className={`${shellStyles.panelInner} ${styles.infoPanel}`}>
            <div className={styles.metaRow}>
              <div className={styles.chip}>
                <Sparkles size={14} aria-hidden="true" />
                <span>{category}</span>
              </div>
              <div className={styles.chip}>{statusLabel}</div>
              {createdAt ? <div className={styles.chip}>{createdAt}</div> : null}
            </div>

            <div className={styles.section}>
              <p className={styles.label}>Source point</p>
              <p className={styles.pointText}>{point?.text ?? 'Original point unavailable.'}</p>
            </div>

            <div className={styles.note}>
              {card.status === 'complete'
                ? 'Scan the image first. Open the source point only if you need the wording.'
                : 'The source point is already ready. The image catches up here when generation finishes.'}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
