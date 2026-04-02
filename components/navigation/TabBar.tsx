'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, Grid, Library, User } from 'lucide-react'

const tabs = [
  { name: 'Scan', href: '/scan', icon: Camera, activeIcon: Camera },
  { name: 'Cards', href: '/cards', icon: Grid, activeIcon: Grid },
  { name: 'Library', href: '/library', icon: Library, activeIcon: Library },
  { name: 'Profile', href: '/profile', icon: User, activeIcon: User },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="tab-bar glass surface-1">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        const Icon = isActive ? tab.activeIcon : tab.icon

        return (
          <Link key={tab.name} href={tab.href} className={`tab-item ${isActive ? 'active' : ''}`}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="tab-label">{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
