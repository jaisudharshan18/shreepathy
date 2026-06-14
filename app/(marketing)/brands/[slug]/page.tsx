import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBrand, getBrands, filterProducts } from '@/lib/db/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const brand = await getBrand(slug)
  if (!brand) return { title: 'Brand Not Found | Shreepathy & Co' }
  return {
    title: `${brand.name} Products | Shreepathy & Co`,
    description: brand.description ?? `Browse ${brand.name} products at Shreepathy & Co.`,
  }
}

export async function generateStaticParams() {
  const brands = await getBrands()
  return brands.map((b) => ({ slug: b.slug }))
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params
  const brand = await getBrand(slug)

  if (!brand) {
    notFound()
  }

  const brandProducts = await filterProducts({ brandId: brand.id })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Brand Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl mb-3">
          {brand.name}
        </h1>
        {brand.description && (
          <p className="text-muted-foreground max-w-2xl">{brand.description}</p>
        )}
      </div>

      {/* Products */}
      <ProductGrid products={brandProducts} />
    </div>
  )
}
