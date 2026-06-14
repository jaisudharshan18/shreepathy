import { requireAdmin } from '@/lib/auth'
import { getFaqs } from '@/lib/db/crm'
import ChatbotAdmin from './ChatbotAdmin'

export default async function ChatbotPage() {
  await requireAdmin()
  const faqs = await getFaqs()
  return <ChatbotAdmin faqs={faqs} />
}
