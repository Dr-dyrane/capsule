'use client'

import { useState } from 'react'
import { ChevronDown, LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react'

import type { UiDensityMode } from '@/lib/ui/density'
import MobileBottomSheet from '@/components/ui/MobileBottomSheet'

import styles from './CardLibrary.module.css'

interface SearchHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (cat: string | null) => void
  layout: 'grid' | 'list'
  setLayout: (layout: 'grid' | 'list') => void
  categories: string[]
  densityMode: UiDensityMode
}

export default function SearchHeader({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  layout,
  setLayout,
  categories,
  densityMode,
}: SearchHeaderProps) {
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const mobileFilterCount = (selectedCategory ? 1 : 0) + (layout === 'list' ? 1 : 0)
  const isFocused = densityMode === 'focused'

  return (
    <header className={styles.libraryHeader}>
      <div className={styles.searchRow}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search titles or concepts..."
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

        <div className={`${styles.mobileActions} ${isFocused ? styles.desktopActions : ''}`}>
          <button
            type="button"
            className={styles.mobileSheetTrigger}
            onClick={() => setIsMobileSheetOpen(true)}
            aria-label="Open archive filters"
          >
            <span className={styles.mobileSheetTriggerCopy}>
              <SlidersHorizontal size={16} />
              <span>{isFocused ? 'Refine' : 'Filters'}</span>
            </span>
            {mobileFilterCount > 0 ? <span className={styles.mobileCount}>{mobileFilterCount}</span> : null}
          </button>
        </div>
      </div>

      {isFocused && mobileFilterCount > 0 ? (
        <div className={styles.filterSummary} role="status" aria-live="polite">
          {selectedCategory ? <span className={styles.summaryChip}>{selectedCategory}</span> : null}
          {layout === 'list' ? <span className={styles.summaryChip}>List view</span> : null}
          <button
            type="button"
            className={styles.summaryClear}
            onClick={() => {
              setSelectedCategory(null)
              setLayout('grid')
            }}
          >
            Clear
          </button>
        </div>
      ) : null}

      {!isFocused ? (
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <button
              className={`${styles.filterChip} ${!selectedCategory ? styles.activeFilter : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                className={`${styles.filterChip} ${selectedCategory === cat ? styles.activeFilter : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
            {categories.length > 4 ? (
              <div className={styles.moreCategories}>
                <ChevronDown size={14} />
              </div>
            ) : null}
          </div>

          <div className={styles.viewToggles}>
            <button
              className={`${styles.viewBtn} ${layout === 'grid' ? styles.activeView : ''}`}
              onClick={() => setLayout('grid')}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`${styles.viewBtn} ${layout === 'list' ? styles.activeView : ''}`}
              onClick={() => setLayout('list')}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      ) : null}

      <MobileBottomSheet open={isMobileSheetOpen} onClose={() => setIsMobileSheetOpen(false)} title="Refine archive">
        <div className={styles.sheetSection}>
          <p className={styles.sheetLabel}>Category</p>
          <div className={styles.filters}>
            <button
              className={`${styles.filterChip} ${!selectedCategory ? styles.activeFilter : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterChip} ${selectedCategory === cat ? styles.activeFilter : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sheetSection}>
          <p className={styles.sheetLabel}>View</p>
          <div className={styles.viewToggles}>
            <button
              className={`${styles.viewBtn} ${layout === 'grid' ? styles.activeView : ''}`}
              onClick={() => setLayout('grid')}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`${styles.viewBtn} ${layout === 'list' ? styles.activeView : ''}`}
              onClick={() => setLayout('list')}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className={styles.sheetFooter}>
          {selectedCategory || layout === 'list' ? (
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => {
                setSelectedCategory(null)
                setLayout('grid')
              }}
            >
              Reset
            </button>
          ) : null}
          <button type="button" className={styles.primaryLink} onClick={() => setIsMobileSheetOpen(false)}>
            Done
          </button>
        </div>
      </MobileBottomSheet>
    </header>
  )
}
