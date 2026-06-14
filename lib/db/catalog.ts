import { prisma } from '@/lib/db/client'
import { Prisma, StockStatus } from '@/lib/generated/prisma/client'

// ── Shared include shape ─────────────────────────────────────────────────────

const productInclude = {
  variants: true,
  brand: true,
  category: true,
} satisfies Prisma.ProductInclude

// ── Exported type ─────────────────────────────────────────────────────────────

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude
}>

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ProductWithRelations[]> {
  return prisma.product.findMany({ include: productInclude })
}

export async function getProduct(
  slug: string,
): Promise<ProductWithRelations | null> {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  })
}

export async function searchProducts(q: string): Promise<ProductWithRelations[]> {
  return prisma.product.findMany({
    where: {
      name: { contains: q, mode: 'insensitive' },
    },
    include: productInclude,
  })
}

export interface ProductFilter {
  categoryId?: string
  brandId?: string
  size?: string
}

export async function filterProducts(
  f: ProductFilter,
): Promise<ProductWithRelations[]> {
  const where: Prisma.ProductWhereInput = {}

  if (f.categoryId) where.categoryId = f.categoryId
  if (f.brandId) where.brandId = f.brandId
  if (f.size) where.variants = { some: { size: f.size } }

  return prisma.product.findMany({ where, include: productInclude })
}

// ── Brands ────────────────────────────────────────────────────────────────────

export async function getBrands() {
  return prisma.brand.findMany()
}

export async function getBrand(slug: string) {
  return prisma.brand.findUnique({ where: { slug } })
}

export async function getBrandById(id: string) {
  return prisma.brand.findUnique({ where: { id } })
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function getCategory(slug: string) {
  return prisma.category.findUnique({ where: { slug } })
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } })
}

// ── Product write repo ────────────────────────────────────────────────────────

export interface ProductVariantInput {
  size: string
  price?: number | null
  image?: string | null
}

export interface ProductWriteData {
  name: string
  slug: string
  brandId: string
  categoryId: string
  description: string
  images: string[]
  modelGlb?: string | null
  stockStatus: StockStatus
  isFeatured: boolean
  variants: ProductVariantInput[]
}

export async function createProduct(data: ProductWriteData) {
  const { variants, ...fields } = data
  return prisma.product.create({
    data: {
      ...fields,
      variants: {
        create: variants,
      },
    },
    include: productInclude,
  })
}

export async function updateProduct(id: string, data: ProductWriteData) {
  const { variants, ...fields } = data
  return prisma.product.update({
    where: { id },
    data: {
      ...fields,
      variants: {
        deleteMany: {},
        create: variants,
      },
    },
    include: productInclude,
  })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}
