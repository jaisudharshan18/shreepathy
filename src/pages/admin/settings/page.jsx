import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/db/settings";
import SettingsAdmin from "./SettingsAdmin";
async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return <SettingsAdmin settings={settings} />;
}

export default createAsyncPage(SettingsPage);
