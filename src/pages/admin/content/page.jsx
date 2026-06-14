import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getSiteContent } from "@/lib/db/content";
import ContentAdmin from "./ContentAdmin";
async function ContentPage() {
  await requireAdmin();
  const content = await getSiteContent();
  return <ContentAdmin content={content} />;
}

export default createAsyncPage(ContentPage);
