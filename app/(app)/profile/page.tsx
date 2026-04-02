import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, LogOut, Settings, Shield } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header">
        <h1 className="title-large">Profile</h1>
      </header>

      <div className="profile-card surface-1 glass animate-slide-up">
        <div className="profile-header">
          <div className="avatar">
            <User size={32} />
          </div>
          <div className="user-info">
            <p className="title-2">{user.email?.split('@')[0]}</p>
            <p className="caption">{user.email}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-item">
            <Settings size={20} />
            <span className="body">Settings</span>
          </button>
          <button className="action-item">
            <Shield size={20} />
            <span className="body">Privacy</span>
          </button>
          <form action={signOut}>
            <button type="submit" className="action-item destructive">
              <LogOut size={20} />
              <span className="body">Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
