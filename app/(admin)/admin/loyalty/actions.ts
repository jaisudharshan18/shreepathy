'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db/client'

type ActionResult = { ok: true } | { error: string }

export async function adjustPointsAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const customerId = (formData.get('customerId') as string | null)?.trim() ?? ''
    if (!customerId) return { error: 'Customer is required' }

    const deltaRaw = (formData.get('pointsDelta') as string | null)?.trim() ?? ''
    const delta = parseInt(deltaRaw, 10)
    if (isNaN(delta) || delta === 0) return { error: 'Points delta must be a non-zero integer' }

    const reason = (formData.get('reason') as string | null)?.trim() ?? ''
    if (!reason) return { error: 'Reason is required' }

    await prisma.$transaction([
      prisma.loyaltyEntry.create({
        data: { customerId, pointsDelta: delta, reason },
      }),
      prisma.customerProfile.update({
        where: { id: customerId },
        data: { pointsBalance: { increment: delta } },
      }),
    ])

    revalidatePath('/admin/loyalty')
    revalidatePath('/admin/customers')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
