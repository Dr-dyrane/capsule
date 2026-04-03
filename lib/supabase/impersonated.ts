import 'server-only'
import { createServerClient } from '@supabase/ssr'

export type CookieSnapshot = Array<{
  name: string
  value: string
}>

export function createImpersonatedClient(cookieSnapshot: CookieSnapshot) {
  const jar = new Map(cookieSnapshot.map((cookie) => [cookie.name, cookie.value]))

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Array.from(jar.entries()).map(([name, value]) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            jar.set(cookie.name, cookie.value)
          }
        },
      },
    },
  )
}
