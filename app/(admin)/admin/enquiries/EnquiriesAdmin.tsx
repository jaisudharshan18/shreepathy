'use client'

import { useTransition } from 'react'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Enquiry } from '@/lib/generated/prisma/client'
import { setEnquiryHandledAction, deleteEnquiryAction } from './actions'

interface Props {
  enquiries: Enquiry[]
}

export default function EnquiriesAdmin({ enquiries }: Props) {
  const [isPending, startTransition] = useTransition()

  const columns: Column<Enquiry>[] = [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'business',
      header: 'Business',
      render: (row) => <span>{row.business ?? '—'}</span>,
    },
    { key: 'products', header: 'Products' },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row) => <span>{row.quantity ?? '—'}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (row) => <span>{row.location ?? '—'}</span>,
    },
    {
      key: 'handled',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.handled ? 'default' : 'secondary'}>
          {row.handled ? 'Handled' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => <span>{row.createdAt.toISOString().slice(0, 10)}</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              startTransition(async () => {
                await setEnquiryHandledAction(fd)
              })
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="handled" value={String(!row.handled)} />
            <Button size="sm" variant="outline" type="submit" disabled={isPending}>
              {row.handled ? 'Mark Unhandled' : 'Mark Handled'}
            </Button>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!window.confirm(`Delete enquiry from "${row.name}"?`)) return
              const fd = new FormData(e.currentTarget)
              startTransition(async () => {
                await deleteEnquiryAction(fd)
              })
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <Button size="sm" variant="destructive" type="submit" disabled={isPending}>
              Delete
            </Button>
          </form>
        </div>
      ),
    },
  ]

  const pending = enquiries.filter((e) => !e.handled).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Enquiries</h1>
          {pending > 0 && (
            <p className="text-sm text-muted-foreground">{pending} pending</p>
          )}
        </div>
      </div>

      <DataTable columns={columns} data={enquiries} />
    </div>
  )
}
