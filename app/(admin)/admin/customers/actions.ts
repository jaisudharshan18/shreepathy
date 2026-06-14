'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { updateCustomer } from '@/lib/db/account'
import type { Tier } from '@/lib/generated/prisma/client'

type ActionResult = { ok: true } | { error: string }

const VALID_TIERS: Tier[] = ['Silver', 'Gold', 'Platinum']

export async function updateCustomerAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Customer id is required' }

    const businessName = (formData.get('businessName') as string | null)?.trim()
    const contactName = (formData.get('contactName') as string | null)?.trim()
    const phone = (formData.get('phone') as string | null)?.trim()
    const tierRaw = (formData.get('tier') as string | null)?.trim()
    const tier = tierRaw && VALID_TIERS.includes(tierRaw as Tier) ? (tierRaw as Tier) : undefined
    const pointsRaw = (formData.get('pointsBalance') as string | null)?.trim()
    const pointsBalance = pointsRaw !== undefined && pointsRaw !== '' ? parseInt(pointsRaw, 10) : undefined

    await updateCustomer(id, {
      ...(businessName !== undefined && businessName !== '' ? { businessName } : {}),
      ...(contactName !== undefined && contactName !== '' ? { contactName } : {}),
      ...(phone !== undefined && phone !== '' ? { phone } : {}),
      ...(tier !== undefined ? { tier } : {}),
      ...(pointsBalance !== undefined && !isNaN(pointsBalance) ? { pointsBalance } : {}),
    })

    revalidatePath('/admin/customers')
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
