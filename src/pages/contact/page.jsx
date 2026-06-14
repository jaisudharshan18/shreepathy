import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { whatsappLink } from "@/lib/utils";
export const metadata = {
  title: "Contact Us | Shreepathy & Co",
  description: "Get in touch with Shreepathy & Co for wholesale bakery and food ingredient enquiries."
};
const WA_MESSAGE = "Hi Shreepathy & Co, I would like to enquire about your products.";
const PHONE_NUMBER = "+91 99999 99999";
async function ContactPage() {
  return (
    <div className="bg-bakery-cream min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase text-bakery-brown bg-bakery-beige px-3 py-1 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-bakery-chocolate">
            Contact Us
          </h1>
          <p className="text-base text-bakery-chocolate/75 font-medium leading-relaxed">
            Send us an enquiry or reach us directly via WhatsApp — we typically respond within a few hours.
          </p>
        </div>

        {/* Form and Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Enquiry Form */}
          <div className="bg-white rounded-3xl border border-bakery-beige/80 p-8 sm:p-10 shadow-xs text-left">
            <h2 className="text-2xl font-serif font-extrabold text-bakery-chocolate mb-6">
              Send an Enquiry
            </h2>
            <EnquiryForm />
          </div>

          {/* Contact Info + Map */}
          <div className="flex flex-col gap-8 text-left">
            {/* Direct contact */}
            <div className="bg-white rounded-3xl border border-bakery-beige/80 p-8 shadow-xs">
              <h2 className="text-xl font-serif font-extrabold text-bakery-chocolate mb-6">
                Reach Us Directly
              </h2>
              <div className="flex flex-col gap-4">
                <a
                  href={whatsappLink(WA_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50/50 px-5 py-4 hover:bg-green-50 hover:border-green-300 transition-all duration-300 shadow-xs"
                >
                  <span className="text-2xl" role="img" aria-label="WhatsApp icon">💬</span>
                  <div>
                    <p className="font-extrabold text-green-800 text-sm">WhatsApp Sales Desk</p>
                    <p className="text-xs text-green-700 font-semibold mt-0.5">{PHONE_NUMBER}</p>
                  </div>
                </a>
                
                <a
                  href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-4 rounded-2xl border border-bakery-beige bg-bakery-cream/20 px-5 py-4 hover:bg-bakery-cream hover:border-bakery-brown/50 transition-all duration-300 shadow-xs"
                >
                  <span className="text-2xl" role="img" aria-label="Phone icon">📞</span>
                  <div>
                    <p className="font-extrabold text-bakery-chocolate text-sm">Direct Phone Line</p>
                    <p className="text-xs text-bakery-chocolate/70 font-semibold mt-0.5">{PHONE_NUMBER}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-3xl border border-bakery-beige/80 p-8 shadow-xs">
              <h2 className="text-xl font-serif font-extrabold text-bakery-chocolate mb-4">
                Our Location
              </h2>
              <div className="overflow-hidden rounded-2xl border border-bakery-beige/80">
                <iframe
                  title="Shreepathy and Co location"
                  src="https://www.google.com/maps?q=Shreepathy+and+Co+Bangalore+Tamil+Nadu&output=embed"
                  width="100%"
                  height="260"
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
    </div>
  );
}

export default createAsyncPage(ContactPage);
