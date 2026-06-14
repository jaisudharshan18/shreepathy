'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { upsertSiteContent } from '@/lib/db/content'

type ActionResult = { ok: true } | { error: string }

// ── saveContentAction ─────────────────────────────────────────────────────────

export async function saveContentAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const heroHeadline = (formData.get('heroHeadline') as string | null)?.trim() ?? ''
    if (!heroHeadline) return { error: 'Hero headline is required' }

    const heroSubtext = (formData.get('heroSubtext') as string | null)?.trim() ?? ''
    const ctaLabel = (formData.get('ctaLabel') as string | null)?.trim() ?? ''
    const aboutCopy = (formData.get('aboutCopy') as string | null)?.trim() ?? ''
    const contactPhone = (formData.get('contactPhone') as string | null)?.trim() ?? ''
    const contactEmail = (formData.get('contactEmail') as string | null)?.trim() ?? ''
    const contactAddress = (formData.get('contactAddress') as string | null)?.trim() ?? ''
    const mapEmbedUrl = (formData.get('mapEmbedUrl') as string | null)?.trim() ?? ''

    await upsertSiteContent({
      heroHeadline,
      heroSubtext,
      ctaLabel,
      aboutCopy,
      contactPhone,
      contactEmail,
      contactAddress,
      mapEmbedUrl,
    })

    revalidatePath('/admin/content')
    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/contact')
    return { ok: true }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
