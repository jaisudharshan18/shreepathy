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
import type { ProductWithRelations } from '@/lib/db/catalog'
import type { Brand, Category } from '@/lib/generated/prisma/client'
import type { StockStatus } from '@/lib/generated/prisma/client'
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from './actions'

// ── constants ─────────────────────────────────────────────────────────────────

const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'In Stock',
  low: 'Low',
  out_of_stock: 'Out of Stock',
}

const STOCK_VARIANTS: Record<StockStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  in_stock: 'default',
  low: 'secondary',
  out_of_stock: 'destructive',
}

// ── types ─────────────────────────────────────────────────────────────────────

interface Props {
  products: ProductWithRelations[]
  brands: Brand[]
  categories: Category[]
}

// Select state tracked separately (shadcn/base-ui Select is not a native input)
interface SelectState {
  brandId: string
  categoryId: string
  stockStatus: StockStatus
}

// ── component ─────────────────────────────────────────────────────────────────

export default function ProductsAdmin({ products, brands, categories }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ProductWithRelations | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const defaultBrandId = brands[0]?.id ?? ''
  const defaultCategoryId = categories[0]?.id ?? ''

  const [selects, setSelects] = useState<SelectState>({
    brandId: defaultBrandId,
    categoryId: defaultCategoryId,
    stockStatus: 'in_stock',
  })

  const formRef = useRef<HTMLFormElement>(null)

  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.name]))
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  function openAdd() {
    setEditing(null)
    setError(null)
    setSelects({
      brandId: defaultBrandId,
      categoryId: defaultCategoryId,
      stockStatus: 'in_stock',
    })
    setDialogOpen(true)
  }

  function openEdit(p: ProductWithRelations) {
    setEditing(p)
    setError(null)
    setSelects({
      brandId: p.brandId,
      categoryId: p.categoryId,
      stockStatus: p.stockStatus,
    })
    setDialogOpen(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    // Inject Select values into FormData (they are not native inputs)
    fd.set('brandId', selects.brandId)
    fd.set('categoryId', selects.categoryId)
    fd.set('stockStatus', selects.stockStatus)

    startTransition(async () => {
      const result = editing
        ? await updateProductAction(fd)
        : await createProductAction(fd)

      if ('error' in result) {
        setError(result.error)
      } else {
        setDialogOpen(false)
        setError(null)
      }
    })
  }

  const columns: Column<ProductWithRelations>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'brandId',
      header: 'Brand',
      render: (row) => <span>{brandMap[row.brandId] ?? row.brandId}</span>,
    },
    {
      key: 'categoryId',
      header: 'Category',
      render: (row) => <span>{categoryMap[row.categoryId] ?? row.categoryId}</span>,
    },
    {
      key: 'stockStatus',
      header: 'Stock',
      render: (row) => (
        <Badge variant={STOCK_VARIANTS[row.stockStatus]}>{STOCK_LABELS[row.stockStatus]}</Badge>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      render: (row) => <span>{row.isFeatured ? '✓' : '—'}</span>,
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
              if (!window.confirm(`Delete "${row.name}"?`)) return
              const fd = new FormData(e.currentTarget)
              startTransition(async () => {
                const result = await deleteProductAction(fd)
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

  const firstVariant = editing?.variants[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button onClick={openAdd}>Add Product</Button>
      </div>

      <DataTable columns={columns} data={products} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>

          <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Hidden id for edit */}
            {editing && <input type="hidden" name="id" value={editing.id} />}

            {/* Hidden existing URLs for edit — kept when no new file uploaded */}
            {editing && (
              <>
                <input
                  type="hidden"
                  name="existingImageUrl"
                  value={editing.images[0] ?? ''}
                />
                <input
                  type="hidden"
                  name="existingGlbUrl"
                  value={editing.modelGlb ?? ''}
                />
              </>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Brand</Label>
                  {/* Hidden input carries value into FormData; Select updates it */}
                  <input type="hidden" name="brandId" value={selects.brandId} />
                  <Select
                    value={selects.brandId}
                    onValueChange={(v) => { if (v) setSelects((s) => ({ ...s, brandId: v })) }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label>Category</Label>
                  <input type="hidden" name="categoryId" value={selects.categoryId} />
                  <Select
                    value={selects.categoryId}
                    onValueChange={(v) => { if (v) setSelects((s) => ({ ...s, categoryId: v })) }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                <Label>Stock Status</Label>
                <input type="hidden" name="stockStatus" value={selects.stockStatus} />
                <Select
                  value={selects.stockStatus}
                  onValueChange={(v) => {
                    if (v) setSelects((s) => ({ ...s, stockStatus: v as StockStatus }))
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={editing?.isFeatured ?? false}
                  key={editing?.id ?? 'new-featured'}
                  value="on"
                  className="size-4"
                />
                <Label htmlFor="isFeatured">Featured product</Label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label>Pack Size</Label>
                  <Input
                    name="packSize"
                    placeholder="e.g. 1 kg"
                    defaultValue={firstVariant?.size ?? ''}
                    key={editing?.id ?? 'new-packsize'}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    name="packPrice"
                    placeholder="e.g. 220"
                    defaultValue={firstVariant?.price != null ? String(firstVariant.price) : ''}
                    key={editing?.id ?? 'new-packprice'}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label>
                  Product Image
                  {editing?.images[0] && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (leave blank to keep existing)
                    </span>
                  )}
                </Label>
                <Input type="file" name="image" accept="image/*" />
              </div>

              <div className="grid gap-1">
                <Label>
                  3D Model (.glb / .gltf)
                  {editing?.modelGlb && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (leave blank to keep existing)
                    </span>
                  )}
                </Label>
                <Input type="file" name="model" accept=".glb,.gltf" />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : editing ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
