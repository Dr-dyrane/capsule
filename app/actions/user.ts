'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type UserPreferences = {
  density?: 'focused' | 'detailed'
  specialty?: string
  theme?: 'dark' | 'light'
}

/**
 * Updates the current user's preferences in Supabase Auth user_metadata.
 * This avoids needing a separate 'profiles' table for simple UI settings.
 */
export async function updateUserPreferences(preferences: UserPreferences) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  const { error } = await supabase.auth.updateUser({
    data: { 
      preferences: {
        ...(user.user_metadata.preferences || {}),
        ...preferences
      }
    }
  })

  if (error) throw error

  revalidatePath('/profile')
  return { success: true }
}

/**
 * Sign out helper for the Profile UI.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
