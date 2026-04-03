'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

type GenerationContextValue = {
  activeGenerationCount: number
}

const GenerationContext = createContext<GenerationContextValue>({
  activeGenerationCount: 0,
})

async function fetchActiveGenerationCount() {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('generation_runs')
    .select('*', { count: 'exact', head: true })
    .in('status', ['queued', 'running', 'error'])

  if (error) {
    throw error
  }

  return count ?? 0
}

export function GenerationProvider({
  initialActiveGenerationCount,
  children,
}: {
  initialActiveGenerationCount: number
  children: React.ReactNode
}) {
  const [activeGenerationCount, setActiveGenerationCount] = useState(initialActiveGenerationCount)

  useEffect(() => {
    const supabase = createClient()

    const refresh = () => {
      void fetchActiveGenerationCount()
        .then(setActiveGenerationCount)
        .catch((error) => {
          console.error('Failed to refresh generation count:', error)
        })
    }

    refresh()

    const channel = supabase
      .channel('generation-runs-shell')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'generation_runs' },
        refresh,
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  const value = useMemo(
    () => ({
      activeGenerationCount,
    }),
    [activeGenerationCount],
  )

  return <GenerationContext.Provider value={value}>{children}</GenerationContext.Provider>
}

export function useGeneration() {
  return useContext(GenerationContext)
}
