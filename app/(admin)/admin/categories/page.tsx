'use client'

import { useState } from 'react'
import { categories as mockCategories } from '@/lib/mock/data'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { slugify } from '@/lib/utils'
import type { Category } from '@/lib/types'

type CategoryRow = Category & Record<string, unknown>

interface FormState {
  name: string
  sortOrder: string
}

const empty: FormState = { name: '', sortOrder: '' }

function formFromCategory(c: Category): FormState {
  return { name: c.name, sortOrder: String(c.sortOrder) }
}

export default function CategoriesPage() {
  const [rows, setRows] = useState<CategoryRow[]>(() => [...mockCategories] as CategoryRow[])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<FormState>(empty)

  const columns: Column<CategoryRow>[] = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    { key: 'sortOrder', header: 'Sort Order' },
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
              setEditing(row as Category)
              setForm(formFromCategory(row as Category))
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
    const category: Category = {
      id: editing?.id ?? `cat-${Date.now()}`,
      name: form.name,
      slug: slugify(form.name),
      sortOrder: parseInt(form.sortOrder, 10) || 0,
    }
    console.log('[Admin] Category save:', category)
    if (editing) {
      setRows(prev => prev.map(r => (r.id === editing.id ? (category as CategoryRow) : r)))
    } else {
      setRows(prev => [...prev, category as CategoryRow])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Button onClick={openAdd}>Add Category</Button>
      </div>

      <DataTable columns={columns} data={rows} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={e => setForm(prev => ({ ...prev, sortOrder: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button onClick={handleSave} disabled={!form.name}>
              {editing ? 'Save Changes' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
