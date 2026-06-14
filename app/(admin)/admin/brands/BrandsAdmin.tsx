'use client'

import { useState, useTransition } from 'react'
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
import type { Brand } from '@/lib/generated/prisma/client'
import {
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
} from './actions'

// ── types ─────────────────────────────────────────────────────────────────────

interface Props {
  brands: Brand[]
}

// ── component ─────────────────────────────────────────────────────────────────

export default function BrandsAdmin({ brands }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openAdd() {
    setEditing(null)
    setError(null)
    setDialogOpen(true)
  }

  function openEdit(b: Brand) {
    setEditing(b)
    setError(null)
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = editing
        ? await updateBrandAction(fd)
        : await createBrandAction(fd)

      if ('error' in result) {
        setError(result.error)
      } else {
        setDialogOpen(false)
        setError(null)
      }
    })
  }

  const columns: Column<Brand>[] = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <span className="line-clamp-1 max-w-xs text-muted-foreground text-sm">
          {row.description ?? '—'}
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
            onClick={(e) => { e.stopPropagation(); openEdit(row) }}
          >
            Edit
          </Button>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!window.confirm(`Delete "${row.name}"?`)) return
              const fd = new FormData(e.currentTarget)
              startTransition(async () => {
                const result = await deleteBrandAction(fd)
                if ('error' in result) setError(result.error)
              })
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <Button size="sm" variant="destructive" type="submit">Delete</Button>
          </form>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Brands</h1>
        <Button onClick={openAdd}>Add Brand</Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DataTable columns={columns} data={brands} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            {editing && (
              <input type="hidden" name="existingLogo" value={editing.logo ?? ''} />
            )}

            <div className="grid gap-3 py-2">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  defaultValue={editing?.name ?? ''}
                  key={editing?.id ?? 'new-name'}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label>Slug <span className="text-muted-foreground text-xs">(auto from name)</span></Label>
                <Input value={editing ? slugify(editing.name) : ''} disabled />
              </div>
              <div className="grid gap-1">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  defaultValue={editing?.description ?? ''}
                  key={editing?.id ?? 'new-desc'}
                  rows={3}
                />
              </div>
              <div className="grid gap-1">
                <Label>
                  Logo
                  {editing?.logo && (
                    <span className="ml-2 text-xs text-muted-foreground">(leave blank to keep existing)</span>
                  )}
                </Label>
                <Input type="file" name="logo" accept="image/*" />
              </div>
            </div>

            {error && <p className="text-sm text-destructive mb-2">{error}</p>}

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : editing ? 'Save Changes' : 'Add Brand'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
