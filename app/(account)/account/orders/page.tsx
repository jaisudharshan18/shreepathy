import { requireUser } from '@/lib/auth'
import { getProfileByUserId, getOrders } from '@/lib/db/account'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'

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
import { Card, CardContent } from '@/components/ui/card'

export const metadata = { title: 'My Orders — Shreepathy & Co' }

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Delivered: 'default',
  Processing: 'secondary',
  Confirmed: 'outline',
  Cancelled: 'destructive',
}

export default async function OrdersPage() {
  const user = await requireUser()
  const me = await getProfileByUserId(user.id)

  if (!me) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-brand-navy">My Orders</h1>
        <Card>
          <CardContent className="py-8 text-center flex flex-col gap-4 items-center">
            <p className="text-muted-foreground">
              Your profile hasn&apos;t been set up yet. Please set up your profile before viewing orders.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-brand-magenta px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
            >
              Contact Us to Set Up Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

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
