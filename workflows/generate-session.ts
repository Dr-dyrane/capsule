import { claimNextCardJob, processCardJob, syncGenerationRunState } from '@/lib/generation/card-worker'
import { createImpersonatedClient, type CookieSnapshot } from '@/lib/supabase/impersonated'

export type GenerateSessionWorkflowPayload = {
  sessionId: string
  cookieSnapshot: CookieSnapshot
}

export async function generateSessionWorkflow(payload: GenerateSessionWorkflowPayload) {
  'use workflow'

  while (true) {
    const jobId = await claimQueuedCardJob(payload)

    if (!jobId) {
      await finalizeGenerationRun(payload)
      return { sessionId: payload.sessionId, status: 'settled' as const }
    }

    await runQueuedCardJob(payload, jobId)
  }
}

async function claimQueuedCardJob(payload: GenerateSessionWorkflowPayload) {
  'use step'

  const supabase = createImpersonatedClient(payload.cookieSnapshot)
  return await claimNextCardJob(supabase, payload.sessionId)
}

async function runQueuedCardJob(payload: GenerateSessionWorkflowPayload, jobId: string) {
  'use step'

  const supabase = createImpersonatedClient(payload.cookieSnapshot)
  return await processCardJob(supabase, jobId, {
    skipClaim: true,
    rethrowOnHandledError: false,
  })
}

async function finalizeGenerationRun(payload: GenerateSessionWorkflowPayload) {
  'use step'

  const supabase = createImpersonatedClient(payload.cookieSnapshot)
  return await syncGenerationRunState(supabase, payload.sessionId)
}
