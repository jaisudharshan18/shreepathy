'use client'

import { useState } from 'react'
import { brands as mockBrands } from '@/lib/mock/data'
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
import { slugify } from '@/lib/utils'
import type { Brand } from '@/lib/types'

type BrandRow = Brand & Record<string, unknown>

interface FormState {
  name: string
  description: string
}

const empty: FormState = { name: '', description: '' }

function formFromBrand(b: Brand): FormState {
  return { name: b.name, description: b.description ?? '' }
}

export default function BrandsPage() {
  const [rows, setRows] = useState<BrandRow[]>(() => [...mockBrands] as BrandRow[])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [form, setForm] = useState<FormState>(empty)

  const columns: Column<BrandRow>[] = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <span className="line-clamp-1 max-w-xs text-muted-foreground text-sm">
          {(row.description as string) ?? '—'}
        </span>
      ),
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
              setEditing(row as Brand)
              setForm(formFromBrand(row as Brand))
              setDialogOpen(true)
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm(`Delete "${row.name}"?`)) {
                setRows(prev => prev.filter(r => r.id !== row.id))
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  function openAdd() {
    setEditing(null)
    setForm(empty)
    setDialogOpen(true)
  }

  function handleSave() {
    const brand: Brand = {
      id: editing?.id ?? `br-${Date.now()}`,
      name: form.name,
      slug: slugify(form.name),
      description: form.description || undefined,
    }
    console.log('[Admin] Brand save:', brand)
    if (editing) {
      setRows(prev => prev.map(r => (r.id === editing.id ? (brand as BrandRow) : r)))
    } else {
      setRows(prev => [...prev, brand as BrandRow])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Brands</h1>
        <Button onClick={openAdd}>Add Brand</Button>
      </div>

      <DataTable columns={columns} data={rows} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-1">
              <Label>Slug <span className="text-muted-foreground text-xs">(auto from name)</span></Label>
              <Input value={slugify(form.name)} disabled />
            </div>
            <div className="grid gap-1">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button onClick={handleSave} disabled={!form.name}>
              {editing ? 'Save Changes' : 'Add Brand'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
