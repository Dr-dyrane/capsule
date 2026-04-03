'use server'

import { isCommunitySchemaError } from '@/lib/community/schema'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type UserPreferences = {
  density?: 'focused' | 'detailed'
  specialty?: string
  theme?: 'dark' | 'light'
  auto_publish?: boolean
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

  if (typeof preferences.auto_publish === 'boolean') {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          auto_publish: preferences.auto_publish,
        },
        { onConflict: 'id' },
      )

    if (profileError && !isCommunitySchemaError(profileError)) {
      throw profileError
    }
  }

  revalidatePath('/profile')
  revalidatePath('/scan')
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
