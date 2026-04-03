'use client'

import Link from 'next/link'
import Image from 'next/image'
import { User } from 'lucide-react'

import { APP_IMAGE_BLUR_DATA_URL } from '@/lib/ui/image-loading'
import styles from './UserMenu.module.css'

interface UserMenuProps {
  user: {
    username?: string
    avatar_url?: string
    email?: string
  }
  compact?: boolean
}

export default function UserMenu({ user, compact = false }: UserMenuProps) {
  const displayName = user.username || user.email?.split('@')[0] || 'User'

  return (
    <Link
      href="/profile"
      className={`${styles.trigger} ${compact ? styles.compact : ''}`}
      aria-label={compact ? 'Open profile' : `${displayName} profile`}
    >
      <div className={styles.avatar}>
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={displayName}
            fill
            sizes="28px"
            quality={60}
            placeholder="blur"
            blurDataURL={APP_IMAGE_BLUR_DATA_URL}
          />
        ) : (
          <User size={18} />
        )}
      </div>

      {!compact ? (
        <div className={styles.copy}>
          <span className={styles.username}>{displayName}</span>
          <span className={styles.caption}>Profile</span>
        </div>
      ) : null}
    </Link>
  )
}
