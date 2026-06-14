import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { Link } from 'react-router-dom';
import { getProducts, getBrands, getCategories } from "@/lib/db/catalog";
import { whatsappLink } from "@/lib/utils";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { HeroSection } from "@/components/HeroSection";

async function HomePage() {
  const [allProducts, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands()
  ]);
  const featuredProducts = allProducts.filter((p) => p.isFeatured);
  
  return (
    <div className="flex flex-col bg-bakery-cream">
      <HeroSection />

      {/* ── Featured Categories ───────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white border-b border-bakery-beige/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-chocolate">
              Ingredient Categories
            </h2>
            <p className="text-sm sm:text-base text-bakery-chocolate/75 mt-3 font-medium">
              Comprehensive supply chain solutions for every baking and culinary requirement
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group relative flex flex-col items-center justify-between rounded-2xl border border-bakery-beige/80 bg-bakery-cream/10 p-6 text-center shadow-xs hover:border-bakery-brown/50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual indicator for categories */}
                <div className="w-12 h-12 rounded-full bg-bakery-cream flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.slug.includes("raw-material") ? "🌾" :
                   category.slug.includes("items") ? "🍞" :
                   category.slug.includes("syrup") ? "🍹" :
                   category.slug.includes("fast-food") ? "🍔" :
                   category.slug.includes("hotel") ? "🏨" :
                   category.slug.includes("milk") ? "🥛" :
                   category.slug.includes("ice-cream") ? "🍦" :
                   category.slug.includes("frozen") ? "❄️" : "🥐"}
                </div>
                <span className="text-sm font-bold text-bakery-chocolate group-hover:text-bakery-brown transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bakery-beige/10 border-b border-bakery-beige/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-chocolate">
                Featured Ingredients
              </h2>
              <p className="text-sm text-bakery-chocolate/75 mt-2 font-medium">
                Our most in-demand products trusted by commercial kitchens
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-bakery-brown hover:text-bakery-chocolate transition-colors self-start sm:self-auto"
            >
              View all products →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* ── Authorized Brands Showcase ───────────────────────────────────── */}
      <section className="py-20 px-4 bg-white border-b border-bakery-beige/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-chocolate">
              Authorized Partner Brands
            </h2>
            <p className="text-sm sm:text-base text-bakery-chocolate/75 mt-3 font-medium">
              Direct partnerships with industry leaders ensuring authentic quality and consistent supply
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-bakery-beige/80 bg-bakery-cream/10 p-6 text-left hover:border-bakery-brown/50 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base font-serif font-extrabold tracking-tight text-bakery-chocolate group-hover:text-bakery-brown transition-colors">
                      {brand.name}
                    </span>
                    <span className="text-[10px] uppercase font-extrabold text-bakery-brown tracking-wider bg-bakery-beige px-2.5 py-0.5 rounded-full">
                      Partner
                    </span>
                  </div>
                  <p className="text-xs text-bakery-chocolate/70 line-clamp-3 leading-relaxed font-medium">
                    {brand.description || "Premium ingredient solutions for professional bakers."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-bakery-beige/30 flex items-center justify-between text-[11px] font-bold text-bakery-brown/80 group-hover:text-bakery-chocolate">
                  <span>View Products</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mini About & Credibility ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bakery-beige/15 border-b border-bakery-beige/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & Features */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-chocolate leading-tight">
                Why Bakeries &amp; Cafes Partner with Shreepathy &amp; Co
              </h2>
              <p className="text-sm sm:text-base text-bakery-chocolate/75 leading-relaxed font-medium">
                Over the last decade, we have established ourselves as Tamil Nadu's premier distributor of premium baking raw materials and food service ingredients. We bridge the gap between world-class ingredient brands and your kitchen.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex gap-3">
                  <span className="text-2xl mt-0.5" role="img" aria-label="Authorized badge">🌟</span>
                  <div>
                    <h4 className="font-extrabold text-bakery-chocolate text-sm">Direct Brand Authorization</h4>
                    <p className="text-xs text-bakery-chocolate/65 mt-1 font-medium">Genuine stock sourced directly from brands like Pillsbury, Morde, Rich's, and Monin.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl mt-0.5" role="img" aria-label="Logistics badge">🚚</span>
                  <div>
                    <h4 className="font-extrabold text-bakery-chocolate text-sm">Temperature-Controlled Logistics</h4>
                    <p className="text-xs text-bakery-chocolate/65 mt-1 font-medium">Ensuring dairy, frozen products, and chocolate compounds reach you in perfect condition.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl mt-0.5" role="img" aria-label="Stock badge">⚡</span>
                  <div>
                    <h4 className="font-extrabold text-bakery-chocolate text-sm">Consistent Stocking</h4>
                    <p className="text-xs text-bakery-chocolate/65 mt-1 font-medium">We maintain deep reserves of high-demand ingredients to prevent operational pauses in your kitchen.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl mt-0.5" role="img" aria-label="Support badge">💬</span>
                  <div>
                    <h4 className="font-extrabold text-bakery-chocolate text-sm">Seamless WhatsApp Support</h4>
                    <p className="text-xs text-bakery-chocolate/65 mt-1 font-medium">Direct access to sales managers for swift orders, inventory status, and credit statements.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Numbers Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-bakery-beige/80 shadow-xs text-center flex flex-col justify-center items-center">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-brown">10+</span>
                <span className="text-[10px] font-extrabold text-bakery-chocolate/70 uppercase tracking-wider mt-2">Years of Service</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-bakery-beige/80 shadow-xs text-center flex flex-col justify-center items-center">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-brown">15+</span>
                <span className="text-[10px] font-extrabold text-bakery-chocolate/70 uppercase tracking-wider mt-2">Partner Brands</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-bakery-beige/80 shadow-xs text-center flex flex-col justify-center items-center">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-brown">5+</span>
                <span className="text-[10px] font-extrabold text-bakery-chocolate/70 uppercase tracking-wider mt-2">Districts Covered</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-bakery-beige/80 shadow-xs text-center flex flex-col justify-center items-center">
                <span className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-brown">100%</span>
                <span className="text-[10px] font-extrabold text-bakery-chocolate/70 uppercase tracking-wider mt-2">Quality Assured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wholesale B2B CTA ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-bakery-chocolate text-white relative overflow-hidden">
        {/* Decorative blob in CTA background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="absolute -right-[10%] -bottom-[20%] w-[500px] h-[500px] text-white fill-current" viewBox="0 0 200 200">
            <path d="M42.2,-58.5C53.7,-50.2,61.4,-36.2,65.3,-21.2C69.3,-6.2,69.5,9.8,63.9,23.3C58.3,36.8,47,47.8,33.8,55.9C20.6,64.1,5.5,69.4,-9.7,67.9C-24.9,66.4,-40.1,58.2,-50.9,46.7C-61.8,35.2,-68.2,20.4,-69.6,4.9C-70.9,-10.6,-67.1,-26.8,-57.8,-39C-48.4,-51.2,-33.5,-59.4,-18.8,-63.3C-4.1,-67.2,10.4,-66.8,42.2,-58.5Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          <span className="text-xs font-bold tracking-widest uppercase text-bakery-brown bg-white/10 px-3.5 py-1 rounded-full">
            B2B Ingredient Supply
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white leading-tight">
            Ready to Optimize Your Bakery Supply Chain?
          </h2>
          <p className="text-sm sm:text-base text-bakery-beige/80 max-w-xl mx-auto leading-relaxed font-medium">
            Get custom wholesale pricing, credit terms, and logistical plans designed specifically for your business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-bakery-brown px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-bakery-brown/20 hover:bg-white hover:text-bakery-chocolate transition-all duration-300"
            >
              Request Wholesale Quote
            </Link>
            <a
              href={whatsappLink("Hi Shreepathy & Co, I'd like to talk to a B2B sales manager.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-xs px-8 py-3.5 text-sm font-bold text-white hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              Consult on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default createAsyncPage(HomePage);
