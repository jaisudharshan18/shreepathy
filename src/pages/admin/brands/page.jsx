import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getBrands } from "@/lib/db/catalog";
import BrandsAdmin from "./BrandsAdmin";
async function BrandsPage() {
  await requireAdmin();
  const brands = await getBrands();
  return <BrandsAdmin brands={brands} />;
}

export default createAsyncPage(BrandsPage);
