import { products } from './data'
import type { Product } from '@/lib/types'
export function getProducts(): Product[] { return products }
export function getProduct(slug: string): Product | undefined { return products.find(p => p.slug === slug) }
export function searchProducts(q: string): Product[] {
  const t = q.toLowerCase()
  return products.filter(p => p.name.toLowerCase().includes(t))
}
export interface ProductFilter { categoryId?: string; brandId?: string; size?: string }
export function filterProducts(f: ProductFilter): Product[] {
  return products.filter(p =>
    (!f.categoryId || p.categoryId === f.categoryId) &&
    (!f.brandId || p.brandId === f.brandId) &&
    (!f.size || p.variants.some(v => v.size === f.size)))
}
