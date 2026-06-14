'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createCategory, updateCategory, deleteCategory } from '@/lib/db/catalog'
import { slugify } from '@/lib/utils'

type ActionResult = { ok: true } | { error: string }

// ── createCategoryAction ──────────────────────────────────────────────────────

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return { error: 'Name is required' }

    const sortOrderRaw = (formData.get('sortOrder') as string | null)?.trim()
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0

    await createCategory({
      name,
      slug: slugify(name),
      image: null,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── updateCategoryAction ──────────────────────────────────────────────────────

export async function updateCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Category id is required' }

    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return { error: 'Name is required' }

    const sortOrderRaw = (formData.get('sortOrder') as string | null)?.trim()
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0

    await updateCategory(id, {
      name,
      slug: slugify(name),
      image: null,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
    })

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── deleteCategoryAction ──────────────────────────────────────────────────────

export async function deleteCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Category id is required' }

    await deleteCategory(id)

    revalidatePath('/admin/categories')
    revalidatePath('/')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
