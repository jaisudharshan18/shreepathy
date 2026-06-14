"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
export function FilterSidebar({ categories, brands, sizes = [], onChange }) {
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedSize, setSelectedSize] = useState();
  function update(patch) {
    const cat = "cat" in patch ? patch.cat : selectedCategory;
    const brand = "brand" in patch ? patch.brand : selectedBrand;
    const size = "size" in patch ? patch.size : selectedSize;
    const filter = {};
    if (cat) filter.categoryId = cat;
    if (brand) filter.brandId = brand;
    if (size) filter.size = size;
    onChange(filter);
  }
  function toggleCategory(id) {
    const next = selectedCategory === id ? void 0 : id;
    setSelectedCategory(next);
    update({ cat: next });
  }
  function toggleBrand(id) {
    const next = selectedBrand === id ? void 0 : id;
    setSelectedBrand(next);
    update({ brand: next });
  }
  function toggleSize(s) {
    const next = selectedSize === s ? void 0 : s;
    setSelectedSize(next);
    update({ size: next });
  }
  return <aside className="space-y-6">{
    /* Categories */
  }<div><h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </h3><ul className="space-y-1">{categories.map((cat) => <li key={cat.id}><button
    type="button"
    onClick={() => toggleCategory(cat.id)}
    className={cn(
      "w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors",
      selectedCategory === cat.id ? "bg-brand-navy text-white font-medium" : "hover:bg-muted text-foreground"
    )}
  >{cat.name}</button></li>)}</ul></div>{
    /* Brands */
  }<div><h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Brand
        </h3><ul className="space-y-1">{brands.map((brand) => <li key={brand.id}><button
    type="button"
    onClick={() => toggleBrand(brand.id)}
    className={cn(
      "w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors",
      selectedBrand === brand.id ? "bg-brand-navy text-white font-medium" : "hover:bg-muted text-foreground"
    )}
  >{brand.name}</button></li>)}</ul></div>{
    /* Pack Sizes */
  }<div><h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Pack Size
        </h3><ul className="space-y-1">{sizes.map((size) => <li key={size}><button
    type="button"
    onClick={() => toggleSize(size)}
    className={cn(
      "w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors",
      selectedSize === size ? "bg-brand-navy text-white font-medium" : "hover:bg-muted text-foreground"
    )}
  >{size}</button></li>)}</ul></div></aside>;
}
