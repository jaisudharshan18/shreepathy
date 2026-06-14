import { requireAdmin } from '@/lib/auth'
import { getEnquiries } from '@/lib/db/crm'
import EnquiriesAdmin from './EnquiriesAdmin'

export default async function EnquiriesPage() {
  await requireAdmin()
  const enquiries = await getEnquiries()
  return <EnquiriesAdmin enquiries={enquiries} />
}
