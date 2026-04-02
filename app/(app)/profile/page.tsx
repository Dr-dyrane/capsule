import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LogOut, Settings2, ShieldCheck, User } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

import styles from '../AppScreen.module.css'
import profileStyles from './ProfilePage.module.css'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  async function signOut() {
    'use server'
    const serverSupabase = await createClient()
    await serverSupabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <User size={14} aria-hidden="true" />
          <span>Profile</span>
        </div>
        <h1 className={styles.title}>Your Capsule account.</h1>
        <p className={styles.copy}>Manage your workspace details and session access from one place.</p>
      </header>

      <div className={profileStyles.card}>
        <div className={profileStyles.header}>
          <div className={profileStyles.avatar}>
            <User size={32} />
          </div>
          <div className={profileStyles.userInfo}>
            <p className={profileStyles.name}>{user.email?.split('@')[0]}</p>
            <p className={profileStyles.email}>{user.email}</p>
          </div>
        </div>

        <div className={profileStyles.actions}>
          <button className={profileStyles.actionItem}>
            <Settings2 size={18} />
            <span>Preferences</span>
          </button>
          <Link href="/" className={profileStyles.actionItem}>
            <ShieldCheck size={18} />
            <span>Back to site</span>
          </Link>
          <form action={signOut}>
            <button type="submit" className={`${profileStyles.actionItem} ${profileStyles.destructive}`}>
              <LogOut size={20} />
              <span>Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
