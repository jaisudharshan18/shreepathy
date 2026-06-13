import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { filterProducts, getCategory, getCategories } from '@/lib/mock/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found at Shreepathy & Co.',
    }
  }
  return {
    title: category.name,
    description: `Browse ${category.name} products available wholesale at Shreepathy & Co — bakery and food ingredient specialists.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
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
