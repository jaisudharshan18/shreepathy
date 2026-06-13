'use client'

import { useState } from 'react'
import { getProducts } from '@/lib/mock/catalog'
import type { ProductFilter } from '@/lib/mock/catalog'
import type { Category, Brand } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  categories: Category[]
  brands: Brand[]
  onChange: (f: ProductFilter) => void
}

function getDistinctSizes(): string[] {
  const all = getProducts().flatMap((p) => p.variants.map((v) => v.size))
  return Array.from(new Set(all)).sort()
}

export function FilterSidebar({ categories, brands, onChange }: FilterSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>()
  const [selectedSize, setSelectedSize] = useState<string | undefined>()

  const sizes = getDistinctSizes()

  function update(patch: Partial<{ cat: string | undefined; brand: string | undefined; size: string | undefined }>) {
    const cat = 'cat' in patch ? patch.cat : selectedCategory
    const brand = 'brand' in patch ? patch.brand : selectedBrand
    const size = 'size' in patch ? patch.size : selectedSize
    const filter: ProductFilter = {}
    if (cat) filter.categoryId = cat
    if (brand) filter.brandId = brand
    if (size) filter.size = size
    onChange(filter)
  }

  function toggleCategory(id: string) {
    const next = selectedCategory === id ? undefined : id
    setSelectedCategory(next)
    update({ cat: next })
  }

  function toggleBrand(id: string) {
    const next = selectedBrand === id ? undefined : id
    setSelectedBrand(next)
    update({ brand: next })
  }

  function toggleSize(s: string) {
    const next = selectedSize === s ? undefined : s
    setSelectedSize(next)
    update({ size: next })
  }

  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </h3>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  'w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors',
                  selectedCategory === cat.id
                    ? 'bg-brand-navy text-white font-medium'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Brand
        </h3>
        <ul className="space-y-1">
          {brands.map((brand) => (
            <li key={brand.id}>
              <button
                type="button"
                onClick={() => toggleBrand(brand.id)}
                className={cn(
                  'w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors',
                  selectedBrand === brand.id
                    ? 'bg-brand-navy text-white font-medium'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                {brand.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Pack Sizes */}
      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Pack Size
        </h3>
        <ul className="space-y-1">
          {sizes.map((size) => (
            <li key={size}>
              <button
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  'w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors',
                  selectedSize === size
                    ? 'bg-brand-navy text-white font-medium'
                    : 'hover:bg-muted text-foreground'
                )}
              >
                {size}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
