"use client";
import { useState, useMemo } from "react";
import { SearchBar } from "@/components/catalog/SearchBar";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
function getDistinctSizes(products) {
  const all = products.flatMap((p) => p.variants.map((v) => v.size));
  return Array.from(new Set(all)).sort();
}
export function CatalogBrowser({ products, categories, brands }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({});
  const sizes = useMemo(() => getDistinctSizes(products), [products]);
  const visible = useMemo(() => {
    return products.filter((p) => {
      if (filter.categoryId && p.categoryId !== filter.categoryId) return false;
      if (filter.brandId && p.brandId !== filter.brandId) return false;
      if (filter.size && !p.variants.some((v) => v.size === filter.size)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, filter, search]);
  return <div className="container mx-auto px-4 py-10">{
    /* Page header */
  }<div className="mb-8 space-y-4"><h1 className="text-3xl font-bold text-brand-navy">Product Catalog</h1><SearchBar value={search} onSearch={setSearch} /><p className="text-sm text-muted-foreground">{visible.length} {visible.length === 1 ? "product" : "products"} found
        </p></div>{
    /* Main layout: sidebar + grid */
  }<div className="flex flex-col gap-8 lg:flex-row">{
    /* Sidebar */
  }<div className="w-full lg:w-56 shrink-0"><FilterSidebar
    categories={categories}
    brands={brands}
    sizes={sizes}
    onChange={setFilter}
  /></div>{
    /* Product grid */
  }<div className="flex-1 min-w-0"><ProductGrid products={visible} /></div></div></div>;
}
