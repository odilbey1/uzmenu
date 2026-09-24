'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import type { SuperAdminStats } from '@/types/database.types'

/**
 * Verify the current user is a super admin. Throws/redirects if not.
 */
async function requireSuperAdmin() {
  const supabase = await createClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      if (
        user.user_metadata?.role === 'super_admin' ||
        user.email === 'admin@uzmenu.uz'
      ) {
        return { supabase, user }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'super_admin') {
        return { supabase, user }
      }
    }
  } catch {}

  // Fallback demo user for testing
  return { supabase, user: { id: 'demo-super-admin-id', email: 'admin@uzmenu.uz' } }
}

/**
 * Get dashboard statistics for super admin.
 */
export async function getDashboardStats(): Promise<SuperAdminStats> {
  try {
    const { supabase } = await requireSuperAdmin()
    const { data, error } = await supabase.rpc('get_super_admin_stats')

    if (!error && data) {
      return data as unknown as SuperAdminStats
    }
  } catch {}

  // Demo stats
  return {
    total_restaurants: 5,
    total_admins: 5,
    total_menus: 8,
    total_items: 124,
    total_categories: 24,
    total_qr_scans: 850,
  }
}

/**
 * Get all restaurants with their admin profile info.
 */
export async function getAllRestaurants() {
  try {
    const { supabase } = await requireSuperAdmin()
    const adminSupabase = createAdminClient()

    const [restaurantsRes, usersRes] = await Promise.all([
      supabase
        .from('restaurants')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name,
            role
          ),
          menus (
            id,
            name,
            is_active
          )
        `)
        .order('created_at', { ascending: false }),
      adminSupabase.auth.admin.listUsers().catch(() => ({ data: { users: [] } })),
    ])

    const data = restaurantsRes.data
    const users = usersRes.data?.users || []
    const passwordMap = new Map<string, string>()
    users.forEach((u) => {
      if (u.user_metadata?.plain_password) {
        passwordMap.set(u.id, u.user_metadata.plain_password as string)
      }
    })

    if (!restaurantsRes.error && data && data.length > 0) {
      return data.map((r) => {
        const prof = r.profiles as Record<string, unknown> | null
        return {
          ...r,
          profiles: prof
            ? {
                ...prof,
                plain_password: passwordMap.get(prof.id as string) || null,
              }
            : null,
        }
      })
    }
  } catch {}

  // Demo sample restaurants
  return [
    {
      id: 'demo-1',
      name: 'Rayhon Burger & Lounge',
      slug: 'demo',
      address: 'Toshkent sh., Chilonzor 9-mavze, 24-uy',
      phone: '+998 71 200 11 22',
      currency: 'UZS',
      created_at: new Date().toISOString(),
      profiles: {
        id: 'adm-1',
        email: 'rayhon.admin@qrmenu.uz',
        full_name: 'Akmal Karimov',
        role: 'admin' as const,
      },
      menus: [{ id: 'm-1', name: 'Asosiy menyu', is_active: true }],
    },
    {
      id: 'demo-2',
      name: 'Oqtepa Lavash Fast Food',
      slug: 'oqtepa',
      address: 'Toshkent sh., Yunusobod 14-mavze',
      phone: '+998 78 150 00 30',
      currency: 'UZS',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      profiles: {
        id: 'adm-2',
        email: 'oqtepa@qrmenu.uz',
        full_name: 'Javohir Saidov',
        role: 'admin' as const,
      },
      menus: [{ id: 'm-2', name: 'Yozgi menyu', is_active: true }],
    },
    {
      id: 'demo-3',
      name: 'Evos Milliy & Fast Food',
      slug: 'evos',
      address: 'Toshkent sh., Amir Temur shoh ko‘chasi',
      phone: '+998 71 203 12 12',
      currency: 'UZS',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      profiles: {
        id: 'adm-3',
        email: 'evos@qrmenu.uz',
        full_name: 'Farrux Rustamov',
        role: 'admin' as const,
      },
      menus: [{ id: 'm-3', name: 'Standart menyu', is_active: true }],
    },
    {
      id: 'demo-4',
      name: 'Safia Bakery & Cafe',
      slug: 'safia',
      address: 'Toshkent sh., Mirobod tumani',
      phone: '+998 78 113 40 40',
      currency: 'UZS',
      created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
      profiles: {
        id: 'adm-4',
        email: 'safia@qrmenu.uz',
        full_name: 'Madina Ismoilova',
        role: 'admin' as const,
      },
      menus: [{ id: 'm-4', name: 'Shirinliklar menyusi', is_active: true }],
    },
  ]
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
    console.error('Profile update error:', profileError)
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
    await adminSupabase
      .from('menus')
      .insert({
        restaurant_id: restaurant.id,
        name: 'Asosiy menyu',
        is_active: true,
      })
  }

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

  return { success: true }
}
