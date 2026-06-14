'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { uploadFile } from '@/lib/storage'
import { createBrand, updateBrand, deleteBrand } from '@/lib/db/catalog'
import { slugify } from '@/lib/utils'

type ActionResult = { ok: true } | { error: string }

function fileFromEntry(entry: FormDataEntryValue | null): File | null {
  if (!entry || typeof entry === 'string') return null
  const f = entry as File
  return f.size > 0 ? f : null
}

// ── createBrandAction ─────────────────────────────────────────────────────────

export async function createBrandAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return { error: 'Name is required' }

    const description = (formData.get('description') as string | null)?.trim() || null

    let logo: string | null = null
    const logoFile = fileFromEntry(formData.get('logo'))
    if (logoFile) {
      logo = await uploadFile('product-images', logoFile, 'brands')
    }

    await createBrand({
      name,
      slug: slugify(name),
      description,
      logo,
    })

    revalidatePath('/admin/brands')
    revalidatePath('/')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── updateBrandAction ─────────────────────────────────────────────────────────

export async function updateBrandAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Brand id is required' }

    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return { error: 'Name is required' }

    const description = (formData.get('description') as string | null)?.trim() || null

    // Existing logo URL passed as hidden field — kept when no new file uploaded
    const existingLogo = (formData.get('existingLogo') as string | null)?.trim() || null
    let logo: string | null = existingLogo

    const logoFile = fileFromEntry(formData.get('logo'))
    if (logoFile) {
      logo = await uploadFile('product-images', logoFile, 'brands')
    }

    await updateBrand(id, {
      name,
      slug: slugify(name),
      description,
      logo,
    })

    revalidatePath('/admin/brands')
    revalidatePath('/')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── deleteBrandAction ─────────────────────────────────────────────────────────

export async function deleteBrandAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Brand id is required' }

    await deleteBrand(id)

    revalidatePath('/admin/brands')
    revalidatePath('/')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
