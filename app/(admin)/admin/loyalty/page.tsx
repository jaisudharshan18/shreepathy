import { requireAdmin } from '@/lib/auth'
import { getCustomers } from '@/lib/db/crm'
import LoyaltyAdmin from './LoyaltyAdmin'

export default async function LoyaltyPage() {
  await requireAdmin()
  const customers = await getCustomers()
  return <LoyaltyAdmin customers={customers} />
}
