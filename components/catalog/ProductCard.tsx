import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { whatsappLink, formatINR } from '@/lib/utils'
import type { ProductWithRelations } from '@/lib/db/catalog'

interface ProductCardProps {
  product: ProductWithRelations
}

function StockBadge({ status }: { status: ProductWithRelations['stockStatus'] }) {
  if (status === 'in_stock') {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        In Stock
      </Badge>
    )
  }
  if (status === 'low') {
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        Low Stock
      </Badge>
    )
  }
  return (
    <Badge className="bg-red-100 text-red-800 border-red-200">
      Out of Stock
    </Badge>
  )
}

export function ProductCard({ product }: ProductCardProps) {
  const prices = product.variants.map((v) => v.price).filter((p): p is number => p !== undefined && p !== null)
  const minPrice = prices.length > 0 ? Math.min(...prices) : null

  const waMessage = `Hi, I'm interested in ${product.name}.`

  return (
    <div className="flex flex-col">
      <Card className="flex flex-col h-full">
        {/* Card body links to product detail */}
        <Link
          href={`/products/${product.slug}`}
          className="flex flex-col flex-1 group"
          aria-label={`View ${product.name}`}
        >
          <div className="overflow-hidden">
            <img
              src={product.images[0] ?? '/images/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardContent className="flex flex-col gap-2 py-3 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
                {product.name}
              </h3>
              <StockBadge status={product.stockStatus} />
            </div>
            {product.brand && (
              <p className="text-xs text-muted-foreground">{product.brand.name}</p>
            )}
            {minPrice !== null && (
              <p className="text-sm font-medium text-brand-navy">
                From {formatINR(minPrice)}
              </p>
            )}
          </CardContent>
        </Link>
        {/* WhatsApp button sits OUTSIDE the Link — no nested <a> */}
        <CardFooter className="pt-2 pb-3">
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-full bg-brand-magenta px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Order via WhatsApp
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
