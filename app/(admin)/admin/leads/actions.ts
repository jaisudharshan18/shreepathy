'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { updateLeadStatus, updateLead, deleteLead } from '@/lib/db/crm'
import type { LeadStatus } from '@/lib/generated/prisma/client'

type ActionResult = { ok: true } | { error: string }

const VALID_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Converted', 'Lost']

export async function updateLeadStatusAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Lead id is required' }
    const status = formData.get('status') as string | null
    if (!status || !VALID_STATUSES.includes(status as LeadStatus)) {
      return { error: 'Invalid status' }
    }
    await updateLeadStatus(id, status as LeadStatus)
    revalidatePath('/admin/leads')
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateLeadAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Lead id is required' }
    const name = (formData.get('name') as string | null)?.trim() ?? ''
    if (!name) return { error: 'Name is required' }
    const phone = (formData.get('phone') as string | null)?.trim() ?? ''
    if (!phone) return { error: 'Phone is required' }
    const businessName = (formData.get('businessName') as string | null)?.trim() || null
    const notes = (formData.get('notes') as string | null)?.trim() || null
    const assignedTo = (formData.get('assignedTo') as string | null)?.trim() || null
    await updateLead(id, { name, phone, businessName, notes, assignedTo })
    revalidatePath('/admin/leads')
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function deleteLeadAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Lead id is required' }
    await deleteLead(id)
    revalidatePath('/admin/leads')
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
