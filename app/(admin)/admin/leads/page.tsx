import { requireAdmin } from '@/lib/auth'
import { getLeads } from '@/lib/db/crm'
import LeadsAdmin from './LeadsAdmin'

export default async function LeadsPage() {
  await requireAdmin()
  const leads = await getLeads()
  return <LeadsAdmin leads={leads} />
}
