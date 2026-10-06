import { redirect } from 'next/navigation'
import { createClient } from './server'

export async function requireSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (error) throw new Error('Hisob huquqlarini tekshirib bo‘lmadi. Qayta urinib ko‘ring.')
  if (profile?.role !== 'super_admin') redirect('/dashboard')
  return { supabase, user }
}
