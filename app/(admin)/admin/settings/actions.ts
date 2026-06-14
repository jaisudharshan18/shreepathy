'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { upsertSettings } from '@/lib/db/settings'

type ActionResult = { ok: true } | { error: string }

// ── saveSettingsAction ────────────────────────────────────────────────────────
// NOTE: whatsappNumber is persisted here to Settings (singleton).
// The client-side whatsappLink() helper in lib/utils.ts still uses a hardcoded
// constant. A later pass (Phase 2e or later) should thread getSettings() through
// layout/server components to supply the live number to client components.

export async function saveSettingsAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const whatsappNumber = (formData.get('whatsappNumber') as string | null)?.trim() ?? ''
    if (!whatsappNumber) return { error: 'WhatsApp number is required' }

    const businessName = (formData.get('businessName') as string | null)?.trim() ?? ''
    if (!businessName) return { error: 'Business name is required' }

    const businessHours = (formData.get('businessHours') as string | null)?.trim() ?? ''
    const seoTitle = (formData.get('seoTitle') as string | null)?.trim() ?? ''
    const seoDescription = (formData.get('seoDescription') as string | null)?.trim() ?? ''

    await upsertSettings({
      whatsappNumber,
      businessName,
      businessHours,
      seoTitle,
      seoDescription,
    })

    revalidatePath('/admin/settings')
    revalidatePath('/')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
