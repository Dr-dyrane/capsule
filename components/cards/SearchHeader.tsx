'use client'

import { useState } from 'react'
import { Search, X, ChevronDown, List, LayoutGrid, SlidersHorizontal } from 'lucide-react'
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
}

export default function SearchHeader({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  layout,
  setLayout,
  categories,
}: SearchHeaderProps) {
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)
  const mobileFilterCount = (selectedCategory ? 1 : 0) + (layout === 'list' ? 1 : 0)

  return (
    <header className={styles.libraryHeader}>
      <div className={styles.searchRow}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={styles.clearSearch}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.mobileActions}>
          <button
            type="button"
            className={styles.mobileSheetTrigger}
            onClick={() => setIsMobileSheetOpen(true)}
            aria-label="Open filters"
          >
            <span className={styles.mobileSheetTriggerCopy}>
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </span>
            {mobileFilterCount > 0 ? <span className={styles.mobileCount}>{mobileFilterCount}</span> : null}
          </button>
        </div>
      </div>

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
          {categories.length > 4 && (
             <div className={styles.moreCategories}>
                <ChevronDown size={14} />
             </div>
          )}
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

      <MobileBottomSheet open={isMobileSheetOpen} onClose={() => setIsMobileSheetOpen(false)} title="Browse cards">
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
