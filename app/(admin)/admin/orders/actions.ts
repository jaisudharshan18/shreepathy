'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createLoggedOrder } from '@/lib/db/account'

type ActionResult = { ok: true; pointsAwarded: number } | { error: string }

export async function createOrderAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const customerId = (formData.get('customerId') as string | null)?.trim() ?? ''
    if (!customerId) return { error: 'Customer is required' }

    // Parse items — support single item (productId, qty, unitValue, size, productName)
    const productId = (formData.get('productId') as string | null)?.trim() ?? ''
    if (!productId) return { error: 'Product is required' }

    const productName = (formData.get('productName') as string | null)?.trim() ?? ''
    const size = (formData.get('size') as string | null)?.trim() ?? ''
    const qtyRaw = (formData.get('qty') as string | null)?.trim() ?? '1'
    const qty = Math.max(1, parseInt(qtyRaw, 10) || 1)
    const unitValueRaw = (formData.get('unitValue') as string | null)?.trim() ?? ''
    const unitValue = parseFloat(unitValueRaw)
    if (isNaN(unitValue) || unitValue <= 0) return { error: 'Valid unit value is required' }

    const { pointsAwarded } = await createLoggedOrder({
      customerId,
      items: [{ productId, name: productName, size, qty, unitValue }],
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin/customers')
    revalidatePath('/admin/analytics')
    revalidatePath('/admin')
    return { ok: true, pointsAwarded }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
