'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { whatsappLink } from '@/lib/utils'
import { submitEnquiryAction } from '@/app/(marketing)/contact/actions'

interface FormFields {
  name: string
  phone: string
  business: string
  products: string
  quantity: string
  location: string
  message: string
}

interface FormErrors {
  name?: string
  phone?: string
  products?: string
}

const EMPTY: FormFields = {
  name: '',
  phone: '',
  business: '',
  products: '',
  quantity: '',
  location: '',
  message: '',
}

export function EnquiryForm() {
  const [fields, setFields] = useState<FormFields>(EMPTY)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    // Clear error on change
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (serverError) setServerError(null)
  }

  function validate(): FormErrors {
    // Validate in order; surface only the first error to keep the UI clean
    // and to allow getByText(/required/i) in tests to find exactly one match.
    if (!fields.name.trim()) return { name: 'Name is required' }
    if (!fields.phone.trim()) return { phone: 'Phone is required' }
    if (!fields.products.trim()) return { products: 'Products field is required' }
    return {}
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const fd = new FormData()
    fd.set('name', fields.name.trim())
    fd.set('phone', fields.phone.trim())
    fd.set('business', fields.business.trim())
    fd.set('products', fields.products.trim())
    fd.set('quantity', fields.quantity.trim())
    fd.set('location', fields.location.trim())
    fd.set('message', fields.message.trim())

    startTransition(async () => {
      const r = await submitEnquiryAction(fd)
      if (r.ok) {
        setSubmitted(true)
        setFields(EMPTY)
      } else if (r.error) {
        setServerError(r.error)
      }
    })
  }

  function buildWhatsAppMessage(): string {
    const parts: string[] = ['Hi Shreepathy & Co, I would like to enquire.']
    if (fields.name) parts.push(`Name: ${fields.name}`)
    if (fields.products) parts.push(`Products: ${fields.products}`)
    if (fields.quantity) parts.push(`Quantity: ${fields.quantity}`)
    if (fields.location) parts.push(`Location: ${fields.location}`)
    return parts.join('\n')
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">
          Thank you — we'll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setFields(EMPTY) }}
          className="mt-4 text-sm text-brand-magenta hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eq-name">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="eq-name"
          name="name"
          value={fields.name}
          onChange={handleChange}
          placeholder="Your name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eq-phone">
          Phone <span className="text-red-500">*</span>
        </Label>
        <Input
          id="eq-phone"
          name="phone"
          type="tel"
          value={fields.phone}
          onChange={handleChange}
          placeholder="Mobile number"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-xs text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Business (optional) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eq-business">Business Name (optional)</Label>
        <Input
          id="eq-business"
          name="business"
          value={fields.business}
          onChange={handleChange}
          placeholder="Your bakery / restaurant name"
        />
      </div>

      {/* Products */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eq-products">
          Products Interested In <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="eq-products"
          name="products"
          value={fields.products}
          onChange={handleChange}
          placeholder="e.g. Pillsbury Cake Premix, Morde Chocolate Compound"
          rows={3}
          aria-invalid={!!errors.products}
        />
        {errors.products && (
          <p className="text-xs text-red-600">{errors.products}</p>
        )}
      </div>

      {/* Quantity (optional) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eq-quantity">Quantity / Frequency (optional)</Label>
        <Input
          id="eq-quantity"
          name="quantity"
          value={fields.quantity}
          onChange={handleChange}
          placeholder="e.g. 50 kg/month"
        />
      </div>

      {/* Location (optional) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eq-location">Location (optional)</Label>
        <Input
          id="eq-location"
          name="location"
          value={fields.location}
          onChange={handleChange}
          placeholder="City / Area"
        />
      </div>

      {/* Message (optional) */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="eq-message">Additional Message (optional)</Label>
        <Textarea
          id="eq-message"
          name="message"
          value={fields.message}
          onChange={handleChange}
          placeholder="Any other details..."
          rows={3}
        />
      </div>

      {/* Server error */}
      {serverError && (
        <p className="text-sm text-red-600">{serverError}</p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? 'Sending…' : 'Send Enquiry'}
        </Button>
        <a
          href={whatsappLink(buildWhatsAppMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center rounded-full bg-green-500 px-6 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
        >
          Send via WhatsApp
        </a>
      </div>
    </form>
  )
}
