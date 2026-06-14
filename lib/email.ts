import 'server-only'
import { Resend } from 'resend'

const key = process.env.RESEND_API_KEY
const resend = key ? new Resend(key) : null
const FROM = 'Shreepathy & Co <onboarding@resend.dev>'

function adminRecipient(): string | null {
  const list = (process.env.ADMIN_EMAILS ?? '').split(',').map(s => s.trim()).filter(Boolean)
  return list[0] ?? null
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY missing — skipping send:', subject)
    return { ok: false, skipped: true }
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html })
    return { ok: true }
  } catch (e) {
    console.error('[email] send failed', e)
    return { ok: false, error: String(e) }
  }
}

export async function sendAdminEmail({ subject, html }: { subject: string; html: string }) {
  const to = adminRecipient()
  if (!to) {
    console.warn('[email] no ADMIN_EMAILS recipient')
    return { ok: false, skipped: true }
  }
  return sendEmail({ to, subject, html })
}
