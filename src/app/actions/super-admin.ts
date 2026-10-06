'use server'

import { redirect } from 'next/navigation'
import { requireSuperAdmin } from '@/utils/supabase/authorization'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'
import type { SuperAdminStats } from '@/types/database.types'

export async function getDashboardStats(): Promise<SuperAdminStats> {
  const fallbackStats: SuperAdminStats = {
    total_restaurants: 0,
    total_admins: 0,
    total_menus: 0,
    total_items: 0,
    total_categories: 0,
    total_qr_scans: 0,
  }

  try {
    const { supabase } = await requireSuperAdmin()
    const { data, error } = await supabase.rpc('get_super_admin_stats')
    if (error || !data) {
      console.error('getDashboardStats error:', error)
      return fallbackStats
    }
    return data as unknown as SuperAdminStats
  } catch (err) {
    console.error('getDashboardStats unexpected error:', err)
    return fallbackStats
  }
}

export async function getAllRestaurants() {
  try {
    const { supabase } = await requireSuperAdmin()
    const { data, error } = await supabase.from('restaurants').select(`
      *, profiles:user_id (id, email, full_name, role), menus (id, name, is_active)
    `).order('created_at', { ascending: false })
    if (error) {
      console.error('getAllRestaurants error:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('getAllRestaurants unexpected error:', err)
    return []
  }
}

/**
 * Create a new admin user + restaurant in one step.
 * Uses service_role to create the auth user.
 */
export async function createAdminWithRestaurant(formData: FormData) {
  await requireSuperAdmin()

  const adminEmail = formData.get('email') as string
  const adminPassword = formData.get('password') as string
  const adminFullName = formData.get('fullName') as string
  const restaurantName = formData.get('restaurantName') as string
  let slug = (formData.get('slug') as string)?.toLowerCase().trim()
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const currency = (formData.get('currency') as string) || 'UZS'

  // Validation
  if (!adminEmail || !adminPassword) {
    return { error: 'Admin email va parolini kiritish majburiy.' }
  }
  if (adminPassword.length < 6) {
    return { error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak.' }
  }
  if (!restaurantName) {
    return { error: 'Restoran nomini kiritish majburiy.' }
  }

  // Generate slug if missing
  if (!slug) {
    slug = restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  if (!slug) {
    slug = `restoran-${Math.random().toString(36).substring(2, 7)}`
  }

  const adminSupabase = createAdminClient()

  // 1. Create auth user via admin API
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      full_name: adminFullName || '',
      plain_password: adminPassword,
    },
  })

  if (authError) {
    if (authError.message?.includes('already been registered')) {
      return { error: 'Bu email allaqachon ro\'yxatdan o\'tgan.' }
    }
    return { error: authError.message || 'Admin foydalanuvchi yaratishda xatolik.' }
  }

  if (!authData.user) {
    return { error: 'Foydalanuvchi yaratilmadi. Qaytadan urinib ko\'ring.' }
  }

  const newUserId = authData.user.id

  // 2. Update profile role to 'admin' (trigger already created the profile)
  const { error: profileError } = await adminSupabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', newUserId)

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(newUserId)
    return { error: 'Admin profilini saqlab bo?lmadi. Qayta urinib ko?ring.' }
  }

  // 3. Create restaurant linked to the new admin
  const { error: restaurantError } = await adminSupabase
    .from('restaurants')
    .insert({
      user_id: newUserId,
      name: restaurantName,
      slug,
      address: address || null,
      phone: phone || null,
      currency,
      languages: ['uz', 'ru', 'en'],
    })

  if (restaurantError) {
    // Cleanup: delete the created user if restaurant creation fails
    await adminSupabase.auth.admin.deleteUser(newUserId)

    if (restaurantError.code === '23505') {
      return { error: 'Bu slug (havola) bilan restoran allaqachon mavjud. Boshqa slug tanlang.' }
    }
    return { error: restaurantError.message || 'Restoran yaratishda xatolik yuz berdi.' }
  }

  // 4. Create default menu for the restaurant
  const { data: restaurant } = await adminSupabase
    .from('restaurants')
    .select('id')
    .eq('user_id', newUserId)
    .single()

  if (restaurant) {
    const { error: menuError } = await adminSupabase
      .from('menus')
      .insert({
        restaurant_id: restaurant.id,
        name: 'Asosiy menyu',
        is_active: true,
      })
    if (menuError) {
      await adminSupabase.auth.admin.deleteUser(newUserId)
      return { error: 'Menyuni saqlab bo?lmadi. Qayta urinib ko?ring.' }
    }
  } else {
    await adminSupabase.auth.admin.deleteUser(newUserId)
    return { error: 'Restoranni saqlab bo?lmadi. Qayta urinib ko?ring.' }
  }

  revalidatePath('/super-admin', 'layout')
  redirect('/super-admin/restaurants')
}

/**
 * Update restaurant details (super admin).
 */
export async function updateRestaurantByAdmin(restaurantId: string, formData: FormData) {
  await requireSuperAdmin()

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const currency = (formData.get('currency') as string) || 'UZS'

  if (!name) {
    return { error: 'Restoran nomini kiritish majburiy.' }
  }

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from('restaurants')
    .update({
      name,
      address: address || null,
      phone: phone || null,
      currency,
    })
    .eq('id', restaurantId)

  if (error) {
    return { error: error.message || 'Yangilashda xatolik yuz berdi.' }
  }

  revalidatePath('/super-admin', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/r/[slug]', 'page')
  return { success: true }
}

/**
 * Delete a restaurant and its admin user.
 */
export async function deleteRestaurantAndAdmin(restaurantId: string) {
  await requireSuperAdmin()
  const adminSupabase = createAdminClient()

  // Get the admin user_id before deleting the restaurant
  const { data: restaurant } = await adminSupabase
    .from('restaurants')
    .select('user_id')
    .eq('id', restaurantId)
    .single()

  if (!restaurant) {
    return { error: 'Restoran topilmadi.' }
  }

  // Delete the auth user (cascades to profile, then restaurant via FK)
  const { error } = await adminSupabase.auth.admin.deleteUser(restaurant.user_id)

  if (error) {
    return { error: error.message || 'O\'chirishda xatolik yuz berdi.' }
  }

  revalidatePath('/super-admin', 'layout')
  redirect('/super-admin/restaurants')
}

/**
 * Update an admin's password and keep plain_password in sync for Super Admin view.
 */
export async function updateAdminPassword(userId: string, newPassword: string) {
  await requireSuperAdmin()

  if (!newPassword || newPassword.length < 6) {
    return { error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak.' }
  }

  const adminSupabase = createAdminClient()
  const { data: userData, error: getUserError } = await adminSupabase.auth.admin.getUserById(userId)

  if (getUserError || !userData?.user) {
    return { error: 'Foydalanuvchi topilmadi.' }
  }

  const currentMeta = userData.user.user_metadata || {}

  const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
    password: newPassword,
    user_metadata: {
      ...currentMeta,
      plain_password: newPassword,
    },
  })

  if (error) {
    return { error: error.message || 'Parolni yangilashda xatolik yuz berdi.' }
  }

  revalidatePath('/super-admin', 'layout')
  revalidatePath('/dashboard', 'layout')
  revalidatePath('/r/[slug]', 'page')
  return { success: true }
}
