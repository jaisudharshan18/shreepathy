'use client'

import { getAnalyticsSummary } from '@/lib/mock/analytics'
import { orders, customers, products } from '@/lib/mock/data'
import { StatCard } from '@/components/admin/StatCard'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import { BarChart3, Package, UserPlus, Users } from 'lucide-react'

// ── Best-Selling Products ────────────────────────────────────────────────────
// Aggregate qty sold per productId across all orders.items, join to product name,
// sort descending, return top 5.
interface BestSeller extends Record<string, unknown> {
  rank: number
  product: string
  unitsSold: number
}

function getBestSellers(): BestSeller[] {
  const qtyMap: Record<string, number> = {}
  for (const order of orders) {
    for (const item of order.items) {
      qtyMap[item.productId] = (qtyMap[item.productId] ?? 0) + item.qty
    }
  }
  const productNameMap = Object.fromEntries(products.map(p => [p.id, p.name]))
  return Object.entries(qtyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([productId, unitsSold], i) => ({
      rank: i + 1,
      product: productNameMap[productId] ?? productId,
      unitsSold,
    }))
}

// ── Repeat Customers ─────────────────────────────────────────────────────────
// Count of orders per customerId; customers with >1 order are "repeat".
function getRepeatCustomerPct(): string {
  const orderCountByCustomer: Record<string, number> = {}
  for (const order of orders) {
    orderCountByCustomer[order.customerId] = (orderCountByCustomer[order.customerId] ?? 0) + 1
  }
  const total = customers.length
  if (total === 0) return '0%'
  const repeat = customers.filter(c => (orderCountByCustomer[c.id] ?? 0) > 1).length
  return `${Math.round((repeat / total) * 100)}%`
}

// ── At-Risk Customers ─────────────────────────────────────────────────────────
// Heuristic: customers with 0 orders OR whose most recent order is the oldest.
// In Phase 2 this will flag customers with no order in the last 60+ days.
interface AtRiskRow extends Record<string, unknown> {
  customer: string
  lastOrder: string
  heuristic: string
}

function getAtRiskCustomers(): AtRiskRow[] {
  // Build map of customerId → most recent order date
  const lastOrderMap: Record<string, string> = {}
  for (const order of orders) {
    const prev = lastOrderMap[order.customerId]
    if (!prev || order.createdAt > prev) {
      lastOrderMap[order.customerId] = order.createdAt
    }
  }

  return customers
    .map(c => ({
      id: c.id,
      businessName: c.businessName,
      lastOrder: lastOrderMap[c.id] ?? null,
    }))
    .sort((a, b) => {
      // No orders first, then by oldest order date
      if (!a.lastOrder && !b.lastOrder) return 0
      if (!a.lastOrder) return -1
      if (!b.lastOrder) return 1
      return a.lastOrder < b.lastOrder ? -1 : 1
    })
    .slice(0, 3)
    .map(c => ({
      customer: c.businessName,
      lastOrder: c.lastOrder ?? 'No orders',
      heuristic: c.lastOrder ? 'Oldest last order (Phase 2: flags 60+ day inactivity)' : 'No orders placed',
    }))
}

const bestSellerColumns: Column<BestSeller>[] = [
  { key: 'rank', header: '#' },
  { key: 'product', header: 'Product' },
  { key: 'unitsSold', header: 'Units Sold' },
]

const atRiskColumns: Column<AtRiskRow>[] = [
  { key: 'customer', header: 'Customer' },
  { key: 'lastOrder', header: 'Last Order' },
  { key: 'heuristic', header: 'Note' },
]

export default function AnalyticsPage() {
  const summary = getAnalyticsSummary()
  const bestSellers = getBestSellers()
  const repeatPct = getRepeatCustomerPct()
  const atRisk = getAtRiskCustomers()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatINR(summary.revenue)}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <StatCard
          label="Customers"
          value={summary.customerCount}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Leads"
          value={summary.leadCount}
          icon={<UserPlus className="h-5 w-5" />}
        />
        <StatCard
          label="Orders"
          value={summary.orderCount}
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart data={summary.revenueByMonth} />
        </CardContent>
      </Card>

      {/* Best-Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle>Best-Selling Products (Top 5)</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Aggregated from all order items — units sold per product.
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={bestSellerColumns} data={bestSellers} />
        </CardContent>
      </Card>

      {/* Repeat Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Repeat Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-brand-magenta">{repeatPct}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Percentage of registered customers who have placed more than one order.
          </p>
        </CardContent>
      </Card>

      {/* At-Risk Customers */}
      <Card>
        <CardHeader>
          <CardTitle>At-Risk Customers</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Customers with no orders or the oldest last-order date. Phase 2 will flag customers with no order in 60+ days.
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={atRiskColumns} data={atRisk} />
        </CardContent>
      </Card>
    </div>
  )
}
