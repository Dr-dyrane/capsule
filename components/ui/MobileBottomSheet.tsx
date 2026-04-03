'use client'

import type { ReactNode } from 'react'

import AdaptiveSheet from './AdaptiveSheet'

type MobileBottomSheetProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function MobileBottomSheet({ open, onClose, title, children }: MobileBottomSheetProps) {
  return (
    <AdaptiveSheet open={open} onClose={onClose} title={title} size="wide" closeLabel={`Close ${title}`}>
      {children}
    </AdaptiveSheet>
  )
}
