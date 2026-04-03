'use client'

import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import DeleteActionButton from '@/components/ui/DeleteActionButton'
import PendingLink from '@/components/ui/PendingLink'
import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import type { SessionRecord } from '@/lib/types'

import styles from './LibraryPage.module.css'

type LibrarySessionListItem = {
  session: SessionRecord
  title: string
  dateLabel: string
  imageUrl?: string
}

export default function LibrarySessionList({ items }: { items: LibrarySessionListItem[] }) {
  const [sessions, setSessions] = useState(items)

  const groupedSessions = useMemo(() => {
    return sessions.reduce<Record<string, LibrarySessionListItem[]>>((groups, item) => {
      if (!groups[item.dateLabel]) {
        groups[item.dateLabel] = []
      }

      groups[item.dateLabel].push(item)
      return groups
    }, {})
  }, [sessions])

  if (sessions.length === 0) {
    return null
  }

  return (
    <>
      {Object.entries(groupedSessions).map(([dateLabel, groupItems]) => (
        <section key={dateLabel} className={styles.group}>
          <h2 className={styles.date}>{dateLabel}</h2>
          <div className={styles.list}>
            {groupItems.map(({ session, title, imageUrl }) => (
              <div key={session.id} className={styles.item}>
                <PendingLink href={`/scan/${session.id}`} className={styles.itemLink}>
                  <div className={styles.thumb}>
                    <div className={styles.thumbFrame}>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Uploaded note"
                          fill
                          sizes="56px"
                          quality={55}
                          placeholder="blur"
                          blurDataURL={APP_IMAGE_BLUR_DATA_URL}
                        />
                      ) : (
                        <div className={styles.thumbFallback}>Note</div>
                      )}
                    </div>
                    <div className={styles.thumbLabel}>Original note</div>
                  </div>
                  <div className={styles.info}>
                    <p className={styles.name}>{title}</p>
                    <p className={styles.meta}>
                      {session.card_count} cards <span aria-hidden="true">&middot;</span> {session.status}
                      {session.remix_source_card_id ? (
                        <>
                          <span aria-hidden="true">&middot;</span> Remix
                        </>
                      ) : null}
                    </p>
                  </div>
                  <ChevronRight size={18} className={styles.chevron} />
                </PendingLink>

                <DeleteActionButton
                  targetId={session.id}
                  targetType="session"
                  compactOnMobile
                  className={styles.deleteActionSlot}
                  onDeleted={() => setSessions((current) => current.filter((item) => item.session.id !== session.id))}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
