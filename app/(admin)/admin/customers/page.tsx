import { requireAdmin } from '@/lib/auth'
import { getCustomers } from '@/lib/db/crm'
import { getAllOrders } from '@/lib/db/account'
import CustomersAdmin from './CustomersAdmin'
import type { Order, OrderItem } from '@/lib/generated/prisma/client'

type OrderWithItems = Order & { items: OrderItem[] }

export default async function CustomersPage() {
  await requireAdmin()

  const [customers, allOrders] = await Promise.all([
    getCustomers(),
    getAllOrders(),
  ])

  // Group orders by customerId for O(1) lookup in client
  const ordersByCustomer: Record<string, OrderWithItems[]> = {}
  for (const order of allOrders) {
    const { customer: _customer, ...orderWithoutCustomer } = order as typeof order & { customer: unknown }
    if (!ordersByCustomer[order.customerId]) {
      ordersByCustomer[order.customerId] = []
    }
    ordersByCustomer[order.customerId].push(orderWithoutCustomer as OrderWithItems)
  }

  return <CustomersAdmin customers={customers} ordersByCustomer={ordersByCustomer} />
}
