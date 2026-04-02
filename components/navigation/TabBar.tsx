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

      <style jsx>{`
        .tab-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          padding: 8px 0 calc(8px + var(--safe-area-inset-bottom, 0px));
          z-index: 1000;
        }
        
        .tab-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-tertiary);
          transition: color var(--duration-micro) var(--ease-standard),
                      transform var(--duration-micro) var(--ease-apple);
          min-width: 64px;
        }
        
        .tab-item.active {
          color: var(--accent);
        }
        
        .tab-item:active {
          transform: scale(0.92);
        }
        
        .tab-label {
          font-size: 10px;
          font-weight: 500;
          opacity: 0;
          transform: translateY(2px);
          transition: all var(--duration-micro) var(--ease-standard);
        }
        
        .tab-item.active .tab-label {
          opacity: 1;
          transform: translateY(0);
        }

        @media (min-width: 768px) {
          .tab-bar {
            display: none;
          }
        }
      `}</style>
    </nav>
  )
}
