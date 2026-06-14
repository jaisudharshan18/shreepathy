import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { Link } from 'react-router-dom';
export const metadata = {
  title: "About Us | Shreepathy & Co",
  description: "Learn about Shreepathy & Co — wholesale bakery and food ingredient suppliers serving Tamil Nadu since over a decade."
};
const trustSignals = [
  { label: "Years in Business", value: "10+" },
  { label: "Brands Carried", value: "15+" },
  { label: "Product Categories", value: "8" },
  { label: "Cities Served", value: "5+" }
];
async function AboutPage() {
  return (
    <div className="bg-bakery-cream min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase text-bakery-brown bg-bakery-beige px-3 py-1 rounded-full">
            Our Story &amp; Values
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold text-bakery-chocolate">
            About Shreepathy &amp; Co
          </h1>
          <p className="text-base sm:text-lg text-bakery-chocolate/75 font-medium leading-relaxed">
            Tamil Nadu's trusted wholesale partner for bakery raw materials, dairy, frozen
            foods, and beverage ingredients.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          {trustSignals.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-2xl border border-bakery-beige bg-white p-6 text-center shadow-xs"
            >
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-bakery-brown">
                {value}
              </span>
              <span className="mt-2 text-xs font-bold text-bakery-chocolate/70 uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Business Intro & Content Grid */}
        <div className="bg-white rounded-3xl border border-bakery-beige/80 p-8 sm:p-12 shadow-xs space-y-10 text-left">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-extrabold text-bakery-chocolate">
              Who We Are
            </h2>
            <p className="text-sm sm:text-base text-bakery-chocolate/85 leading-relaxed font-medium">
              Shreepathy &amp; Co is a wholesale food ingredient distributor based in Tamil Nadu, India.
              We specialise in sourcing, stocking, and supplying premium bakery raw materials,
              dairy products, frozen foods, mojito syrups, hotel ingredients, and ice cream flavour
              bases to businesses across the region.
            </p>
            <p className="text-sm sm:text-base text-bakery-chocolate/85 leading-relaxed font-medium">
              Whether you run a bakery, quick-service restaurant, cloud kitchen, hotel, or catering
              business, we have the ingredients you need — delivered reliably and at competitive
              wholesale prices.
            </p>
          </div>

          <div className="border-t border-bakery-beige/50 pt-8 space-y-4">
            <h2 className="text-2xl font-serif font-extrabold text-bakery-chocolate">
              Coverage Area
            </h2>
            <p className="text-sm sm:text-base text-bakery-chocolate/85 leading-relaxed font-medium">
              We currently deliver across <strong className="text-bakery-brown font-extrabold">Bangalore</strong>, <strong className="text-bakery-brown font-extrabold">Mysore</strong>, <strong className="text-bakery-brown font-extrabold">Mangalore</strong>, <strong className="text-bakery-brown font-extrabold">Hubli-Dharwad</strong>, and surrounding districts
              in Tamil Nadu. Pan-India dispatch is available for orders above ₹10,000 via reliable courier partners.
            </p>
          </div>

          <div className="border-t border-bakery-beige/50 pt-8 space-y-4">
            <h2 className="text-2xl font-serif font-extrabold text-bakery-chocolate">
              Why Choose Us
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-bakery-chocolate/85 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-bakery-brown mt-0.5 font-bold">✓</span>
                <span>Authorised distributor for leading brands: Pillsbury, Rich's, Morde, Monin, Amul, and more.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bakery-brown mt-0.5 font-bold">✓</span>
                <span>Consistent stock of fast-moving SKUs — no waiting weeks for restocks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bakery-brown mt-0.5 font-bold">✓</span>
                <span>Flexible ordering options — from single cartons to truckload quantities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bakery-brown mt-0.5 font-bold">✓</span>
                <span>Quick WhatsApp ordering with real-time availability and support.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bakery-brown mt-0.5 font-bold">✓</span>
                <span>Credit terms available for established commercial accounts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-bakery-brown mt-0.5 font-bold">✓</span>
                <span>Sample units available for large-order ingredient evaluations.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-16">
          <Link
            to="/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-bakery-brown px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-bakery-brown/10 hover:bg-bakery-chocolate transition-all duration-300"
          >
            Get in Touch
          </Link>
          <Link
            to="/products"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border-2 border-bakery-chocolate/20 bg-white/40 backdrop-blur-xs px-8 py-3.5 text-sm font-bold text-bakery-chocolate hover:bg-white hover:border-bakery-chocolate transition-all duration-300"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

export default createAsyncPage(AboutPage);
