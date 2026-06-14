'use client'

import { useState, useTransition } from 'react'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatINR } from '@/lib/utils'
import type { CustomerProfile, Order, OrderItem, Tier } from '@/lib/generated/prisma/client'
import { updateCustomerAction } from './actions'

// ── types ─────────────────────────────────────────────────────────────────────

type OrderWithItems = Order & { items: OrderItem[] }

interface Props {
  customers: CustomerProfile[]
  // Map of customerId → orders (pre-computed from getAllOrders on server)
  ordersByCustomer: Record<string, OrderWithItems[]>
}

// ── constants ─────────────────────────────────────────────────────────────────

const TIER_VARIANT: Record<Tier, 'default' | 'secondary' | 'outline'> = {
  Silver: 'outline',
  Gold: 'secondary',
  Platinum: 'default',
}

const TIERS: Tier[] = ['Silver', 'Gold', 'Platinum']

// ── Mock comms/followups — Phase 2d ──────────────────────────────────────────

const MOCK_COMMS = [
  { date: '2024-06-10', type: 'WhatsApp', note: 'Sent product catalogue' },
  { date: '2024-05-22', type: 'Call', note: 'Discussed bulk order pricing' },
]

const MOCK_FOLLOWUPS = [
  { due: '2024-07-01', task: 'Check if ready for next monthly order' },
]

// ── component ─────────────────────────────────────────────────────────────────

export default function CustomersAdmin({ customers, ordersByCustomer }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<CustomerProfile | null>(null)
  const [tierSelect, setTierSelect] = useState<Tier>('Silver')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openSheet(customer: CustomerProfile) {
    setSelected(customer)
    setSheetOpen(true)
  }

  function openEdit(customer: CustomerProfile) {
    setSelected(customer)
    setTierSelect(customer.tier)
    setError(null)
    setEditOpen(true)
  }

  function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('tier', tierSelect)
    startTransition(async () => {
      const result = await updateCustomerAction(fd)
      if ('error' in result) {
        setError(result.error)
      } else {
        setEditOpen(false)
        setError(null)
      }
    })
  }

  const columns: Column<CustomerProfile>[] = [
    { key: 'businessName', header: 'Business Name' },
    { key: 'contactName', header: 'Contact' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'tier',
      header: 'Tier',
      render: (row) => (
        <Badge variant={TIER_VARIANT[row.tier]}>{row.tier}</Badge>
      ),
    },
    { key: 'pointsBalance', header: 'Points' },
    {
      key: 'id',
      header: 'LTV',
      render: (row) => {
        const orders = ordersByCustomer[row.id] ?? []
        const ltv = orders.reduce((sum, o) => sum + o.totalValue, 0)
        return <span>{formatINR(ltv)}</span>
      },
    },
    {
      key: 'registeredAt',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); openSheet(row) }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); openEdit(row) }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ]

  const selectedOrders = selected ? (ordersByCustomer[selected.id] ?? []) : []
  const ltv = selectedOrders.reduce((sum, o) => sum + o.totalValue, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">Click View to see full profile</p>
      </div>

      <DataTable columns={columns} data={customers} onRowClick={openSheet} />

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.businessName}</SheetTitle>
                <SheetDescription>
                  <Badge variant={TIER_VARIANT[selected.tier]}>{selected.tier}</Badge>
                  {' '}· {selected.pointsBalance} pts · Ref: {selected.referralCode}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 pb-4 space-y-5 mt-2">
                {/* Profile */}
                <section>
                  <h2 className="text-sm font-semibold mb-2">Profile</h2>
                  <dl className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground w-28 shrink-0">Contact</dt>
                      <dd>{selected.contactName}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground w-28 shrink-0">Phone</dt>
                      <dd>{selected.phone}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground w-28 shrink-0">Email</dt>
                      <dd>{selected.email}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground w-28 shrink-0">Registered</dt>
                      <dd>{selected.registeredAt.toISOString().slice(0, 10)}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-muted-foreground w-28 shrink-0">LTV</dt>
                      <dd className="font-semibold">{formatINR(ltv)}</dd>
                    </div>
                  </dl>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => { setSheetOpen(false); openEdit(selected) }}
                  >
                    Edit Profile
                  </Button>
                </section>

                {/* Orders */}
                <section>
                  <h2 className="text-sm font-semibold mb-2">Order History</h2>
                  {selectedOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="text-left py-1">ID</th>
                          <th className="text-left py-1">Date</th>
                          <th className="text-left py-1">Status</th>
                          <th className="text-right py-1">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrders.map((o) => (
                          <tr key={o.id} className="border-b last:border-0">
                            <td className="py-1 font-mono text-xs">{o.id.slice(0, 8)}&hellip;</td>
                            <td className="py-1">{o.createdAt.toISOString().slice(0, 10)}</td>
                            <td className="py-1">{o.status}</td>
                            <td className="py-1 text-right">{formatINR(o.totalValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>

                {/* Comms log — Phase 2d */}
                <section>
                  <h2 className="text-sm font-semibold mb-1">
                    Communications Log{' '}
                    <span className="text-muted-foreground font-normal">(Phase 2d)</span>
                  </h2>
                  <ul className="space-y-1">
                    {MOCK_COMMS.map((c, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">{c.date}</span>
                        <span className="font-medium">[{c.type}]</span>
                        <span>{c.note}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Follow-ups — Phase 2d */}
                <section>
                  <h2 className="text-sm font-semibold mb-1">
                    Follow-ups{' '}
                    <span className="text-muted-foreground font-normal">(Phase 2d)</span>
                  </h2>
                  <ul className="space-y-1">
                    {MOCK_FOLLOWUPS.map((f, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-muted-foreground w-24 shrink-0">Due {f.due}</span>
                        <span>{f.task}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <p className="text-xs text-muted-foreground border-t pt-3">
                  Comms log and follow-up editing wired in Phase 2d.
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            {selected && <input type="hidden" name="id" value={selected.id} />}

            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Business Name</Label>
                <Input
                  name="businessName"
                  defaultValue={selected?.businessName ?? ''}
                  key={selected?.id ?? 'biz'}
                />
              </div>
              <div className="grid gap-1">
                <Label>Contact Name</Label>
                <Input
                  name="contactName"
                  defaultValue={selected?.contactName ?? ''}
                  key={selected?.id ?? 'contact'}
                />
              </div>
              <div className="grid gap-1">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  defaultValue={selected?.phone ?? ''}
                  key={selected?.id ?? 'phone'}
                />
              </div>
              <div className="grid gap-1">
                <Label>Tier</Label>
                <input type="hidden" name="tier" value={tierSelect} />
                <Select
                  value={tierSelect}
                  onValueChange={(v) => { if (v) setTierSelect(v as Tier) }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Points Balance</Label>
                <Input
                  type="number"
                  name="pointsBalance"
                  defaultValue={selected?.pointsBalance ?? 0}
                  key={selected?.id ?? 'pts'}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive mb-2">{error}</p>}

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
