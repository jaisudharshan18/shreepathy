'use client'

import { useState } from 'react'
import { getProducts, filterProducts, getCategories, getBrands } from '@/lib/mock/catalog'
import type { ProductFilter } from '@/lib/mock/catalog'
import { SearchBar } from '@/components/catalog/SearchBar'
import { FilterSidebar } from '@/components/catalog/FilterSidebar'
import { ProductGrid } from '@/components/catalog/ProductGrid'

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ProductFilter>({})
  const categories = getCategories()
  const brands = getBrands()

  const visible = filterProducts(filter).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-brand-navy">Product Catalog</h1>
        <SearchBar value={search} onSearch={setSearch} />
        <p className="text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Main layout: sidebar + grid */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-56 shrink-0">
          <FilterSidebar
            categories={categories}
            brands={brands}
            onChange={setFilter}
          />
        </div>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={visible} />
        </div>
      </div>
    </div>
  )
}
