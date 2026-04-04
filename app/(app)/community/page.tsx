import { Globe } from 'lucide-react'
import {
  fetchCommunityCardsWithUrls,
  getCommunityCardCount,
  getCommunityLibraryCount,
  getCommunityLibrariesWithUrls,
  getCommunityFilters,
  getViewerCommunityReactions,
  getViewerCommunityReports,
} from '@/app/actions/community'
import CommunityBrowser from '@/components/community/CommunityBrowser'
import { createClient } from '@/lib/supabase/server'
import { getUiDensity } from '@/lib/ui/density'
import styles from '../AppScreen.module.css'

export default async function CommunityPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string
    template?: string
    category?: string
    topic?: string
    sort?: string
    saved?: string
    view?: string
  }>
}) {
  const params = searchParams ? await searchParams : {}
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const densityMode = getUiDensity(user)

  const initialFilters = {
    search: params?.q ?? '',
    template: params?.template ?? null,
    category: params?.category ?? null,
    topic: params?.topic ?? null,
    sort: params?.sort === 'trending' ? 'trending' : 'recent',
    savedOnly: params?.saved === '1',
    view: params?.view === 'libraries' ? 'libraries' : 'cards',
  } as const

  const [{ cards, signedUrls }, { libraries, signedUrls: libraryUrls }, totalCardCount, totalLibraryCount] = await Promise.all([
    fetchCommunityCardsWithUrls(0, 20, initialFilters),
    getCommunityLibrariesWithUrls(24),
    getCommunityCardCount(),
    getCommunityLibraryCount(),
  ])
  const filterMeta = await getCommunityFilters()
  const cardIds = cards.map((card) => card.card_id)
  const [viewerReactions, viewerReports] = await Promise.all([
    getViewerCommunityReactions(cardIds),
    getViewerCommunityReports(cardIds),
  ])

  const initialViewerState = Object.fromEntries(
    cardIds.map((cardId) => [
      cardId,
      {
        liked: viewerReactions[cardId]?.liked ?? false,
        saved: viewerReactions[cardId]?.saved ?? false,
        reported: viewerReports[cardId] ?? false,
      },
    ]),
  )

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Globe size={14} aria-hidden="true" />
          <span>Community</span>
        </div>
        <h1 className={styles.title}>Shared knowledge.</h1>
        <p className={styles.copy}>
          {densityMode === 'focused' ? 'Browse what others shared.' : 'Discover visual clinical concepts published by the community.'}
        </p>
      </header>

      <CommunityBrowser
        initialCards={cards}
        initialSignedUrls={signedUrls}
        initialViewerReactions={initialViewerState}
        totalCardCount={totalCardCount}
        totalLibraryCount={totalLibraryCount}
        filterMeta={filterMeta}
        initialFilters={initialFilters}
        libraries={libraries}
        libraryUrls={libraryUrls}
        densityMode={densityMode}
      />
    </div>
  )
}
