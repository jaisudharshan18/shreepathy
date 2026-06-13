import { notFound } from 'next/navigation'
import { filterProducts } from '@/lib/mock/catalog'
import { categories } from '@/lib/mock/data'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const categoryProducts = filterProducts({ categoryId: category.id })

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-brand-navy">{category.name}</h1>
      <p className="text-sm text-muted-foreground">
        {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
      </p>
      <ProductGrid products={categoryProducts} />
    </div>
  )
}
