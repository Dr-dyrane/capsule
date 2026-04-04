import type { LucideIcon } from 'lucide-react'
import { Brain, Camera, Grid, Library, Globe } from 'lucide-react'

export type NavigationItem = {
  name: string
  href: string
  icon: LucideIcon
  mobilePrimary?: boolean
}

export const navigationItems: NavigationItem[] = [
  { name: 'Scan', href: '/scan', icon: Camera },
  { name: 'Review', href: '/review', icon: Brain, mobilePrimary: true },
  { name: 'Cards', href: '/cards', icon: Grid },
  { name: 'Library', href: '/library', icon: Library, mobilePrimary: true },
  { name: 'Community', href: '/community', icon: Globe, mobilePrimary: true },
]

export const mobilePrimaryNavigationItems = navigationItems.filter((item) => item.mobilePrimary)
