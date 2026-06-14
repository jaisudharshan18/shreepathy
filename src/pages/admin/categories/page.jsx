import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/db/catalog";
import CategoriesAdmin from "./CategoriesAdmin";
async function CategoriesPage() {
  await requireAdmin();
  const categories = await getCategories();
  return <CategoriesAdmin categories={categories} />;
}

export default createAsyncPage(CategoriesPage);
