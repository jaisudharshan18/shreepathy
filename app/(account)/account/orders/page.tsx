import { getCustomers } from '@/lib/db/crm'
import { getOrders } from '@/lib/db/account'
import { formatINR } from '@/lib/utils'

export const dynamic = 'force-dynamic'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'My Orders — Shreepathy & Co' }

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Delivered: 'default',
  Processing: 'secondary',
  Confirmed: 'outline',
  Cancelled: 'destructive',
}

export default async function OrdersPage() {
  const customers = await getCustomers()
  const me = customers[0]
  const orders = await getOrders(me.id)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-brand-navy">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          You have no orders yet. Place your first order via WhatsApp!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {order.items.length === 0
                    ? '—'
                    : order.items.length === 1
                    ? order.items[0].name
                    : `${order.items[0].name} +${order.items.length - 1} more`}
                </TableCell>
                <TableCell className="font-medium">{formatINR(order.totalValue)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[order.status] ?? 'outline'}>
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
