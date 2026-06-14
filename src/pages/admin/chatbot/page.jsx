import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getFaqs } from "@/lib/db/crm";
import ChatbotAdmin from "./ChatbotAdmin";
async function ChatbotPage() {
  await requireAdmin();
  const faqs = await getFaqs();
  return <ChatbotAdmin faqs={faqs} />;
}

export default createAsyncPage(ChatbotPage);
