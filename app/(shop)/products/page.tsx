import { getProducts, getCategories, getBrands } from '@/lib/db/catalog'
import { CatalogBrowser } from './CatalogBrowser'

export default async function ProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ])

  return (
    <CatalogBrowser products={products} categories={categories} brands={brands} />
  )
}
