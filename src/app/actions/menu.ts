'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { uploadImage, deleteImage } from '@/utils/supabase/storage'

/**
 * Helper: Get the admin's restaurant and verify ownership.
 */
async function getAdminRestaurant() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Tizimga kiring.')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!restaurant) {
    throw new Error('Restoran topilmadi.')
  }

  return { supabase, user, restaurantId: restaurant.id }
}

/**
 * Helper: Get the admin's active menu.
 */
async function getAdminMenu() {
  const { supabase, restaurantId } = await getAdminRestaurant()

  const { data: menu } = await supabase
    .from('menus')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!menu) {
    // Create a default menu if none exists
    const { data: newMenu } = await supabase
      .from('menus')
      .insert({
        restaurant_id: restaurantId,
        name: 'Asosiy menyu',
        is_active: true,
      })
      .select()
      .single()

    return { supabase, restaurantId, menuId: newMenu!.id }
  }

  return { supabase, restaurantId, menuId: menu.id }
}

// ============================================================================
// RESTAURANT SETTINGS
// ============================================================================

/**
 * Get the current admin's restaurant details.
 */
export async function getMyRestaurant() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('restaurants')
    .select(`
      *,
      menus (
        id,
        name,
        is_active
      )
    `)
    .eq('user_id', user.id)
    .single()

  return data
}

/**
 * Update restaurant settings (by admin).
 */
export async function updateMyRestaurant(formData: FormData) {
  const { supabase, restaurantId } = await getAdminRestaurant()

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const currency = (formData.get('currency') as string) || 'UZS'

  if (!name) {
    return { error: 'Restoran nomini kiritish majburiy.' }
  }

  // Handle logo upload
  const logoFile = formData.get('logo') as File | null
  let logoUrl: string | undefined

  if (logoFile && logoFile.size > 0) {
    const { url, error: uploadError } = await uploadImage(logoFile, 'logos')
    if (uploadError) {
      return { error: uploadError }
    }
    logoUrl = url || undefined
  }

  const updateData: {
    name?: string
    address?: string | null
    phone?: string | null
    currency?: string
    logo_url?: string | null
  } = {
    name,
    address: address || null,
    phone: phone || null,
    currency,
  }

  if (logoUrl) {
    updateData.logo_url = logoUrl
  }

  const { error } = await supabase
    .from('restaurants')
    .update(updateData)
    .eq('id', restaurantId)

  if (error) {
    return { error: error.message || 'Yangilashda xatolik yuz berdi.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  return { success: true }
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get all categories for the admin's menu.
 */
export async function getCategories() {
  const { supabase, menuId } = await getAdminMenu()

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      items (
        id,
        name,
        description,
        price,
        image_url,
        is_available,
        sort_order
      )
    `)
    .eq('menu_id', menuId)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Sort items within each category
  return (data || []).map((cat) => ({
    ...cat,
    items: (cat.items || []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    ),
  }))
}

/**
 * Create a new category.
 */
export async function createCategory(formData: FormData) {
  const { supabase, menuId } = await getAdminMenu()

  const name = formData.get('name') as string

  if (!name) {
    return { error: 'Kategoriya nomini kiritish majburiy.' }
  }

  // Get the next sort order
  const { data: lastCat } = await supabase
    .from('categories')
    .select('sort_order')
    .eq('menu_id', menuId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (lastCat?.sort_order || 0) + 1

  const { error } = await supabase
    .from('categories')
    .insert({
      menu_id: menuId,
      name,
      sort_order: sortOrder,
    })

  if (error) {
    return { error: error.message || 'Kategoriya yaratishda xatolik.' }
  }

  revalidatePath('/dashboard/menu')
  return { success: true }
}

/**
 * Update a category.
 */
export async function updateCategory(categoryId: string, formData: FormData) {
  const { supabase } = await getAdminMenu()

  const name = formData.get('name') as string

  if (!name) {
    return { error: 'Kategoriya nomini kiritish majburiy.' }
  }

  const { error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', categoryId)

  if (error) {
    return { error: error.message || 'Yangilashda xatolik.' }
  }

  revalidatePath('/dashboard/menu')
  return { success: true }
}

/**
 * Delete a category (and all its items).
 */
export async function deleteCategory(categoryId: string) {
  const { supabase } = await getAdminMenu()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)

  if (error) {
    return { error: error.message || 'O\'chirishda xatolik.' }
  }

  revalidatePath('/dashboard/menu')
  return { success: true }
}

// ============================================================================
// ITEMS
// ============================================================================

/**
 * Create a new menu item.
 */
export async function createItem(formData: FormData) {
  const { supabase } = await getAdminMenu()

  const categoryId = formData.get('categoryId') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const imageFile = formData.get('image') as File | null

  if (!categoryId) {
    return { error: 'Kategoriyani tanlash majburiy.' }
  }
  if (!name) {
    return { error: 'Taom nomini kiritish majburiy.' }
  }

  // Upload image if provided
  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    const { url, error: uploadError } = await uploadImage(imageFile, 'items')
    if (uploadError) {
      return { error: uploadError }
    }
    imageUrl = url
  }

  // Get the next sort order in this category
  const { data: lastItem } = await supabase
    .from('items')
    .select('sort_order')
    .eq('category_id', categoryId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = (lastItem?.sort_order || 0) + 1

  const { error } = await supabase
    .from('items')
    .insert({
      category_id: categoryId,
      name,
      description: description || null,
      price,
      image_url: imageUrl,
      is_available: true,
      sort_order: sortOrder,
    })

  if (error) {
    return { error: error.message || 'Taom qo\'shishda xatolik.' }
  }

  revalidatePath('/dashboard/menu')
  return { success: true }
}

/**
 * Update an existing menu item.
 */
export async function updateItem(itemId: string, formData: FormData) {
  const { supabase } = await getAdminMenu()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string) || 0
  const isAvailable = formData.get('isAvailable') === 'true'
  const imageFile = formData.get('image') as File | null
  const categoryId = formData.get('categoryId') as string

  if (!name) {
    return { error: 'Taom nomini kiritish majburiy.' }
  }

  const updateData: {
    name?: string
    description?: string | null
    price?: number
    is_available?: boolean
    category_id?: string
    image_url?: string | null
  } = {
    name,
    description: description || null,
    price,
    is_available: isAvailable,
  }

  if (categoryId) {
    updateData.category_id = categoryId
  }

  // Upload new image if provided
  if (imageFile && imageFile.size > 0) {
    // Delete old image first
    const { data: oldItem } = await supabase
      .from('items')
      .select('image_url')
      .eq('id', itemId)
      .single()

    if (oldItem?.image_url) {
      await deleteImage(oldItem.image_url)
    }

    const { url, error: uploadError } = await uploadImage(imageFile, 'items')
    if (uploadError) {
      return { error: uploadError }
    }
    updateData.image_url = url
  }

  const { error } = await supabase
    .from('items')
    .update(updateData)
    .eq('id', itemId)

  if (error) {
    return { error: error.message || 'Yangilashda xatolik.' }
  }

  revalidatePath('/dashboard/menu')
  return { success: true }
}

/**
 * Toggle item availability.
 */
export async function toggleItemAvailability(itemId: string, isAvailable: boolean) {
  const { supabase } = await getAdminMenu()

  const { error } = await supabase
    .from('items')
    .update({ is_available: isAvailable })
    .eq('id', itemId)

  if (error) {
    return { error: error.message || 'Yangilashda xatolik.' }
  }

  revalidatePath('/dashboard/menu')
  return { success: true }
}

/**
 * Delete a menu item.
 */
export async function deleteItem(itemId: string) {
  const { supabase } = await getAdminMenu()

  // Delete the item's image from storage
  const { data: item } = await supabase
    .from('items')
    .select('image_url')
    .eq('id', itemId)
    .single()

  if (item?.image_url) {
    await deleteImage(item.image_url)
  }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)

  if (error) {
    return { error: error.message || 'O\'chirishda xatolik.' }
  }

  revalidatePath('/dashboard/menu')
  return { success: true }
}
