import 'server-only'

import { start } from 'workflow/api'

import { type CookieSnapshot } from '@/lib/supabase/impersonated'
import { generateSessionWorkflow } from '@/workflows/generate-session'

export async function registerGenerationSession(sessionId: string, cookieSnapshot: CookieSnapshot) {
  await start(generateSessionWorkflow, [{ sessionId, cookieSnapshot }])
}
