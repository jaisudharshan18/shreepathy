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
