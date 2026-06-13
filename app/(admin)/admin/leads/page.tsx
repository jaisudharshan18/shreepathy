'use client'

import { useState } from 'react'
import { leads as mockLeads } from '@/lib/mock/data'
import { DataTable, type Column } from '@/components/admin/DataTable'
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
import type { Lead, LeadStatus } from '@/lib/types'

type LeadRow = Lead & Record<string, unknown>

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Converted', 'Lost']

interface FormState {
  name: string
  businessName: string
  phone: string
  source: string
  notes: string
}

const empty: FormState = { name: '', businessName: '', phone: '', source: '', notes: '' }

function formFromLead(l: Lead): FormState {
  return {
    name: l.name,
    businessName: l.businessName ?? '',
    phone: l.phone,
    source: l.source,
    notes: l.notes ?? '',
  }
}

export default function LeadsPage() {
  const [rows, setRows] = useState<LeadRow[]>(() => [...mockLeads] as LeadRow[])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [form, setForm] = useState<FormState>(empty)

  function updateStatus(id: string, status: LeadStatus) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const columns: Column<LeadRow>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'businessName',
      header: 'Business',
      render: (row) => <span>{(row.businessName as string) ?? '—'}</span>,
    },
    { key: 'phone', header: 'Phone' },
    { key: 'source', header: 'Source' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Select
          value={row.status as LeadStatus}
          onValueChange={(v) => { if (v != null) updateStatus(row.id as string, v as LeadStatus) }}
        >
          <SelectTrigger size="sm" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    { key: 'createdAt', header: 'Date' },
    {
      key: 'id',
      header: 'Actions',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            setEditing(row as Lead)
            setForm(formFromLead(row as Lead))
            setDialogOpen(true)
          }}
        >
          Edit Notes
        </Button>
      ),
    },
  ]

  function openAdd() {
    setEditing(null)
    setForm(empty)
    setDialogOpen(true)
  }

  function handleSave() {
    if (editing) {
      setRows(prev => prev.map(r =>
        r.id === editing.id
          ? {
              ...r,
              name: form.name,
              businessName: form.businessName || undefined,
              phone: form.phone,
              source: form.source,
              notes: form.notes || undefined,
            }
          : r
      ))
      console.log('[Admin] Lead update:', editing.id, form)
    } else {
      const lead: Lead = {
        id: `lead-${Date.now()}`,
        name: form.name,
        businessName: form.businessName || undefined,
        phone: form.phone,
        source: form.source,
        status: 'New',
        notes: form.notes || undefined,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      console.log('[Admin] Lead save:', lead)
      setRows(prev => [...prev, lead as LeadRow])
    }
    setDialogOpen(false)
  }

  const set = (k: keyof FormState, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Leads</h1>
        <Button onClick={openAdd}>Add Lead</Button>
      </div>

      <DataTable columns={columns} data={rows} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Business Name</Label>
              <Input value={form.businessName} onChange={e => set('businessName', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label>Source</Label>
                <Input placeholder="e.g. WhatsApp, Referral" value={form.source} onChange={e => set('source', e.target.value)} />
              </div>
            </div>
            <div className="grid gap-1">
              <Label>Notes</Label>
              <Textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button onClick={handleSave} disabled={!form.name}>
              {editing ? 'Save Changes' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
