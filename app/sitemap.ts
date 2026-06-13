import type { MetadataRoute } from 'next'
import { products, categories, brands } from '@/lib/mock/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://shreepathyandco.com'
  const staticRoutes = ['', '/about', '/brands', '/contact', '/products'].map((r) => ({
    url: `${base}${r}`,
  }))
  const productRoutes = products.map((p) => ({ url: `${base}/products/${p.slug}` }))
  const categoryRoutes = categories.map((c) => ({ url: `${base}/category/${c.slug}` }))
  const brandRoutes = brands.map((b) => ({ url: `${base}/brands/${b.slug}` }))
  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes]
}
