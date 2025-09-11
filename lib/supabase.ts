import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our Heroes table
export interface Hero {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  name: string
  description: string
  system_prompt: string
  class?: string
  race?: string
  level?: number
  alignment?: string
  appearance?: string
  backstory?: string
  personality_traits?: string[]
  avatar_url?: string
}

export interface CreateHeroInput {
  name: string
  description: string
  system_prompt: string
  class?: string
  race?: string
  level?: number
  alignment?: string
  appearance?: string
  backstory?: string
  personality_traits?: string[]
  avatar_url?: string
}