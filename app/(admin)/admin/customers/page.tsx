'use client'

import { useState } from 'react'
import { customers as mockCustomers } from '@/lib/mock/data'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { formatINR } from '@/lib/utils'
import { getOrders } from '@/lib/mock/account'
import type { CustomerProfile, Tier } from '@/lib/types'

type CustomerRow = CustomerProfile & Record<string, unknown>

const TIER_VARIANT: Record<Tier, 'default' | 'secondary' | 'outline'> = {
  Silver: 'outline',
  Gold: 'secondary',
  Platinum: 'default',
}

const MOCK_COMMS = [
  { date: '2024-06-10', type: 'WhatsApp', note: 'Sent product catalogue' },
  { date: '2024-05-22', type: 'Call', note: 'Discussed bulk order pricing' },
  { date: '2024-04-15', type: 'Visit', note: 'In-store visit — sampled new SKUs' },
]

const MOCK_FOLLOWUPS = [
  { due: '2024-06-20', task: 'Follow up on June order delivery' },
  { due: '2024-07-01', task: 'Check if ready for next monthly order' },
]

export default function CustomersPage() {
  const [rows] = useState<CustomerRow[]>(() => [...mockCustomers] as CustomerRow[])
  const [selected, setSelected] = useState<CustomerProfile | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const columns: Column<CustomerRow>[] = [
    { key: 'businessName', header: 'Business Name' },
    { key: 'contactName', header: 'Contact' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'tier',
      header: 'Tier',
      render: (row) => {
        const t = row.tier as Tier
        return <Badge variant={TIER_VARIANT[t]}>{t}</Badge>
      },
    },
    { key: 'pointsBalance', header: 'Points' },
    {
      key: 'id',
      header: 'LTV',
      render: (row) => {
        const orders = getOrders(row.id as string)
        const ltv = orders.reduce((sum, o) => sum + o.totalValue, 0)
        return <span>{formatINR(ltv)}</span>
      },
    },
  ]

  function handleRowClick(row: CustomerRow) {
    setSelected(row as CustomerProfile)
    setSheetOpen(true)
  }

  const customerOrders = selected ? getOrders(selected.id) : []
  const ltv = customerOrders.reduce((sum, o) => sum + o.totalValue, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">Click a row to view full profile</p>
      </div>

      <DataTable columns={columns} data={rows} onRowClick={handleRowClick} />

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
                    <div className="flex gap-2"><dt className="text-muted-foreground w-28 shrink-0">Contact</dt><dd>{selected.contactName}</dd></div>
                    <div className="flex gap-2"><dt className="text-muted-foreground w-28 shrink-0">Phone</dt><dd>{selected.phone}</dd></div>
                    <div className="flex gap-2"><dt className="text-muted-foreground w-28 shrink-0">Email</dt><dd>{selected.email}</dd></div>
                    <div className="flex gap-2"><dt className="text-muted-foreground w-28 shrink-0">Registered</dt><dd>{selected.registeredAt}</dd></div>
                    <div className="flex gap-2"><dt className="text-muted-foreground w-28 shrink-0">LTV</dt><dd className="font-semibold">{formatINR(ltv)}</dd></div>
                  </dl>
                </section>

                {/* Orders */}
                <section>
                  <h2 className="text-sm font-semibold mb-2">Order History</h2>
                  {customerOrders.length === 0 ? (
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
                        {customerOrders.map(o => (
                          <tr key={o.id} className="border-b last:border-0">
                            <td className="py-1">{o.id}</td>
                            <td className="py-1">{o.createdAt}</td>
                            <td className="py-1">{o.status}</td>
                            <td className="py-1 text-right">{formatINR(o.totalValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>

                {/* Comms log */}
                <section>
                  <h2 className="text-sm font-semibold mb-1">
                    Communications Log <span className="text-muted-foreground font-normal">(mock)</span>
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

                {/* Follow-ups */}
                <section>
                  <h2 className="text-sm font-semibold mb-1">
                    Follow-ups <span className="text-muted-foreground font-normal">(mock)</span>
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
                  Editing comms log and follow-ups wired in Phase 2.
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
