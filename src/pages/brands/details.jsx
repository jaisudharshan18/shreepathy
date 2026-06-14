import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
;
import { getBrand, getBrands, filterProducts } from "@/lib/db/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: "Brand Not Found | Shreepathy & Co" };
  return {
    title: `${brand.name} Products | Shreepathy & Co`,
    description: brand.description ?? `Browse ${brand.name} products at Shreepathy & Co.`
  };
}
export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((b) => ({ slug: b.slug }));
}
async function BrandDetailPage({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return <div className="p-8 text-center text-muted-foreground">Not Found</div>;
  const brandProducts = await filterProducts({ brandId: brand.id });
  return <div className="mx-auto max-w-7xl px-4 py-16">{
    /* Brand Header */
  }<div className="mb-10"><h1 className="text-3xl font-bold text-brand-navy sm:text-4xl mb-3">{brand.name}</h1>{brand.description && <p className="text-muted-foreground max-w-2xl">{brand.description}</p>}</div>{
    /* Products */
  }<ProductGrid products={brandProducts} /></div>;
}

export default createAsyncPage(BrandDetailPage);
