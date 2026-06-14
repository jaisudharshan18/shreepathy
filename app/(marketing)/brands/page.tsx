import type { Metadata } from 'next'
import Link from 'next/link'
import { getBrands } from '@/lib/db/catalog'

export const metadata: Metadata = {
  title: 'Brands | Shreepathy & Co',
  description: 'Explore the premium food ingredient brands we carry at Shreepathy & Co.',
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl mb-3">
          Our Brands
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We are authorised distributors for leading national and international food ingredient brands.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-brand-magenta hover:shadow-md transition-all"
          >
            <h2 className="text-lg font-bold text-brand-navy group-hover:text-brand-magenta transition-colors mb-2">
              {brand.name}
            </h2>
            {brand.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {brand.description}
              </p>
            )}
            <span className="mt-4 inline-block text-xs font-semibold text-brand-magenta">
              View products &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
