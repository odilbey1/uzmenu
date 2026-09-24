import { createClient } from '@/utils/supabase/server'

const BUCKET_NAME = 'menu-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Upload an image to Supabase Storage and return the public URL.
 * @param file The file to upload
 * @param folder Sub-folder in the bucket (e.g., 'items', 'logos')
 * @returns Public URL string or null on error
 */
export async function uploadImage(
  file: File,
  folder: string = 'items'
): Promise<{ url: string | null; error: string | null }> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { url: null, error: 'Rasm hajmi 5MB dan oshmasligi kerak.' }
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { url: null, error: 'Faqat JPG, PNG, WebP yoki GIF formatdagi rasmlar qabul qilinadi.' }
  }

  const supabase = await createClient()

  // Generate unique filename
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const filePath = `${folder}/${timestamp}-${randomId}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { url: null, error: 'Rasm yuklashda xatolik yuz berdi.' }
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return { url: publicUrl, error: null }
}

/**
 * Delete an image from Supabase Storage by its public URL.
 */
export async function deleteImage(publicUrl: string): Promise<void> {
  const supabase = await createClient()

  // Extract file path from the public URL
  const bucketPath = `${BUCKET_NAME}/`
  const pathIndex = publicUrl.indexOf(bucketPath)
  if (pathIndex === -1) return

  const filePath = publicUrl.substring(pathIndex + bucketPath.length)

  await supabase.storage.from(BUCKET_NAME).remove([filePath])
}
