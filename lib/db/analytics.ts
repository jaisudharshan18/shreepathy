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

  // Build real revenue-by-month for the last 6 months (ending this month)
  const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-indexed

  // Build a map keyed by "YYYY-MM" → total revenue
  const keyMap = new Map<string, number>()
  for (const ord of orders) {
    const y = ord.createdAt.getFullYear()
    const m = ord.createdAt.getMonth()
    const key = `${y}-${String(m).padStart(2, '0')}`
    keyMap.set(key, (keyMap.get(key) ?? 0) + ord.totalValue)
  }

  // Generate last 6 months in chronological order
  const revenueByMonth: RevenueByMonth[] = []
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i
    let y = currentYear
    if (m < 0) {
      m += 12
      y -= 1
    }
    const key = `${y}-${String(m).padStart(2, '0')}`
    revenueByMonth.push({
      month: SHORT_MONTHS[m],
      revenue: keyMap.get(key) ?? 0,
    })
  }

  return { revenue, customerCount, leadCount, orderCount, revenueByMonth }
}

// ── Best-Selling Products ─────────────────────────────────────────────────────

export interface BestSeller {
  rank: number
  product: string
  unitsSold: number
}

export async function getBestSellers(): Promise<BestSeller[]> {
  const [items, products] = await Promise.all([
    prisma.orderItem.findMany({ select: { productId: true, qty: true, name: true } }),
    prisma.product.findMany({ select: { id: true, name: true } }),
  ])

  const productNameMap = new Map(products.map((p) => [p.id, p.name]))
  const qtyMap = new Map<string, { name: string; qty: number }>()

  for (const item of items) {
    const existing = qtyMap.get(item.productId)
    const name = productNameMap.get(item.productId) ?? item.name
    if (existing) {
      existing.qty += item.qty
    } else {
      qtyMap.set(item.productId, { name, qty: item.qty })
    }
  }

  return Array.from(qtyMap.entries())
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5)
    .map(([, { name, qty }], i) => ({
      rank: i + 1,
      product: name,
      unitsSold: qty,
    }))
}

// ── Repeat Customers ──────────────────────────────────────────────────────────

export async function getRepeatCustomerPct(): Promise<string> {
  const [customers, orders] = await Promise.all([
    prisma.customerProfile.findMany({ select: { id: true } }),
    prisma.order.findMany({ select: { customerId: true } }),
  ])

  const total = customers.length
  if (total === 0) return '0%'

  const orderCountByCustomer = new Map<string, number>()
  for (const o of orders) {
    orderCountByCustomer.set(o.customerId, (orderCountByCustomer.get(o.customerId) ?? 0) + 1)
  }

  const repeat = customers.filter((c) => (orderCountByCustomer.get(c.id) ?? 0) > 1).length
  return `${Math.round((repeat / total) * 100)}%`
}

// ── At-Risk Customers ─────────────────────────────────────────────────────────

export interface AtRiskCustomer {
  customer: string
  lastOrder: string
  note: string
}

export async function getAtRiskCustomers(): Promise<AtRiskCustomer[]> {
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)

  const [customers, orders] = await Promise.all([
    prisma.customerProfile.findMany({ select: { id: true, businessName: true } }),
    prisma.order.findMany({ select: { customerId: true, createdAt: true } }),
  ])

  // Build map customerId → most recent order date
  const lastOrderMap = new Map<string, Date>()
  for (const o of orders) {
    const existing = lastOrderMap.get(o.customerId)
    if (!existing || o.createdAt > existing) {
      lastOrderMap.set(o.customerId, o.createdAt)
    }
  }

  return customers
    .map((c) => {
      const last = lastOrderMap.get(c.id) ?? null
      return { id: c.id, businessName: c.businessName, lastOrder: last }
    })
    .filter((c) => !c.lastOrder || c.lastOrder < sixtyDaysAgo)
    .sort((a, b) => {
      if (!a.lastOrder && !b.lastOrder) return 0
      if (!a.lastOrder) return -1
      if (!b.lastOrder) return 1
      return a.lastOrder.getTime() - b.lastOrder.getTime()
    })
    .slice(0, 5)
    .map((c) => ({
      customer: c.businessName,
      lastOrder: c.lastOrder ? c.lastOrder.toISOString().slice(0, 10) : 'No orders',
      note: c.lastOrder ? 'No order in 60+ days' : 'No orders placed',
    }))
}
