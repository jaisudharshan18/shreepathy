import { prisma } from '@/lib/db/client'
import { tierForValue, pointsForOrder } from '@/lib/loyalty'
import type { Tier } from '@/lib/generated/prisma/client'

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

export async function getAllOrders() {
  return prisma.order.findMany({
    include: {
      items: true,
      customer: { select: { businessName: true, contactName: true } },
    },
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

// ── Customer write repo ───────────────────────────────────────────────────────

export interface CustomerUpdateData {
  businessName?: string
  contactName?: string
  phone?: string
  tier?: Tier
  pointsBalance?: number
}

export async function updateCustomer(id: string, data: CustomerUpdateData) {
  return prisma.customerProfile.update({ where: { id }, data })
}

// ── Order logging with loyalty transaction ────────────────────────────────────

export interface OrderItemInput {
  productId: string
  name: string
  size: string
  qty: number
  unitValue: number
}

export interface CreateLoggedOrderInput {
  customerId: string
  loggedBy?: string
  items: OrderItemInput[]
}

export async function createLoggedOrder(
  input: CreateLoggedOrderInput,
): Promise<{ order: { id: string; totalValue: number }; pointsAwarded: number }> {
  const total = input.items.reduce((sum, item) => sum + item.qty * item.unitValue, 0)
  const pointsAwarded = pointsForOrder(total)

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the order with items
    const order = await tx.order.create({
      data: {
        customerId: input.customerId,
        totalValue: total,
        status: 'logged',
        loggedBy: input.loggedBy ?? null,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            size: item.size,
            qty: item.qty,
            unitValue: item.unitValue,
          })),
        },
      },
    })

    // 2. Create loyalty entry
    await tx.loyaltyEntry.create({
      data: {
        customerId: input.customerId,
        pointsDelta: pointsAwarded,
        reason: `Order #${order.id}`,
        orderId: order.id,
      },
    })

    // 3. Increment points balance
    await tx.customerProfile.update({
      where: { id: input.customerId },
      data: { pointsBalance: { increment: pointsAwarded } },
    })

    // 4. Recompute cumulative LTV from all orders for this customer
    const allOrders = await tx.order.findMany({
      where: { customerId: input.customerId },
      select: { totalValue: true },
    })
    const cumulative = allOrders.reduce((sum, o) => sum + o.totalValue, 0)
    const newTier: Tier = tierForValue(cumulative)

    // 5. Update tier
    await tx.customerProfile.update({
      where: { id: input.customerId },
      data: { tier: newTier },
    })

    return order
  })

  return { order: { id: result.id, totalValue: result.totalValue }, pointsAwarded }
}
