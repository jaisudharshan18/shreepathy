import { prisma } from '@/lib/db/client'

export async function getProfile(id: string) {
  return prisma.customerProfile.findUnique({ where: { id } })
}

export async function getOrders(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProfileByUserId(userId: string) {
  return prisma.customerProfile.findUnique({ where: { userId } })
}

export async function createProfile(input: {
  userId: string
  businessName: string
  contactName: string
  phone: string
  email: string
}) {
  const referralCode = 'SHRP-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  return prisma.customerProfile.create({
    data: {
      userId: input.userId,
      businessName: input.businessName,
      contactName: input.contactName,
      phone: input.phone,
      email: input.email,
      tier: 'Silver',
      pointsBalance: 0,
      referralCode,
    },
  })
}
