'use client'

import { useState } from 'react'
import { orders as mockOrders, customers, products } from '@/lib/mock/data'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatINR } from '@/lib/utils'
import { pointsForOrder } from '@/lib/mock/loyalty'
import type { Order } from '@/lib/types'

type OrderRow = Order & Record<string, unknown>

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Delivered: 'default',
  Processing: 'secondary',
  Confirmed: 'outline',
  Cancelled: 'destructive',
}

interface FormState {
  customerId: string
  productId: string
  qty: string
  unitValue: string
}

const empty: FormState = {
  customerId: customers[0]?.id ?? '',
  productId: products[0]?.id ?? '',
  qty: '1',
  unitValue: '',
}

export default function OrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>(() => [...mockOrders] as OrderRow[])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<FormState>(empty)
  const [loyaltyNote, setLoyaltyNote] = useState<string | null>(null)

  const customerMap = Object.fromEntries(customers.map(c => [c.id, c.businessName]))
  const productMap = Object.fromEntries(products.map(p => [p.id, p.name]))

  const columns: Column<OrderRow>[] = [
    { key: 'id', header: 'Order ID' },
    {
      key: 'customerId',
      header: 'Customer',
      render: (row) => <span>{customerMap[row.customerId as string] ?? row.customerId}</span>,
    },
    {
      key: 'items',
      header: 'Items',
      render: (row) => {
        const items = row.items as Order['items']
        return <span>{items.length}</span>
      },
    },
    {
      key: 'totalValue',
      header: 'Total',
      render: (row) => <span>{formatINR(row.totalValue as number)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const s = row.status as string
        return <Badge variant={STATUS_VARIANT[s] ?? 'outline'}>{s}</Badge>
      },
    },
    { key: 'createdAt', header: 'Date' },
  ]

  function openAdd() {
    setForm(empty)
    setLoyaltyNote(null)
    setDialogOpen(true)
  }

  function handleSave() {
    const qty = parseInt(form.qty, 10) || 1
    const unitValue = parseFloat(form.unitValue) || 0
    const total = qty * unitValue
    const product = products.find(p => p.id === form.productId)
    const order: Order = {
      id: `ord-${Date.now()}`,
      customerId: form.customerId,
      items: [
        {
          productId: form.productId,
          name: product?.name ?? form.productId,
          size: product?.variants[0]?.size ?? '',
          qty,
          unitValue,
        },
      ],
      totalValue: total,
      status: 'Confirmed',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    const pts = pointsForOrder(total)
    console.log('[Admin] Order save:', order, `Loyalty: +${pts} pts (Phase 2)`)
    setLoyaltyNote(`Would award ${pts} loyalty points (Phase 2).`)
    setRows(prev => [...prev, order as OrderRow])
    // Keep dialog open briefly to show loyalty note, close on next open
  }

  const set = (k: keyof FormState, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Orders</h1>
        <Button onClick={openAdd}>Log Order</Button>
      </div>

      <DataTable columns={columns} data={rows} />

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setLoyaltyNote(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Order</DialogTitle>
            <DialogDescription>Phase 1: single-line order. Multi-item support in Phase 2.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Customer</Label>
              <Select value={form.customerId} onValueChange={v => { if (v != null) set('customerId', v) }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.businessName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Product</Label>
              <Select value={form.productId} onValueChange={v => { if (v != null) set('productId', v) }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.qty}
                  onChange={e => set('qty', e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Unit Value (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.unitValue}
                  onChange={e => set('unitValue', e.target.value)}
                />
              </div>
            </div>

            {form.qty && form.unitValue && (
              <p className="text-sm text-muted-foreground">
                Total: <strong>{formatINR((parseInt(form.qty, 10) || 0) * (parseFloat(form.unitValue) || 0))}</strong>
              </p>
            )}

            {loyaltyNote && (
              <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                ✓ Order logged. {loyaltyNote}
              </p>
            )}
          </div>

          <DialogFooter showCloseButton>
            {!loyaltyNote && (
              <Button onClick={handleSave} disabled={!form.customerId || !form.unitValue}>
                Log Order
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
