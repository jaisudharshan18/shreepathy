import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getEnquiries } from "@/lib/db/crm";
import EnquiriesAdmin from "./EnquiriesAdmin";
async function EnquiriesPage() {
  await requireAdmin();
  const enquiries = await getEnquiries();
  return <EnquiriesAdmin enquiries={enquiries} />;
}

export default createAsyncPage(EnquiriesPage);
