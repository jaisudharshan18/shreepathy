import { ProductCard } from "./ProductCard";
export function ProductGrid({ products }) {
  if (products.length === 0) {
    return <div className="flex items-center justify-center py-16 text-muted-foreground"><p className="text-base">No products found.</p></div>;
  }
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
