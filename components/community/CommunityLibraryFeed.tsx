'use client'

import { useState } from 'react'
import { Archive, Search, SlidersHorizontal, TrendingUp, X } from 'lucide-react'

import type { CommunityLibraryRecord } from '@/app/actions/community'
import type { CommunityFilterMeta, CommunitySort, CommunityViewerState } from '@/lib/types'
import type { UiDensityMode } from '@/lib/ui/density'
import CommunityLibraryCard from '@/components/community/CommunityLibraryCard'
import MobileBottomSheet from '@/components/ui/MobileBottomSheet'
import styles from './CommunityLibraryFeed.module.css'

type CommunityLibraryFeedProps = {
  libraries: CommunityLibraryRecord[]
  initialViewerState: Record<string, CommunityViewerState>
  totalLibraryCount: number
  filterMeta: CommunityFilterMeta
  densityMode: UiDensityMode
  lockedAuthor?: {
    id: string
    name: string
  } | null
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

export default function CommunityLibraryFeed({
  libraries,
  initialViewerState,
  totalLibraryCount,
  filterMeta,
  densityMode,
  lockedAuthor = null,
}: CommunityLibraryFeedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [sort, setSort] = useState<CommunitySort>('recent')
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const isFocused = densityMode === 'focused'

  const normalizedSearch = normalizeSearchValue(searchQuery)
  const filteredLibraries = libraries
    .filter((library) => {
      if (selectedCategory && library.category !== selectedCategory) {
        return false
      }

      if (selectedTopic && library.concept !== selectedTopic) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const haystack = [
        library.title,
        library.page_label,
        library.page_label?.replace(/^page\s+/i, ''),
        library.author_name,
        library.category,
        library.concept,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedSearch)
    })
    .sort((left, right) => {
      if (sort === 'trending') {
        const trendGap = (right.trend_score ?? 0) - (left.trend_score ?? 0)
        if (trendGap !== 0) {
          return trendGap
        }
      }

      return new Date(right.published_at ?? 0).getTime() - new Date(left.published_at ?? 0).getTime()
    })

  const showingFilters = Boolean(searchQuery.trim() || selectedCategory || selectedTopic || sort === 'trending')
  const mobileFilterCount = (selectedCategory ? 1 : 0) + (selectedTopic ? 1 : 0) + (sort === 'trending' ? 1 : 0)

  function resetFilters() {
    setSearchQuery('')
    setSelectedCategory(null)
    setSelectedTopic(null)
    setSort('recent')
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>{isFocused ? 'Shared libraries' : 'Published libraries'}</h2>
        </div>
        {!isFocused ? <div className={styles.sectionStat}>{totalLibraryCount} total</div> : null}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={lockedAuthor ? `Search ${lockedAuthor.name}'s libraries...` : 'Search libraries, authors, or topics...'}
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

          <button
            type="button"
            className={styles.mobileSheetTrigger}
            onClick={() => setIsMobileSheetOpen(true)}
            aria-label="Open library filters"
          >
            <span className={styles.mobileSheetTriggerCopy}>
              <SlidersHorizontal size={16} />
              <span>{isFocused ? 'Refine' : 'Filters'}</span>
            </span>
            {mobileFilterCount > 0 ? <span className={styles.mobileCount}>{mobileFilterCount}</span> : null}
          </button>
        </div>

        {!isFocused ? (
          <div className={styles.controls}>
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
        ) : null}
      </div>

      <MobileBottomSheet open={isMobileSheetOpen} onClose={() => setIsMobileSheetOpen(false)} title="Refine libraries">
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

        <div className={styles.sheetFooter}>
          {showingFilters ? (
            <button type="button" className={styles.resetButton} onClick={resetFilters}>
              Reset
            </button>
          ) : null}
          <button type="button" className={styles.doneButton} onClick={() => setIsMobileSheetOpen(false)}>
            Done
          </button>
        </div>
      </MobileBottomSheet>

      {filteredLibraries.length > 0 ? (
        <div className={styles.grid}>
          {filteredLibraries.map((library) => (
            <CommunityLibraryCard
              key={library.session_id}
              library={library}
              liked={initialViewerState[library.session_id]?.liked ?? false}
              saved={initialViewerState[library.session_id]?.saved ?? false}
              reported={initialViewerState[library.session_id]?.reported ?? false}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Archive size={34} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No libraries match this view</p>
          <p className={styles.emptyCopy}>
            Try another search or clear the filters to bring more shared collections back into view.
          </p>
          {showingFilters ? (
            <button type="button" className={styles.resetButton} onClick={resetFilters}>
              Reset filters
            </button>
          ) : null}
        </div>
      )}
    </section>
  )
}
