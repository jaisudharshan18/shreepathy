import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getProducts, getBrands, getCategories } from "@/lib/db/catalog";
import ProductsAdmin from "./ProductsAdmin";
async function ProductsPage() {
  await requireAdmin();
  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories()
  ]);
  return <ProductsAdmin products={products} brands={brands} categories={categories} />;
}

export default createAsyncPage(ProductsPage);
