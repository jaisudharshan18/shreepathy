import { requireAdmin } from '@/lib/auth'
import {
  getAnalyticsSummary,
  getBestSellers,
  getRepeatCustomerPct,
  getAtRiskCustomers,
} from '@/lib/db/analytics'
import { StatCard } from '@/components/admin/StatCard'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import { BarChart3, Package, UserPlus, Users } from 'lucide-react'
import type { BestSeller, AtRiskCustomer } from '@/lib/db/analytics'

const bestSellerColumns: Column<BestSeller & Record<string, unknown>>[] = [
  { key: 'rank', header: '#' },
  { key: 'product', header: 'Product' },
  { key: 'unitsSold', header: 'Units Sold' },
]

const atRiskColumns: Column<AtRiskCustomer & Record<string, unknown>>[] = [
  { key: 'customer', header: 'Customer' },
  { key: 'lastOrder', header: 'Last Order' },
  { key: 'note', header: 'Note' },
]

export default async function AnalyticsPage() {
  await requireAdmin()

  const [summary, bestSellers, repeatPct, atRisk] = await Promise.all([
    getAnalyticsSummary(),
    getBestSellers(),
    getRepeatCustomerPct(),
    getAtRiskCustomers(),
  ])

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
          <DataTable
            columns={bestSellerColumns}
            data={bestSellers.map((b) => ({ ...b } as BestSeller & Record<string, unknown>))}
          />
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
            Customers with no order in the last 60 days, or no orders placed.
          </p>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={atRiskColumns}
            data={atRisk.map((r) => ({ ...r } as AtRiskCustomer & Record<string, unknown>))}
          />
        </CardContent>
      </Card>
    </div>
  )
}
