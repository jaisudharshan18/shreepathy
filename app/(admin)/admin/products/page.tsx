'use client'

import { useState } from 'react'
import { products as mockProducts, brands, categories } from '@/lib/mock/data'
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
import { slugify } from '@/lib/utils'
import type { Product, StockStatus } from '@/lib/types'

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

type ProductRow = Product & Record<string, unknown>

interface FormState {
  name: string
  brandId: string
  categoryId: string
  description: string
  stockStatus: StockStatus
  isFeatured: boolean
  packSize: string
  packPrice: string
  imageUrl: string
  glbUrl: string
}

const empty: FormState = {
  name: '',
  brandId: brands[0]?.id ?? '',
  categoryId: categories[0]?.id ?? '',
  description: '',
  stockStatus: 'in_stock',
  isFeatured: false,
  packSize: '',
  packPrice: '',
  imageUrl: '',
  glbUrl: '',
}

function formFromProduct(p: Product): FormState {
  return {
    name: p.name,
    brandId: p.brandId,
    categoryId: p.categoryId,
    description: p.description,
    stockStatus: p.stockStatus,
    isFeatured: p.isFeatured,
    packSize: p.variants[0]?.size ?? '',
    packPrice: p.variants[0]?.price != null ? String(p.variants[0].price) : '',
    imageUrl: p.images[0] ?? '',
    glbUrl: p.modelGlb ?? '',
  }
}

export default function ProductsPage() {
  const [rows, setRows] = useState<ProductRow[]>(() => [...mockProducts] as ProductRow[])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(empty)

  const brandMap = Object.fromEntries(brands.map(b => [b.id, b.name]))
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]))

  const columns: Column<ProductRow>[] = [
    { key: 'name', header: 'Name' },
    {
      key: 'brandId',
      header: 'Brand',
      render: (row) => <span>{brandMap[row.brandId as string] ?? row.brandId}</span>,
    },
    {
      key: 'categoryId',
      header: 'Category',
      render: (row) => <span>{categoryMap[row.categoryId as string] ?? row.categoryId}</span>,
    },
    {
      key: 'stockStatus',
      header: 'Stock',
      render: (row) => {
        const s = row.stockStatus as StockStatus
        return <Badge variant={STOCK_VARIANTS[s]}>{STOCK_LABELS[s]}</Badge>
      },
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
              setEditing(row as Product)
              setForm(formFromProduct(row as Product))
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
    const price = parseFloat(form.packPrice)
    const product: Product = {
      id: editing?.id ?? `prod-${Date.now()}`,
      name: form.name,
      slug: slugify(form.name),
      brandId: form.brandId,
      categoryId: form.categoryId,
      description: form.description,
      stockStatus: form.stockStatus,
      isFeatured: form.isFeatured,
      variants: form.packSize
        ? [{ size: form.packSize, price: isNaN(price) ? undefined : price }]
        : [],
      images: form.imageUrl ? [form.imageUrl] : ['/images/placeholder.png'],
      modelGlb: form.glbUrl || undefined,
    }
    console.log('[Admin] Product save:', product)
    if (editing) {
      setRows(prev => prev.map(r => (r.id === editing.id ? (product as ProductRow) : r)))
    } else {
      setRows(prev => [...prev, product as ProductRow])
    }
    setDialogOpen(false)
  }

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Button onClick={openAdd}>Add Product</Button>
      </div>

      <DataTable columns={columns} data={rows} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label>Name</Label>
              <Input value={form.name} onChange={e => set('name', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Brand</Label>
                <Select value={form.brandId} onValueChange={v => { if (v != null) set('brandId', v) }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label>Category</Label>
                <Select value={form.categoryId} onValueChange={v => { if (v != null) set('categoryId', v) }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid gap-1">
              <Label>Stock Status</Label>
              <Select value={form.stockStatus} onValueChange={v => { if (v != null) set('stockStatus', v as StockStatus) }}>
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
                checked={form.isFeatured}
                onChange={e => set('isFeatured', e.target.checked)}
                className="size-4"
              />
              <Label htmlFor="isFeatured">Featured product</Label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label>Pack Size</Label>
                <Input
                  placeholder="e.g. 1 kg"
                  value={form.packSize}
                  onChange={e => set('packSize', e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 220"
                  value={form.packPrice}
                  onChange={e => set('packPrice', e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-1">
              <Label>Image URL <span className="text-muted-foreground text-xs">(upload wired in Phase 2)</span></Label>
              <Input
                placeholder="/images/placeholder.png"
                value={form.imageUrl}
                onChange={e => set('imageUrl', e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label>3D Model GLB URL <span className="text-muted-foreground text-xs">(upload wired in Phase 2)</span></Label>
              <Input
                placeholder="/models/sample.glb"
                value={form.glbUrl}
                onChange={e => set('glbUrl', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter showCloseButton>
            <Button onClick={handleSave} disabled={!form.name}>
              {editing ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
