import { requireAdmin } from '@/lib/auth'
import { getBrands } from '@/lib/db/catalog'
import BrandsAdmin from './BrandsAdmin'

export default async function BrandsPage() {
  await requireAdmin()
  const brands = await getBrands()
  return <BrandsAdmin brands={brands} />
}
