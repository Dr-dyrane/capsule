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
          <button type="submit" className="auth-button accent">
            Continue
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="caption">By continuing, you agree to our terms.</p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--canvas);
          padding: var(--space-24);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: var(--space-40);
          border-radius: var(--radius-xl);
          text-align: center;
          box-shadow: var(--shadow-xl);
        }
        .auth-card h1 {
          margin-bottom: var(--space-8);
        }
        .auth-card p {
          margin-bottom: var(--space-32);
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-16);
        }
        .auth-input {
          padding: var(--space-16);
          border-radius: var(--radius-md);
          font-size: 17px;
          transition: background-color var(--duration-micro) var(--ease-standard);
        }
        .auth-input:focus {
          background-color: var(--surface-3);
        }
        .auth-button {
          padding: var(--space-16);
          border-radius: var(--radius-md);
          font-size: 17px;
          font-weight: 600;
          background-color: var(--accent);
          color: white;
          transition: background-color var(--duration-micro) var(--ease-standard),
                      transform var(--duration-micro) var(--ease-apple);
        }
        .auth-button:hover {
          background-color: var(--accent-hover);
        }
        .auth-button:active {
          transform: scale(0.98);
        }
        .auth-footer {
          margin-top: var(--space-32);
        }
      `}</style>
    </main>
  )
}
