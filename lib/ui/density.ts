export type UiDensityMode = 'focused' | 'detailed'

type DensityUser =
  | {
      user_metadata?: {
        preferences?: {
          density?: string | null
        }
      }
    }
  | null
  | undefined

export function getUiDensity(user: DensityUser): UiDensityMode {
  return user?.user_metadata?.preferences?.density === 'detailed' ? 'detailed' : 'focused'
}
