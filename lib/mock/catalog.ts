import { products, brands, categories } from './data'
import type { Product, Brand, Category } from '@/lib/types'
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
export function getBrands(): Brand[] { return brands }
export function getBrand(slug: string): Brand | undefined { return brands.find(b => b.slug === slug) }
export function getBrandById(id: string): Brand | undefined { return brands.find(b => b.id === id) }
export function getCategories(): Category[] { return categories }
export function getCategory(slug: string): Category | undefined { return categories.find(c => c.slug === slug) }
export function getCategoryById(id: string): Category | undefined { return categories.find(c => c.id === id) }
