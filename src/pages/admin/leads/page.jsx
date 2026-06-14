import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getLeads } from "@/lib/db/crm";
import LeadsAdmin from "./LeadsAdmin";
async function LeadsPage() {
  await requireAdmin();
  const leads = await getLeads();
  return <LeadsAdmin leads={leads} />;
}

export default createAsyncPage(LeadsPage);
