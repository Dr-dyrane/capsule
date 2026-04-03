import 'server-only'
import { cookies } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { createImpersonatedClient, type CookieSnapshot } from '@/lib/supabase/impersonated'
import { processCardJob, syncGenerationRunState } from './card-worker'

type WorkerState = {
  interval: NodeJS.Timeout | null
  authBySession: Map<string, CookieSnapshot>
  locks: Set<string>
}

declare global {
  var __capsuleGenerationWorker: WorkerState | undefined
}

function getWorkerState(): WorkerState {
  if (!globalThis.__capsuleGenerationWorker) {
    globalThis.__capsuleGenerationWorker = {
      interval: null,
      authBySession: new Map(),
      locks: new Set(),
    }
  }

  return globalThis.__capsuleGenerationWorker
}

async function processNextQueuedJob(sessionId: string, cookieSnapshot: CookieSnapshot) {
  const supabase = createImpersonatedClient(cookieSnapshot)

  const { data: run, error: runError } = await supabase
    .from('generation_runs')
    .select('id, status')
    .eq('session_id', sessionId)
    .maybeSingle()

  if (runError) {
    throw runError
  }

  if (!run || run.status === 'complete' || run.status === 'cancelled') {
    getWorkerState().authBySession.delete(sessionId)
    return
  }

  const { data: nextJob, error: nextJobError } = await supabase
    .from('card_jobs')
    .select('id')
    .eq('session_id', sessionId)
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (nextJobError) {
    throw nextJobError
  }

  if (!nextJob) {
    await syncGenerationRunState(supabase, sessionId)
    return
  }

  await processCardJob(supabase, nextJob.id)
}

async function pumpSession(sessionId: string) {
  const state = getWorkerState()
  if (state.locks.has(sessionId)) {
    return
  }

  const cookieSnapshot = state.authBySession.get(sessionId)
  if (!cookieSnapshot) {
    return
  }

  state.locks.add(sessionId)

  try {
    await processNextQueuedJob(sessionId, cookieSnapshot)
  } catch (error) {
    console.error(`Background generation failed for session ${sessionId}:`, error)
  } finally {
    state.locks.delete(sessionId)
  }
}

function ensureWorkerStarted() {
  const state = getWorkerState()
  if (state.interval) {
    return
  }

  state.interval = setInterval(() => {
    const sessions = Array.from(state.authBySession.keys())
    for (const sessionId of sessions) {
      void pumpSession(sessionId)
    }
  }, 1500)
}

export function registerGenerationSession(sessionId: string, cookieSnapshot: CookieSnapshot) {
  const state = getWorkerState()
  state.authBySession.set(sessionId, cookieSnapshot)
  ensureWorkerStarted()
  void pumpSession(sessionId)
}

export async function registerGeneratingSessionsForCurrentUser() {
  const cookieStore = await cookies()
  const cookieSnapshot = cookieStore.getAll().map(({ name, value }) => ({ name, value }))
  const supabase = await createClient()

  const { data: runs, error } = await supabase
    .from('generation_runs')
    .select('session_id, status')
    .in('status', ['queued', 'running', 'error'])

  if (error) {
    console.error('Unable to register generation runs for current user:', error)
    return
  }

  for (const run of runs ?? []) {
    registerGenerationSession(run.session_id, cookieSnapshot)
  }
}
