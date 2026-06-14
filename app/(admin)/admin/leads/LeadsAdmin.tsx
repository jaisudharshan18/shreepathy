'use client'

import { useState, useRef, useTransition } from 'react'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import type { Lead, LeadStatus } from '@/lib/generated/prisma/client'
import {
  updateLeadStatusAction,
  updateLeadAction,
  deleteLeadAction,
} from './actions'

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Converted', 'Lost']

const STATUS_VARIANT: Record<LeadStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  New: 'default',
  Contacted: 'secondary',
  Converted: 'outline',
  Lost: 'destructive',
}

interface Props {
  leads: Lead[]
}

export default function LeadsAdmin({ leads }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [statusSelect, setStatusSelect] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  function getStatus(lead: Lead): LeadStatus {
    return (statusSelect[lead.id] as LeadStatus) ?? lead.status
  }

  function openEdit(lead: Lead) {
    setEditing(lead)
    setError(null)
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await updateLeadAction(fd)
      if ('error' in result) {
        setError(result.error)
      } else {
        setDialogOpen(false)
        setError(null)
      }
    })
  }

  const columns: Column<Lead>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'businessName',
      header: 'Business',
      render: (row) => <span>{row.businessName ?? '—'}</span>,
    },
    { key: 'phone', header: 'Phone' },
    { key: 'source', header: 'Source' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const current = getStatus(row)
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              startTransition(async () => {
                const result = await updateLeadStatusAction(fd)
                if ('error' in result) setError(result.error)
              })
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="status" value={current} />
            <Select
              value={current}
              onValueChange={(v) => {
                if (!v) return
                setStatusSelect((prev) => ({ ...prev, [row.id]: v }))
                // auto-submit on change
                const fd = new FormData()
                fd.set('id', row.id)
                fd.set('status', v)
                startTransition(async () => {
                  const result = await updateLeadStatusAction(fd)
                  if ('error' in result) setError(result.error)
                })
              }}
            >
              <SelectTrigger size="sm" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <Badge variant={STATUS_VARIANT[s]}>{s}</Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        )
      },
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
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              openEdit(row)
            }}
          >
            Edit
          </Button>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!window.confirm(`Delete lead "${row.name}"?`)) return
              const fd = new FormData(e.currentTarget)
              startTransition(async () => {
                const result = await deleteLeadAction(fd)
                if ('error' in result) setError(result.error)
              })
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <Button size="sm" variant="destructive" type="submit">
              Delete
            </Button>
          </form>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Leads</h1>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DataTable columns={columns} data={leads} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>

          <form ref={formRef} onSubmit={handleSubmit}>
            {editing && <input type="hidden" name="id" value={editing.id} />}

            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  defaultValue={editing?.name ?? ''}
                  key={editing?.id ?? 'name'}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label>Business Name</Label>
                <Input
                  name="businessName"
                  defaultValue={editing?.businessName ?? ''}
                  key={editing?.id ?? 'biz'}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    defaultValue={editing?.phone ?? ''}
                    key={editing?.id ?? 'phone'}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Assigned To</Label>
                  <Input
                    name="assignedTo"
                    defaultValue={editing?.assignedTo ?? ''}
                    key={editing?.id ?? 'assigned'}
                    placeholder="e.g. sales@..."
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  defaultValue={editing?.notes ?? ''}
                  key={editing?.id ?? 'notes'}
                  rows={3}
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
