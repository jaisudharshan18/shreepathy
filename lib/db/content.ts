import { prisma } from '@/lib/db/client'

export interface SiteContentData {
  heroHeadline: string
  heroSubtext: string
  ctaLabel: string
  aboutCopy: string
  contactPhone: string
  contactEmail: string
  contactAddress: string
  mapEmbedUrl: string
}

export async function getSiteContent(): Promise<SiteContentData | null> {
  return prisma.siteContent.findUnique({ where: { id: 'singleton' } })
}

export async function upsertSiteContent(data: SiteContentData) {
  return prisma.siteContent.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...data },
    update: data,
  })
}
