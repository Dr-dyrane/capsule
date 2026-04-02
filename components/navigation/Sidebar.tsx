'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, Grid, Library, User } from 'lucide-react'

const items = [
  { name: 'Scan', href: '/scan', icon: Camera },
  { name: 'Cards', href: '/cards', icon: Grid },
  { name: 'Library', href: '/library', icon: Library },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar glass surface-1">
      <div className="sidebar-header">
        <div className="logo-icon">C</div>
        <span className="app-name title-2">Capsule</span>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span className="nav-label">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
