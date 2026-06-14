'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { setEnquiryHandled, deleteEnquiry } from '@/lib/db/crm'

type ActionResult = { ok: true } | { error: string }

export async function setEnquiryHandledAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Enquiry id is required' }
    const handled = formData.get('handled') === 'true'
    await setEnquiryHandled(id, handled)
    revalidatePath('/admin/enquiries')
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function deleteEnquiryAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'Enquiry id is required' }
    await deleteEnquiry(id)
    revalidatePath('/admin/enquiries')
    revalidatePath('/admin')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
