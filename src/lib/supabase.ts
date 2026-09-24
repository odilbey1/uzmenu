import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

/**
 * Standard Supabase client instance
 * For general queries and client-side operations
 */
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)

/**
 * Helper to get a typed Supabase client
 */
export function getSupabaseClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

export * from '@/types/database.types'
export { createClient as createBrowserClient } from '@/utils/supabase/client'
export { createClient as createServerClient } from '@/utils/supabase/server'
