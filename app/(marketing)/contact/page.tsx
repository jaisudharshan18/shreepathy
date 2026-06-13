import type { Metadata } from 'next'
import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { whatsappLink } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contact Us | Shreepathy & Co',
  description:
    'Get in touch with Shreepathy & Co for wholesale bakery and food ingredient enquiries.',
}

const WA_MESSAGE = 'Hi Shreepathy & Co, I would like to enquire about your products.'
const PHONE_NUMBER = '+91 99999 99999'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl mb-3">
          Contact Us
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Send us an enquiry or reach us directly via WhatsApp — we typically respond within a few hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Enquiry Form */}
        <div>
          <h2 className="text-xl font-bold text-brand-navy mb-6">Send an Enquiry</h2>
          <EnquiryForm />
        </div>

        {/* Contact Info + Map */}
        <div className="flex flex-col gap-8">
          {/* Direct contact */}
          <div>
            <h2 className="text-xl font-bold text-brand-navy mb-4">Reach Us Directly</h2>
            <div className="flex flex-col gap-4">
              <a
                href={whatsappLink(WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 hover:bg-green-100 transition-colors"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-green-800 text-sm">WhatsApp</p>
                  <p className="text-xs text-green-700">{PHONE_NUMBER}</p>
                </div>
              </a>

              <a
                href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 hover:bg-blue-100 transition-colors"
              >
                <span className="text-2xl">📞</span>
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Phone</p>
                  <p className="text-xs text-blue-700">{PHONE_NUMBER}</p>
                </div>
              </a>
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-xl font-bold text-brand-navy mb-4">Our Location</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <iframe
                title="Shreepathy and Co location"
                src="https://www.google.com/maps?q=Shreepathy+and+Co+Bangalore+Karnataka&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
