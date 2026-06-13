import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProduct, filterProducts, getBrandById, getCategoryById, getProducts } from '@/lib/mock/catalog'
import { Badge } from '@/components/ui/badge'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { ProductViewer3D } from '@/components/catalog/ProductViewer3D'
import { whatsappLink, formatINR } from '@/lib/utils'

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found at Shreepathy & Co.',
    }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

function StockBadge({ status }: { status: 'in_stock' | 'low' | 'out_of_stock' }) {
  if (status === 'in_stock') {
    return <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>
  }
  if (status === 'low') {
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Low Stock</Badge>
  }
  return <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const brand = getBrandById(product.brandId)
  const category = getCategoryById(product.categoryId)
  const related = filterProducts({ categoryId: product.categoryId })
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const waMessage = `Hi, I'd like to order ${product.name}.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: brand ? { '@type': 'Brand', name: brand.name } : undefined,
    category: category?.name,
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Product detail section */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left — media */}
        <div>
          {product.modelGlb ? (
            <ProductViewer3D src={product.modelGlb} alt={product.name} />
          ) : (
            <div className="space-y-4">
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.name} image ${i + 1}`}
                  className="w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — info */}
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-brand-navy">{product.name}</h1>
            {brand && (
              <p className="text-sm text-muted-foreground">
                by{' '}
                <Link
                  href={`/brands/${brand.slug}`}
                  className="text-brand-magenta hover:underline font-medium"
                >
                  {brand.name}
                </Link>
              </p>
            )}
            <StockBadge status={product.stockStatus} />
          </div>

          <p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>

          {/* Pack size / variant selector */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Pack Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-md border border-input px-3 py-2 text-sm min-w-[72px]"
                  >
                    <span className="font-medium">{v.size}</span>
                    {v.price !== undefined && (
                      <span className="text-xs text-muted-foreground">{formatINR(v.price)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-brand-magenta px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Order via WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
            >
              Request Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-navy">Related Products</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  )
}
