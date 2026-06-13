import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Shreepathy & Co',
  description:
    'Learn about Shreepathy & Co — wholesale bakery and food ingredient suppliers serving Karnataka since over a decade.',
}

const trustSignals = [
  { label: 'Years in Business', value: '10+' },
  { label: 'Brands Carried', value: '15+' },
  { label: 'Product Categories', value: '8' },
  { label: 'Cities Served', value: '5+' },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl mb-4">
          About Shreepathy &amp; Co
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Karnataka's trusted wholesale partner for bakery raw materials, dairy, frozen
          foods and beverage ingredients.
        </p>
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
        {trustSignals.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 text-center"
          >
            <span className="text-3xl font-extrabold text-brand-magenta">{value}</span>
            <span className="mt-1 text-sm font-medium text-brand-navy">{label}</span>
          </div>
        ))}
      </div>

      {/* Business Intro */}
      <div className="prose prose-lg max-w-none mb-12">
        <h2 className="text-2xl font-bold text-brand-navy">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed mt-4">
          Shreepathy &amp; Co is a wholesale food ingredient distributor based in Karnataka, India.
          We specialise in sourcing, stocking and supplying premium bakery raw materials,
          dairy products, frozen foods, mojito syrups, hotel ingredients, and ice cream flavour
          bases to businesses across the region.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          Whether you run a bakery, quick-service restaurant, cloud kitchen, hotel or catering
          business, we have the ingredients you need — delivered reliably and at competitive
          wholesale prices.
        </p>

        <h2 className="text-2xl font-bold text-brand-navy mt-10">Coverage Area</h2>
        <p className="text-gray-700 leading-relaxed mt-4">
          We currently deliver across <strong>Bangalore</strong>, <strong>Mysore</strong>,{' '}
          <strong>Mangalore</strong>, <strong>Hubli-Dharwad</strong> and surrounding districts
          in Karnataka. Pan-India dispatch is available for orders above ₹10,000 via courier.
        </p>

        <h2 className="text-2xl font-bold text-brand-navy mt-10">Why Choose Us</h2>
        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700">
          <li>Authorised distributor for leading brands: Pillsbury, Rich's, Morde, Monin, Amul and more.</li>
          <li>Consistent stock of fast-moving SKUs — no waiting weeks for restocks.</li>
          <li>Flexible ordering — single carton to truckload quantities.</li>
          <li>Quick WhatsApp ordering with real-time availability checks.</li>
          <li>Credit terms available for established accounts.</li>
          <li>Sample units available for large order evaluations.</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-12">
        <Link
          href="/contact"
          className="inline-flex items-center rounded-full bg-brand-magenta px-8 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Get in Touch
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center rounded-full border-2 border-brand-navy px-8 py-3 text-base font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    </div>
  )
}
