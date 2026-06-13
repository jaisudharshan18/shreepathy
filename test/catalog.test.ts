import { describe, it, expect } from 'vitest'
import { getProducts, getProduct, searchProducts, filterProducts } from '@/lib/mock/catalog'
describe('catalog', () => {
  it('returns all products', () => expect(getProducts().length).toBeGreaterThan(0))
  it('finds by slug', () => { const p = getProducts()[0]; expect(getProduct(p.slug)?.id).toBe(p.id) })
  it('search matches name case-insensitively', () => {
    const name = getProducts()[0].name
    expect(searchProducts(name.toLowerCase()).length).toBeGreaterThan(0)
  })
  it('filters by category', () => {
    const cat = getProducts()[0].categoryId
    expect(filterProducts({ categoryId: cat }).every(p => p.categoryId === cat)).toBe(true)
  })
})
