import { prisma } from '@/lib/db/client'
import { tierForValue, pointsForOrder } from '@/lib/loyalty'
import { isBirthdayToday, generateBirthdayCode } from '@/lib/birthday'
import { sendEmail } from '@/lib/email'
import type { Tier } from '@/lib/generated/prisma/client'

export const REFERRAL_POINTS = 500

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

// ── Referral credit ──────────────────────────────────────────────────────────

export async function creditReferral(referrerCode: string, referredId: string) {
  const referrer = await prisma.customerProfile.findUnique({
    where: { referralCode: referrerCode },
  })
  if (!referrer || referrer.id === referredId) return null

  return prisma.$transaction(async (tx) => {
    const referral = await tx.referral.create({
      data: {
        referrerId: referrer.id,
        referredId,
        code: referrerCode,
        status: 'credited',
        pointsAwarded: REFERRAL_POINTS,
      },
    })
    await tx.loyaltyEntry.create({
      data: {
        customerId: referrer.id,
        pointsDelta: REFERRAL_POINTS,
        reason: `Referral: ${referredId}`,
      },
    })
    await tx.customerProfile.update({
      where: { id: referrer.id },
      data: { pointsBalance: { increment: REFERRAL_POINTS } },
    })
    return referral
  })
}

// ── Birthday offers ───────────────────────────────────────────────────────────

export async function runBirthdayOffers(today: Date) {
  const customers = await prisma.customerProfile.findMany({
    where: { birthday: { not: null } },
  })

  const results: { customerId: string; businessName: string; code: string }[] = []

  for (const customer of customers) {
    if (!isBirthdayToday(customer.birthday, today)) continue

    const code = generateBirthdayCode(customer, today)

    await prisma.loyaltyEntry.create({
      data: {
        customerId: customer.id,
        pointsDelta: 0,
        reason: `Birthday offer ${code}`,
      },
    })

    if (customer.email) {
      await sendEmail({
        to: customer.email,
        subject: 'Your birthday gift from Shreepathy & Co',
        html: `<p>Happy Birthday, ${customer.contactName}!</p><p>Use code <strong>${code}</strong> for your special birthday discount. Valid this month only.</p>`,
      })
    }

    results.push({ customerId: customer.id, businessName: customer.businessName, code })
  }

  return results
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
