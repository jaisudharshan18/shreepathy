'use client'

import { useState } from 'react'
import { enquiries as mockEnquiries } from '@/lib/mock/data'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Enquiry } from '@/lib/types'

type EnquiryRow = Enquiry & Record<string, unknown>

export default function EnquiriesPage() {
  const [rows, setRows] = useState<EnquiryRow[]>(() => [...mockEnquiries] as EnquiryRow[])

  function toggleHandled(id: string) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, handled: !r.handled } : r))
  }

  const columns: Column<EnquiryRow>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'business',
      header: 'Business',
      render: (row) => <span>{(row.business as string) ?? '—'}</span>,
    },
    { key: 'products', header: 'Products' },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row) => <span>{(row.quantity as string) ?? '—'}</span>,
    },
    {
      key: 'location',
      header: 'Location',
      render: (row) => <span>{(row.location as string) ?? '—'}</span>,
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
      key: 'id',
      header: 'Action',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            toggleHandled(row.id as string)
          }}
        >
          {row.handled ? 'Mark Unhandled' : 'Mark Handled'}
        </Button>
      ),
    },
  ]

  const pending = rows.filter(r => !r.handled).length

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

      <DataTable columns={columns} data={rows} />
    </div>
  )
}
