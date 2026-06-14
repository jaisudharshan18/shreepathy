import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getCustomers } from "@/lib/db/crm";
import LoyaltyAdmin from "./LoyaltyAdmin";
async function LoyaltyPage() {
  await requireAdmin();
  const customers = await getCustomers();
  return <LoyaltyAdmin customers={customers} />;
}

export default createAsyncPage(LoyaltyPage);
