import 'server-only'

import { createClient } from '@supabase/supabase-js'

// Service-role admin client — bypasses RLS. NEVER import this file from client code.
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/**
 * Upload a File to the given Supabase storage bucket.
 * Returns the public URL of the uploaded object.
 */
export async function uploadFile(
  bucket: string,
  file: File,
  pathPrefix: string,
): Promise<string> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const key = `${pathPrefix}/${Date.now()}-${sanitizedName}`

  const { error } = await adminSupabase.storage
    .from(bucket)
    .upload(key, file, { upsert: false })

  if (error) {
    throw new Error(`Storage upload failed (${bucket}/${key}): ${error.message}`)
  }

  const { data } = adminSupabase.storage.from(bucket).getPublicUrl(key)
  return data.publicUrl
}

/**
 * Best-effort deletion of a file from Supabase storage given its public URL.
 * Errors are swallowed — a missing or already-deleted file is not fatal.
 */
export async function deleteFile(bucket: string, publicUrl: string): Promise<void> {
  try {
    // Extract the object path after `/storage/v1/object/public/<bucket>/`
    const marker = `/storage/v1/object/public/${bucket}/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return

    const objectPath = publicUrl.slice(idx + marker.length)
    if (!objectPath) return

    await adminSupabase.storage.from(bucket).remove([objectPath])
  } catch {
    // swallow — best effort
  }
}
