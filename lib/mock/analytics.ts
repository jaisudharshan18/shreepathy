import { orders, customers, leads } from './data'
export function getAnalyticsSummary() {
  const revenue = orders.reduce((s, o) => s + o.totalValue, 0)
  return {
    revenue,
    customerCount: customers.length,
    leadCount: leads.length,
    orderCount: orders.length,
    revenueByMonth: [
      { month: 'Jan', revenue: revenue * 0.15 }, { month: 'Feb', revenue: revenue * 0.18 },
      { month: 'Mar', revenue: revenue * 0.22 }, { month: 'Apr', revenue: revenue * 0.20 },
      { month: 'May', revenue: revenue * 0.25 },
    ],
  }
}
