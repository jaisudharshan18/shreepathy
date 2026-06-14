import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { getProducts, getCategories, getBrands } from "@/lib/db/catalog";
import { CatalogBrowser } from "./CatalogBrowser";
async function ProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands()
  ]);
  return <CatalogBrowser products={products} categories={categories} brands={brands} />;
}

export default createAsyncPage(ProductsPage);
