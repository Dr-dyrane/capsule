import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/scan')
  }

  async function login(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      redirect('/login?error=Could not authenticate user')
    }

    redirect('/login?message=Check your email for the login link')
  }

  return (
    <main className="auth-container animate-fade-in">
      <div className="auth-card glass surface-1 animate-slide-up">
        <h1 className="title-1">Capsule</h1>
        <p className="subhead">Distill notes into visual knowledge</p>
        
        <form action={login} className="auth-form">
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            className="auth-input surface-2"
          />
          <button type="submit" className="auth-button">
            Continue
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="caption">By continuing, you agree to our terms.</p>
        </div>
      </div>
    </main>
  )
}
