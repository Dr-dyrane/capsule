import { Camera, Grid, Library, Globe } from 'lucide-react'

export const navigationItems = [
  { name: 'Scan', href: '/scan', icon: Camera },
  { name: 'Cards', href: '/cards', icon: Grid },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Community', href: '/community', icon: Globe },
] as const
