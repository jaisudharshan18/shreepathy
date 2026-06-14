'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createFaq, updateFaq, deleteFaq } from '@/lib/db/crm'

type ActionResult = { ok: true } | { error: string }

// ── createFaqAction ───────────────────────────────────────────────────────────

export async function createFaqAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const question = (formData.get('question') as string | null)?.trim() ?? ''
    if (!question) return { error: 'Question is required' }

    const answer = (formData.get('answer') as string | null)?.trim() ?? ''
    if (!answer) return { error: 'Answer is required' }

    const sortOrderRaw = (formData.get('sortOrder') as string | null)?.trim()
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0

    await createFaq({
      question,
      answer,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
    })

    revalidatePath('/admin/chatbot')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── updateFaqAction ───────────────────────────────────────────────────────────

export async function updateFaqAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'FAQ id is required' }

    const question = (formData.get('question') as string | null)?.trim() ?? ''
    if (!question) return { error: 'Question is required' }

    const answer = (formData.get('answer') as string | null)?.trim() ?? ''
    if (!answer) return { error: 'Answer is required' }

    const sortOrderRaw = (formData.get('sortOrder') as string | null)?.trim()
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0

    await updateFaq(id, {
      question,
      answer,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
    })

    revalidatePath('/admin/chatbot')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── deleteFaqAction ───────────────────────────────────────────────────────────

export async function deleteFaqAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const id = (formData.get('id') as string | null)?.trim() ?? ''
    if (!id) return { error: 'FAQ id is required' }

    await deleteFaq(id)

    revalidatePath('/admin/chatbot')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
