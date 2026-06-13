import { describe, it, expect } from 'vitest'
import type { Product } from '@/lib/types'
describe('types', () => {
  it('product shape usable', () => {
    const p: Product = { id: '1', name: 'X', slug: 'x', brandId: 'b', categoryId: 'c', description: '', variants: [], images: [], stockStatus: 'in_stock', isFeatured: false }
    expect(p.slug).toBe('x')
  })
})
