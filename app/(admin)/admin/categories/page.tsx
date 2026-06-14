import { requireAdmin } from '@/lib/auth'
import { getCategories } from '@/lib/db/catalog'
import CategoriesAdmin from './CategoriesAdmin'

export default async function CategoriesPage() {
  await requireAdmin()
  const categories = await getCategories()
  return <CategoriesAdmin categories={categories} />
}
