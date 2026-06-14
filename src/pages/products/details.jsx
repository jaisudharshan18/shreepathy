import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
;
import { Link } from 'react-router-dom';
import { getProduct, filterProducts, getProducts } from "@/lib/db/catalog";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductViewer3D } from "@/components/catalog/ProductViewer3D";
import { whatsappLink, formatINR } from "@/lib/utils";
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found at Shreepathy & Co."
    };
  }
  return {
    title: product.name,
    description: product.description
  };
}
function StockBadge({ status }) {
  if (status === "in_stock") {
    return <Badge className="bg-green-100 text-green-800 border-green-200">In Stock</Badge>;
  }
  if (status === "low") {
    return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Low Stock</Badge>;
  }
  return <Badge className="bg-red-100 text-red-800 border-red-200">Out of Stock</Badge>;
}
async function ProductDetailPage({
  params
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return <div className="p-8 text-center text-muted-foreground">Not Found</div>;
  const related = (await filterProducts({ categoryId: product.categoryId })).filter((p) => p.id !== product.id).slice(0, 4);
  const waMessage = `Hi, I'd like to order ${product.name}.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : void 0,
    category: product.category?.name
  };
  return <div className="container mx-auto px-4 py-10 space-y-12"><script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />{
    /* Product detail section */
  }<div className="grid grid-cols-1 gap-10 lg:grid-cols-2">{
    /* Left — media */
  }<div>{product.modelGlb ? <ProductViewer3D src={product.modelGlb} alt={product.name} /> : <div className="space-y-4">{product.images.map((src, i) => <img
    key={i}
    src={src}
    alt={`${product.name} image ${i + 1}`}
    className="w-full rounded-lg object-cover"
  />)}</div>}</div>{
    /* Right — info */
  }<div className="space-y-5"><div className="space-y-2"><h1 className="text-2xl font-bold text-brand-navy">{product.name}</h1>{product.brand && <p className="text-sm text-muted-foreground">
                by{" "}<Link to={`/brands/${product.brand.slug}`}
    className="text-brand-magenta hover:underline font-medium"
  >{product.brand.name}</Link></p>}<StockBadge status={product.stockStatus} /></div><p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>{
    /* Pack size / variant selector */
  }{product.variants.length > 0 && <div className="space-y-2"><h3 className="text-sm font-semibold">Pack Sizes</h3><div className="flex flex-wrap gap-2">{product.variants.map((v, i) => <div
    key={i}
    className="flex flex-col items-center rounded-md border border-input px-3 py-2 text-sm min-w-[72px]"
  ><span className="font-medium">{v.size}</span>{v.price != null && <span className="text-xs text-muted-foreground">{formatINR(v.price)}</span>}</div>)}</div></div>}{
    /* Action buttons */
  }<div className="flex flex-wrap gap-3 pt-2"><a
    href={whatsappLink(waMessage)}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center rounded-full bg-brand-magenta px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
  >
              Order via WhatsApp
            </a><Link to="/contact"
    className="inline-flex items-center justify-center rounded-full border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
  >
              Request Quote
            </Link></div></div></div>{
    /* Related products */
  }{related.length > 0 && <div className="space-y-4"><h2 className="text-xl font-bold text-brand-navy">Related Products</h2><ProductGrid products={related} /></div>}</div>;
}

export default createAsyncPage(ProductDetailPage);
