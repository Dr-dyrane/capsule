'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Camera, Grid, Library, User, Menu } from 'lucide-react'

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
        <div className="logo">C</div>
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

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 240px;
          display: flex;
          flex-direction: column;
          padding: var(--space-24);
          z-index: 1000;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: var(--space-12);
          margin-bottom: var(--space-48);
          padding: 0 var(--space-8);
        }

        .logo {
          width: 32px;
          height: 32px;
          background-color: var(--accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--space-12);
          padding: var(--space-12);
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all var(--duration-micro) var(--ease-standard);
        }

        .nav-item:hover {
          background-color: var(--surface-2);
          color: var(--text-primary);
        }

        .nav-item.active {
          background-color: var(--surface-3);
          color: var(--accent);
          font-weight: 600;
        }

        .nav-item:active {
          transform: scale(0.98);
        }

        @media (max-width: 767px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </aside>
  )
}
