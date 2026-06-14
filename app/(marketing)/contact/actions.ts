'use server'

import { createEnquiry, createLead } from '@/lib/db/crm'
import { sendAdminEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'

export type EnquiryState = { ok?: boolean; error?: string }

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export async function submitEnquiryAction(formData: FormData): Promise<EnquiryState> {
  const name = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const products = String(formData.get('products') ?? '').trim()
  const business = String(formData.get('business') ?? '').trim() || undefined
  const quantity = String(formData.get('quantity') ?? '').trim() || undefined
  const location = String(formData.get('location') ?? '').trim() || undefined
  const message = String(formData.get('message') ?? '').trim() || undefined

  if (!name || !phone || !products) return { error: 'Name, phone and products are required.' }

  try {
    await createEnquiry({ name, phone, business, products, quantity, location, message })
    await createLead({ source: 'enquiry', name, phone, businessName: business, notes: products })
    await sendAdminEmail({
      subject: `New enquiry from ${name}`,
      html:
        `<h2>New Enquiry</h2>` +
        `<p><b>Name:</b> ${esc(name)}</p>` +
        `<p><b>Phone:</b> ${esc(phone)}</p>` +
        `<p><b>Business:</b> ${business ? esc(business) : '-'}</p>` +
        `<p><b>Products:</b> ${esc(products)}</p>` +
        `<p><b>Quantity:</b> ${quantity ? esc(quantity) : '-'}</p>` +
        `<p><b>Location:</b> ${location ? esc(location) : '-'}</p>` +
        `<p><b>Message:</b> ${message ? esc(message) : '-'}</p>`,
    })
    revalidatePath('/admin/enquiries')
    revalidatePath('/admin/leads')
    return { ok: true }
  } catch {
    return { error: 'Something went wrong. Please try again or use WhatsApp.' }
  }
}
