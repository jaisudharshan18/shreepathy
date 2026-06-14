import { requireAdmin } from '@/lib/auth'
import { getProducts, getBrands, getCategories } from '@/lib/db/catalog'
import ProductsAdmin from './ProductsAdmin'

export default async function ProductsPage() {
  await requireAdmin()

  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ])

  return <ProductsAdmin products={products} brands={brands} categories={categories} />
}
