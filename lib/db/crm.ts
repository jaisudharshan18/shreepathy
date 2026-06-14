import { prisma } from '@/lib/db/client'

export async function getLeads() {
  return prisma.lead.findMany()
}

export async function getCustomers() {
  return prisma.customerProfile.findMany()
}

export async function getEnquiries() {
  return prisma.enquiry.findMany()
}

export async function getFaqs() {
  return prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } })
}
