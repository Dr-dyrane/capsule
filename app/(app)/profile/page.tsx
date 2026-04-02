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
          <div className="avatar accent">
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
          <form action={signOut} className="w-full">
            <button type="submit" className="action-item destructive">
              <LogOut size={20} />
              <span className="body">Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .page-header { margin-bottom: var(--space-32); }
        .profile-card {
          padding: var(--space-32);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-40);
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: var(--space-20);
        }
        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--accent);
          color: white;
        }
        .profile-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        .action-item {
          display: flex;
          align-items: center;
          gap: var(--space-16);
          padding: var(--space-16);
          width: 100%;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all var(--duration-micro) var(--ease-standard);
        }
        .action-item:hover {
          background-color: var(--surface-2);
          color: var(--text-primary);
        }
        .action-item.destructive {
          color: var(--destructive);
        }
        .action-item.destructive:hover {
          background-color: rgba(255, 69, 58, 0.1);
        }
      `}</style>
    </div>
  )
}
