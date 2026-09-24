'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email va parolni to\'liq kiriting.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const errorMsg = error.message?.toLowerCase().includes('invalid login credentials')
      ? 'Email yoki parol noto‘g‘ri kiritildi. Iltimos, qaytadan tekshirib ko‘ring.'
      : (error.message || 'Kirishda xatolik yuz berdi. Ma\'lumotlarni tekshiring.')
    return { error: errorMsg }
  }

  // Fetch user role to redirect appropriately
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'super_admin') {
      redirect('/super-admin')
    }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
