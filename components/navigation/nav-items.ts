import { Camera, Grid, Library, User } from 'lucide-react'

export const navigationItems = [
  { name: 'Scan', href: '/scan', icon: Camera },
  { name: 'Cards', href: '/cards', icon: Grid },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Profile', href: '/profile', icon: User },
] as const
