import Link from 'next/link'
import { getProducts, getBrands, getCategories } from '@/lib/db/catalog'
import { whatsappLink } from '@/lib/utils'
import { ProductGrid } from '@/components/catalog/ProductGrid'

const HERO_WA_MESSAGE = "Hi Shreepathy & Co, I'd like to place a wholesale order."

export default async function HomePage() {
  const [allProducts, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ])
  const featuredProducts = allProducts.filter((p) => p.isFeatured)

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-20 px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Your Complete Bakery &amp; Food Ingredients Wholesale Partner
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Supplying premium bakery, dairy, frozen and beverage ingredients to bakeries,
            restaurants, hotels and cloud kitchens across Karnataka.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappLink(HERO_WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-brand-magenta px-8 py-3 text-base font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
            >
              Order via WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex items-center rounded-full border-2 border-white px-8 py-3 text-base font-semibold text-white hover:bg-white hover:text-brand-navy transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Categories ───────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 text-center hover:border-brand-magenta hover:bg-brand-navy/5 transition-colors"
              >
                <span className="text-sm font-semibold text-brand-navy group-hover:text-brand-magenta transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-brand-navy">Featured Products</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-brand-magenta hover:underline"
            >
              View all products
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* ── Brand Strip ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-brand-navy mb-8 text-center">
            Brands We Carry
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm font-semibold text-brand-navy hover:border-brand-magenta hover:text-brand-magenta transition-colors"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
