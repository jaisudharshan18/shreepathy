import { requireAdmin } from '@/lib/auth'
import { getSettings } from '@/lib/db/settings'
import SettingsAdmin from './SettingsAdmin'

export default async function SettingsPage() {
  await requireAdmin()
  const settings = await getSettings()
  return <SettingsAdmin settings={settings} />
}
