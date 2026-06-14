import { prisma } from '@/lib/db/client'
import type { LeadStatus } from '@/lib/generated/prisma/client'

export async function getLeads() {
  return prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getCustomers() {
  return prisma.customerProfile.findMany()
}

export async function getEnquiries() {
  return prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } })
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

// ── Lead write repo ───────────────────────────────────────────────────────────

export interface LeadWriteData {
  name: string
  phone: string
  businessName?: string | null
  notes?: string | null
  assignedTo?: string | null
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  return prisma.lead.update({ where: { id }, data: { status } })
}

export async function updateLead(id: string, data: LeadWriteData) {
  return prisma.lead.update({ where: { id }, data })
}

export async function deleteLead(id: string) {
  return prisma.lead.delete({ where: { id } })
}

// ── Enquiry write repo ────────────────────────────────────────────────────────

export interface EnquiryCreateData {
  name: string
  phone: string
  business?: string
  products: string
  quantity?: string
  location?: string
  message?: string
}

export async function createEnquiry(data: EnquiryCreateData) {
  return prisma.enquiry.create({ data })
}

export async function setEnquiryHandled(id: string, handled: boolean) {
  return prisma.enquiry.update({ where: { id }, data: { handled } })
}

export async function deleteEnquiry(id: string) {
  return prisma.enquiry.delete({ where: { id } })
}

// ── Lead create repo ──────────────────────────────────────────────────────────

export interface LeadCreateData {
  source: string
  name: string
  phone: string
  businessName?: string
  notes?: string
}

export async function createLead(data: LeadCreateData) {
  return prisma.lead.create({ data: { ...data, status: 'New' } })
}
