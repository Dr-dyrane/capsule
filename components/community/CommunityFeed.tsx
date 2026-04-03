'use client'

import Link from 'next/link'
import { useCallback, useDeferredValue, useEffect, useRef, useState } from 'react'
import {
  Bookmark,
  Globe,
  LayoutGrid,
  List,
  Loader2,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from 'lucide-react'

import {
  fetchCommunityCardsWithUrls,
  getViewerCommunityReactions,
  getViewerCommunityReports,
  reportCommunityCard,
  toggleCommunityReaction,
  type CommunityCardRecord,
} from '@/app/actions/community'
import type {
  CommunityFilterMeta,
  CommunityReactionKind,
  CommunitySort,
  CommunityViewerState,
} from '@/lib/types'
import CommunityCard from '@/components/cards/CommunityCard'
import MobileBottomSheet from '@/components/ui/MobileBottomSheet'
import styles from './CommunityFeed.module.css'

interface CommunityFeedProps {
  initialCards: CommunityCardRecord[]
  initialSignedUrls: Record<string, string>
  initialViewerReactions: Record<string, CommunityViewerState>
  filterMeta: CommunityFilterMeta
  initialFilters?: {
    search?: string
    template?: string | null
    category?: string | null
    topic?: string | null
    sort?: CommunitySort
    savedOnly?: boolean
  }
  lockedAuthor?: {
    id: string
    name: string
  } | null
}

export default function CommunityFeed({
  initialCards,
  initialSignedUrls,
  initialViewerReactions,
  filterMeta,
  initialFilters,
  lockedAuthor = null,
}: CommunityFeedProps) {
  const [cards, setCards] = useState<CommunityCardRecord[]>(initialCards)
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>(initialSignedUrls)
  const [viewerReactions, setViewerReactions] = useState<Record<string, CommunityViewerState>>(initialViewerReactions)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(initialCards.length === 20)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialFilters?.search ?? '')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(initialFilters?.template ?? null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters?.category ?? null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(initialFilters?.topic ?? null)
  const [sort, setSort] = useState<CommunitySort>(initialFilters?.sort ?? 'recent')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [savedOnly, setSavedOnly] = useState(Boolean(initialFilters?.savedOnly) && !lockedAuthor)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const hydratedRef = useRef(false)
  const deferredSearch = useDeferredValue(searchQuery)

  const mergeViewerState = useCallback(async (cardIds: string[]) => {
    const ids = [...new Set(cardIds.filter(Boolean))]
    if (ids.length === 0) return

    try {
      const [nextReactions, nextReports] = await Promise.all([
        getViewerCommunityReactions(ids),
        getViewerCommunityReports(ids),
      ])

      setViewerReactions((current) => ({
        ...current,
        ...Object.fromEntries(
          ids.map((id) => [
            id,
            {
              liked: nextReactions[id]?.liked ?? current[id]?.liked ?? false,
              saved: nextReactions[id]?.saved ?? current[id]?.saved ?? false,
              reported: nextReports[id] ?? current[id]?.reported ?? false,
            },
          ]),
        ),
      }))
    } catch (error) {
      console.error('Failed to load viewer community state', error)
    }
  }, [])

  const loadPage = useCallback(
    async (nextPage: number, mode: 'replace' | 'append') => {
      setIsLoading(true)

      try {
        const normalizedSearch = deferredSearch.trim()
        const { cards: nextCards, signedUrls: nextUrls } = await fetchCommunityCardsWithUrls(nextPage, 20, {
          search: normalizedSearch,
          template: selectedTemplate,
          category: selectedCategory,
          topic: selectedTopic,
          sort,
          savedOnly,
          authorId: lockedAuthor?.id ?? null,
        })

        const nextIds = nextCards.map((card) => card.card_id)
        await mergeViewerState(nextIds)

        setSignedUrls((current) => (mode === 'append' ? { ...current, ...nextUrls } : nextUrls))
        setHasMore(nextCards.length === 20)
        setPage(nextPage)

        if (mode === 'append') {
          setCards((current) => {
            const seen = new Set(current.map((card) => card.card_id))
            return [...current, ...nextCards.filter((card) => !seen.has(card.card_id))]
          })
        } else {
          setCards(nextCards)
        }
      } catch (error) {
        console.error('Failed to fetch community cards', error)
      } finally {
        setIsLoading(false)
      }
    },
    [deferredSearch, lockedAuthor, mergeViewerState, savedOnly, selectedCategory, selectedTemplate, selectedTopic, sort],
  )

  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true
      return
    }

    const timer = window.setTimeout(() => {
      void loadPage(0, 'replace')
    }, 160)

    return () => window.clearTimeout(timer)
  }, [deferredSearch, selectedTemplate, selectedCategory, selectedTopic, sort, savedOnly, loadPage])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    await loadPage(page + 1, 'append')
  }, [hasMore, isLoading, loadPage, page])

  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return

      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          void loadMore()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [hasMore, isLoading, loadMore],
  )

  async function handleToggleReaction(cardId: string, kind: CommunityReactionKind) {
    const key = kind === 'like' ? 'liked' : 'saved'
    const countKey = kind === 'like' ? 'like_count' : 'save_count'
    const currentState = viewerReactions[cardId] ?? { liked: false, saved: false, reported: false }
    const nextActive = !currentState[key]

    setViewerReactions((current) => ({
      ...current,
      [cardId]: {
        ...currentState,
        [key]: nextActive,
      },
    }))

    setCards((current) =>
      current.map((card) =>
        card.card_id === cardId
          ? {
              ...card,
              [countKey]: Math.max(0, card[countKey] + (nextActive ? 1 : -1)),
            }
          : card,
      ),
    )

    try {
      await toggleCommunityReaction(cardId, kind)
      if (kind === 'save' && savedOnly && !nextActive) {
        setCards((current) => current.filter((card) => card.card_id !== cardId))
      }
    } catch (error) {
      console.error(`Failed to toggle ${kind}`, error)
      setViewerReactions((current) => ({
        ...current,
        [cardId]: currentState,
      }))
      setCards((current) =>
        current.map((card) =>
          card.card_id === cardId
            ? {
                ...card,
                [countKey]: Math.max(0, card[countKey] + (nextActive ? -1 : 1)),
              }
            : card,
        ),
      )
    }
  }

  async function handleReport(cardId: string) {
    const currentState = viewerReactions[cardId] ?? { liked: false, saved: false, reported: false }
    if (currentState.reported) return

    setViewerReactions((current) => ({
      ...current,
      [cardId]: {
        ...currentState,
        reported: true,
      },
    }))

    try {
      await reportCommunityCard(cardId)
    } catch (error) {
      console.error('Failed to report card', error)
      setViewerReactions((current) => ({
        ...current,
        [cardId]: currentState,
      }))
    }
  }

  function resetFilters() {
    setSearchQuery('')
    setSelectedTemplate(null)
    setSelectedCategory(null)
    setSelectedTopic(null)
    setSort('recent')
    setSavedOnly(false)
    setLayout('grid')
  }

  const showingFilters = Boolean(
    searchQuery.trim() ||
      selectedTemplate ||
      selectedCategory ||
      selectedTopic ||
      savedOnly ||
      sort === 'trending',
  )
  const mobileFilterCount =
    (selectedTemplate ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (selectedTopic ? 1 : 0) +
    (savedOnly ? 1 : 0) +
    (sort === 'trending' ? 1 : 0) +
    (layout === 'list' ? 1 : 0)

  if (cards.length === 0) {
    return (
      <div className={styles.feed}>
        <div className={styles.toolbar}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={lockedAuthor ? `Search ${lockedAuthor.name}'s cards...` : 'Search community cards...'}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.empty}>
          <Globe size={48} className={styles.emptyIcon} />
          <h2>
            {lockedAuthor
              ? `${lockedAuthor.name} has no cards in this view`
              : showingFilters
                ? 'No cards match this view'
                : 'Nothing published yet'}
          </h2>
          <p>
            {lockedAuthor
              ? 'Try a different search or return to the full community feed.'
              : showingFilters
                ? 'Clear the filters or try another search.'
                : 'Be the first to share a clean learning card with the community.'}
          </p>
          <div className={styles.emptyActions}>
            {showingFilters ? (
              <button type="button" className={styles.resetButton} onClick={resetFilters}>
                Reset filters
              </button>
            ) : null}
            {lockedAuthor ? (
              <Link href="/community" className={styles.secondaryLink}>
                Back to community
              </Link>
            ) : (
              <>
                <Link href="/scan" className={styles.primaryLink}>
                  Scan note
                </Link>
                <Link href="/cards" className={styles.secondaryLink}>
                  Open archive
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.feed}>
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={
              lockedAuthor ? `Search ${lockedAuthor.name}'s cards...` : 'Search by title, author, topic, or category...'
            }
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
          />
          {searchQuery ? (
            <button type="button" onClick={() => setSearchQuery('')} className={styles.clearSearch}>
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className={styles.mobileActions}>
          <button type="button" className={styles.mobileSheetTrigger} onClick={() => setIsMobileSheetOpen(true)}>
            <span className={styles.mobileSheetTriggerCopy}>
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </span>
            {mobileFilterCount > 0 ? <span className={styles.mobileCount}>{mobileFilterCount}</span> : null}
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.filterStack}>
            <div className={styles.filterRow}>
              <button
                type="button"
                className={`${styles.filterChip} ${selectedTemplate === null ? styles.activeFilter : ''}`}
                onClick={() => setSelectedTemplate(null)}
              >
                All templates
              </button>
              {filterMeta.templates.slice(0, 5).map((template) => (
                <button
                  key={template}
                  type="button"
                  className={`${styles.filterChip} ${selectedTemplate === template ? styles.activeFilter : ''}`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  {template.replace(/-/g, ' ')}
                </button>
              ))}
              {!lockedAuthor ? (
                <button
                  type="button"
                  className={`${styles.filterChip} ${savedOnly ? styles.activeFilter : ''}`}
                  onClick={() => setSavedOnly((current) => !current)}
                >
                  <Bookmark size={14} />
                  <span>Saved</span>
                </button>
              ) : null}
            </div>

            <div className={styles.metaRow}>
              <label className={styles.selectWrap}>
                <span className={styles.selectLabel}>Category</span>
                <select
                  value={selectedCategory ?? 'all'}
                  className={styles.filterSelect}
                  onChange={(event) => setSelectedCategory(event.target.value === 'all' ? null : event.target.value)}
                >
                  <option value="all">All categories</option>
                  {filterMeta.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.selectWrap}>
                <span className={styles.selectLabel}>Topic</span>
                <select
                  value={selectedTopic ?? 'all'}
                  className={styles.filterSelect}
                  onChange={(event) => setSelectedTopic(event.target.value === 'all' ? null : event.target.value)}
                >
                  <option value="all">All topics</option>
                  {filterMeta.topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className={styles.utilityStack}>
            <div className={styles.sortRow}>
              <button
                type="button"
                className={`${styles.sortChip} ${sort === 'recent' ? styles.activeSort : ''}`}
                onClick={() => setSort('recent')}
              >
                Recent
              </button>
              <button
                type="button"
                className={`${styles.sortChip} ${sort === 'trending' ? styles.activeSort : ''}`}
                onClick={() => setSort('trending')}
              >
                <TrendingUp size={14} />
                <span>Trending</span>
              </button>
            </div>

            <div className={styles.viewToggles}>
              <button
                type="button"
                className={`${styles.viewBtn} ${layout === 'grid' ? styles.activeView : ''}`}
                onClick={() => setLayout('grid')}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`${styles.viewBtn} ${layout === 'list' ? styles.activeView : ''}`}
                onClick={() => setLayout('list')}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomSheet open={isMobileSheetOpen} onClose={() => setIsMobileSheetOpen(false)} title="Browse community">
        <div className={styles.sheetSection}>
          <p className={styles.sheetLabel}>Templates</p>
          <div className={styles.filterRow}>
            <button
              type="button"
              className={`${styles.filterChip} ${selectedTemplate === null ? styles.activeFilter : ''}`}
              onClick={() => setSelectedTemplate(null)}
            >
              All templates
            </button>
            {filterMeta.templates.map((template) => (
              <button
                key={template}
                type="button"
                className={`${styles.filterChip} ${selectedTemplate === template ? styles.activeFilter : ''}`}
                onClick={() => setSelectedTemplate(template)}
              >
                {template.replace(/-/g, ' ')}
              </button>
            ))}
            {!lockedAuthor ? (
              <button
                type="button"
                className={`${styles.filterChip} ${savedOnly ? styles.activeFilter : ''}`}
                onClick={() => setSavedOnly((current) => !current)}
              >
                <Bookmark size={14} />
                <span>Saved</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className={styles.sheetSection}>
          <p className={styles.sheetLabel}>Category</p>
          <label className={styles.selectWrap}>
            <span className={styles.selectLabel}>Category</span>
            <select
              value={selectedCategory ?? 'all'}
              className={styles.filterSelect}
              onChange={(event) => setSelectedCategory(event.target.value === 'all' ? null : event.target.value)}
            >
              <option value="all">All categories</option>
              {filterMeta.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.sheetSection}>
          <p className={styles.sheetLabel}>Topic</p>
          <label className={styles.selectWrap}>
            <span className={styles.selectLabel}>Topic</span>
            <select
              value={selectedTopic ?? 'all'}
              className={styles.filterSelect}
              onChange={(event) => setSelectedTopic(event.target.value === 'all' ? null : event.target.value)}
            >
              <option value="all">All topics</option>
              {filterMeta.topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.sheetSection}>
          <p className={styles.sheetLabel}>Sort</p>
          <div className={styles.sortRow}>
            <button
              type="button"
              className={`${styles.sortChip} ${sort === 'recent' ? styles.activeSort : ''}`}
              onClick={() => setSort('recent')}
            >
              Recent
            </button>
            <button
              type="button"
              className={`${styles.sortChip} ${sort === 'trending' ? styles.activeSort : ''}`}
              onClick={() => setSort('trending')}
            >
              <TrendingUp size={14} />
              <span>Trending</span>
            </button>
          </div>
        </div>

        <div className={styles.sheetSection}>
          <p className={styles.sheetLabel}>View</p>
          <div className={styles.viewToggles}>
            <button
              type="button"
              className={`${styles.viewBtn} ${layout === 'grid' ? styles.activeView : ''}`}
              onClick={() => setLayout('grid')}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${layout === 'list' ? styles.activeView : ''}`}
              onClick={() => setLayout('list')}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className={styles.sheetFooter}>
          {showingFilters || layout === 'list' ? (
            <button type="button" className={styles.resetButton} onClick={resetFilters}>
              Reset
            </button>
          ) : null}
          <button type="button" className={styles.primaryLink} onClick={() => setIsMobileSheetOpen(false)}>
            Done
          </button>
        </div>
      </MobileBottomSheet>

      <div className={`${styles.grid} ${layout === 'list' ? styles.list : ''}`}>
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1
          const viewerState = viewerReactions[card.card_id] ?? { liked: false, saved: false, reported: false }

          return (
            <div key={card.card_id} ref={isLast ? lastCardRef : null}>
              <CommunityCard
                card={card}
                imageUrl={card.image_url ? signedUrls[card.image_url] : undefined}
                layout={layout}
                liked={viewerState.liked}
                saved={viewerState.saved}
                reported={viewerState.reported ?? false}
                onToggleLike={() => handleToggleReaction(card.card_id, 'like')}
                onToggleSave={() => handleToggleReaction(card.card_id, 'save')}
                onReport={() => handleReport(card.card_id)}
              />
            </div>
          )
        })}
      </div>

      {isLoading ? (
        <div className={styles.loaderWrap}>
          <Loader2 size={24} className={styles.spinner} />
        </div>
      ) : null}
    </div>
  )
}
