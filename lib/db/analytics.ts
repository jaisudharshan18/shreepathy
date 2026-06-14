import { prisma } from '@/lib/db/client'

export interface RevenueByMonth {
  month: string
  revenue: number
}

export interface AnalyticsSummary {
  revenue: number
  customerCount: number
  leadCount: number
  orderCount: number
  revenueByMonth: RevenueByMonth[]
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [revenueAgg, customerCount, leadCount, orderCount, orders] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { totalValue: true } }),
      prisma.customerProfile.count(),
      prisma.lead.count(),
      prisma.order.count(),
      prisma.order.findMany({ select: { totalValue: true, createdAt: true } }),
    ])

  const revenue = revenueAgg._sum.totalValue ?? 0

  // Group orders by calendar month (e.g. "Jan 2024")
  const monthMap = new Map<string, number>()
  for (const ord of orders) {
    const label = ord.createdAt.toLocaleString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    monthMap.set(label, (monthMap.get(label) ?? 0) + ord.totalValue)
  }

  // Sort by date and convert to array
  const revenueByMonth: RevenueByMonth[] = Array.from(monthMap.entries())
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, rev]) => ({ month, revenue: rev }))

  return { revenue, customerCount, leadCount, orderCount, revenueByMonth }
}
