'use client'

import { useState } from 'react'
import { Archive, Globe } from 'lucide-react'

import type {
  CommunityCardRecord,
  CommunityLibraryRecord,
} from '@/app/actions/community'
import type {
  CommunityFilterMeta,
  CommunityViewerState,
} from '@/lib/types'
import type { UiDensityMode } from '@/lib/ui/density'
import CommunityFeed from '@/components/community/CommunityFeed'
import CommunityLibraryCard from '@/components/community/CommunityLibraryCard'
import styles from './CommunityBrowser.module.css'

type CommunityBrowserProps = {
  initialCards: CommunityCardRecord[]
  initialSignedUrls: Record<string, string>
  initialViewerReactions: Record<string, CommunityViewerState>
  totalCardCount: number
  totalLibraryCount: number
  filterMeta: CommunityFilterMeta
  initialFilters?: {
    search?: string
    template?: string | null
    category?: string | null
    topic?: string | null
    sort?: 'recent' | 'trending'
    savedOnly?: boolean
    view?: 'cards' | 'libraries'
  }
  libraries: CommunityLibraryRecord[]
  libraryUrls: Record<string, string>
  initialLibraryViewerState: Record<string, CommunityViewerState>
  densityMode: UiDensityMode
  lockedAuthor?: {
    id: string
    name: string
  } | null
}

export default function CommunityBrowser({
  initialCards,
  initialSignedUrls,
  initialViewerReactions,
  totalCardCount,
  totalLibraryCount,
  filterMeta,
  initialFilters,
  libraries,
  libraryUrls,
  initialLibraryViewerState,
  densityMode,
  lockedAuthor = null,
}: CommunityBrowserProps) {
  const [view, setView] = useState<'cards' | 'libraries'>(
    initialFilters?.view ?? (initialCards.length === 0 && libraries.length > 0 ? 'libraries' : 'cards'),
  )
  const isFocused = densityMode === 'focused'

  return (
    <div className={styles.root}>
      <div className={styles.switcher}>
        <button
          type="button"
          className={`${styles.switch} ${view === 'cards' ? styles.switchActive : ''}`}
          onClick={() => setView('cards')}
        >
          <Globe size={14} />
          <span>Cards</span>
          {!isFocused ? <span className={styles.count}>{totalCardCount}</span> : null}
        </button>
        <button
          type="button"
          className={`${styles.switch} ${view === 'libraries' ? styles.switchActive : ''}`}
          onClick={() => setView('libraries')}
        >
          <Archive size={14} />
          <span>Libraries</span>
          {!isFocused ? <span className={styles.count}>{totalLibraryCount}</span> : null}
        </button>
      </div>

      {view === 'cards' ? (
        <CommunityFeed
          initialCards={initialCards}
          initialSignedUrls={initialSignedUrls}
          initialViewerReactions={initialViewerReactions}
          filterMeta={filterMeta}
          initialFilters={initialFilters}
          lockedAuthor={lockedAuthor}
          densityMode={densityMode}
        />
      ) : libraries.length > 0 ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>{isFocused ? 'Shared libraries' : 'Published libraries'}</h2>
              {!isFocused ? (
                <p className={styles.sectionCopy}>
                  Full shared collections built from published cards.
                </p>
              ) : null}
            </div>
          </div>

          <div className={styles.grid}>
            {libraries.map((library) => (
              <CommunityLibraryCard
                key={library.session_id}
                library={library}
                imageUrl={library.cover_image_url ? libraryUrls[library.cover_image_url] : undefined}
                liked={initialLibraryViewerState[library.session_id]?.liked ?? false}
                saved={initialLibraryViewerState[library.session_id]?.saved ?? false}
                reported={initialLibraryViewerState[library.session_id]?.reported ?? false}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No published libraries yet</p>
          <p className={styles.emptyCopy}>
            Published sessions will appear here once a shared collection is ready.
          </p>
        </div>
      )}
    </div>
  )
}
