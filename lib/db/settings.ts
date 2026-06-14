import { prisma } from '@/lib/db/client'

export interface SettingsData {
  whatsappNumber: string
  businessName: string
  businessHours: string
  seoTitle: string
  seoDescription: string
}

export async function getSettings(): Promise<SettingsData | null> {
  return prisma.settings.findUnique({ where: { id: 'singleton' } })
}

export async function upsertSettings(data: SettingsData) {
  return prisma.settings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...data },
    update: data,
  })
}
