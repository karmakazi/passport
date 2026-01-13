import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}

// Helper to check if we're online and can reach Supabase
export const isOnline = (): boolean => {
  if (typeof window === 'undefined') return false
  return navigator.onLine
}

// Database types
export interface DbUser {
  id: string
  postal_code: string
  device_id: string
  created_at: string
  updated_at: string
}

export interface DbStamp {
  id: string
  user_id: string
  location_id: string
  collected_at: string
}

export interface DbContestEntry {
  id: string
  user_id: string
  submitted_at: string
}

