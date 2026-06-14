import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
;
import { filterProducts, getCategory, getCategories } from "@/lib/db/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found at Shreepathy & Co."
    };
  }
  return {
    title: category.name,
    description: `Browse ${category.name} products available wholesale at Shreepathy & Co — bakery and food ingredient specialists.`
  };
}
async function CategoryPage({
  params
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return <div className="p-8 text-center text-muted-foreground">Not Found</div>;
  const categoryProducts = await filterProducts({ categoryId: category.id });
  return <div className="container mx-auto px-4 py-10 space-y-6"><h1 className="text-3xl font-bold text-brand-navy">{category.name}</h1><p className="text-sm text-muted-foreground">{categoryProducts.length} {categoryProducts.length === 1 ? "product" : "products"}</p><ProductGrid products={categoryProducts} /></div>;
}

export default createAsyncPage(CategoryPage);
