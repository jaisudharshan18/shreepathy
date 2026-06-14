'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { uploadFile } from '@/lib/storage'
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/db/catalog'
import { slugify } from '@/lib/utils'
import type { StockStatus } from '@/lib/generated/prisma/client'

type ActionResult = { ok: true } | { error: string }

// ── helpers ───────────────────────────────────────────────────────────────────

function parseStockStatus(raw: FormDataEntryValue | null): StockStatus {
  const valid: StockStatus[] = ['in_stock', 'low', 'out_of_stock']
  if (raw && valid.includes(raw as StockStatus)) return raw as StockStatus
  return 'in_stock'
}

function fileFromEntry(entry: FormDataEntryValue | null): File | null {
  if (!entry || typeof entry === 'string') return null
  const f = entry as File
  return f.size > 0 ? f : null
}

// ── createProductAction ───────────────────────────────────────────────────────

export async function createProductAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin()

    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return { error: 'Name is required' }

    const brandId = (formData.get('brandId') as string | null)?.trim() ?? ''
    const categoryId = (formData.get('categoryId') as string | null)?.trim() ?? ''
    const description = (formData.get('description') as string | null)?.trim() ?? ''
    const stockStatus = parseStockStatus(formData.get('stockStatus'))
    const isFeatured = formData.get('isFeatured') === 'on'

    const packSize = (formData.get('packSize') as string | null)?.trim() ?? ''
    const packPriceRaw = (formData.get('packPrice') as string | null)?.trim()
    const packPrice = packPriceRaw ? parseFloat(packPriceRaw) : undefined

    const slug = slugify(name)
    const images: string[] = []
    let modelGlb: string | null = null

    const imageFile = fileFromEntry(formData.get('image'))
    if (imageFile) {
      const url = await uploadFile('product-images', imageFile, 'products')
      images.push(url)
    }

    const modelFile = fileFromEntry(formData.get('model'))
    if (modelFile) {
      modelGlb = await uploadFile('product-models', modelFile, 'models')
    }

    await createProduct({
      name,
      slug,
      brandId,
      categoryId,
      description,
      images,
      modelGlb,
      stockStatus,
      isFeatured,
      variants: packSize
        ? [{ size: packSize, price: packPrice != null && !isNaN(packPrice) ? packPrice : null }]
        : [],
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── updateProductAction ───────────────────────────────────────────────────────

export async function updateProductAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Product id is required' }

    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return { error: 'Name is required' }

    const brandId = (formData.get('brandId') as string | null)?.trim() ?? ''
    const categoryId = (formData.get('categoryId') as string | null)?.trim() ?? ''
    const description = (formData.get('description') as string | null)?.trim() ?? ''
    const stockStatus = parseStockStatus(formData.get('stockStatus'))
    const isFeatured = formData.get('isFeatured') === 'on'

    const packSize = (formData.get('packSize') as string | null)?.trim() ?? ''
    const packPriceRaw = (formData.get('packPrice') as string | null)?.trim()
    const packPrice = packPriceRaw ? parseFloat(packPriceRaw) : undefined

    const slug = slugify(name)

    // Existing URLs passed as hidden fields — kept when no new file is provided
    const existingImageUrl = (formData.get('existingImageUrl') as string | null)?.trim() ?? ''
    const existingGlbUrl = (formData.get('existingGlbUrl') as string | null)?.trim() ?? ''

    let images: string[] = existingImageUrl ? [existingImageUrl] : []
    let modelGlb: string | null = existingGlbUrl || null

    const imageFile = fileFromEntry(formData.get('image'))
    if (imageFile) {
      const url = await uploadFile('product-images', imageFile, 'products')
      images = [url]
    }

    const modelFile = fileFromEntry(formData.get('model'))
    if (modelFile) {
      modelGlb = await uploadFile('product-models', modelFile, 'models')
    }

    await updateProduct(id, {
      name,
      slug,
      brandId,
      categoryId,
      description,
      images,
      modelGlb,
      stockStatus,
      isFeatured,
      variants: packSize
        ? [{ size: packSize, price: packPrice != null && !isNaN(packPrice) ? packPrice : null }]
        : [],
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── deleteProductAction ───────────────────────────────────────────────────────

export async function deleteProductAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Product id is required' }

    await deleteProduct(id)

    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
