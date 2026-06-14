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

// ── FAQ write repo ────────────────────────────────────────────────────────────

export interface FaqWriteData {
  question: string
  answer: string
  sortOrder: number
}

export async function createFaq(data: FaqWriteData) {
  return prisma.faq.create({ data })
}

export async function updateFaq(id: string, data: FaqWriteData) {
  return prisma.faq.update({ where: { id }, data })
}

export async function deleteFaq(id: string) {
  return prisma.faq.delete({ where: { id } })
}
