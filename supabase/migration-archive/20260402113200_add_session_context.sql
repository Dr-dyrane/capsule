-- Migration to add session_context to sessions table
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS session_context TEXT;
