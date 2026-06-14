import { requireAdmin } from '@/lib/auth'
import { getSiteContent } from '@/lib/db/content'
import ContentAdmin from './ContentAdmin'

export default async function ContentPage() {
  await requireAdmin()
  const content = await getSiteContent()
  return <ContentAdmin content={content} />
}
