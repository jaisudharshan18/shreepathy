import { Link } from 'react-router-dom';
import { getCategories } from "@/lib/mock/catalog";
import { whatsappLink } from "@/lib/utils";
export function Footer() {
  const year = 2026;
  const categories = getCategories();
  return <footer className="mt-16 border-t border-white/10 bg-brand-navy text-white"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">{
    /* Brand */
  }<div><h2 className="text-lg font-bold">Shreepathy &amp; Co</h2><p className="mt-3 max-w-xs text-sm text-white/70">
            Wholesale supplier of bakery raw materials, food ingredients, mojito syrups,
            milk products, frozen foods and more.
          </p></div>{
    /* Categories */
  }<div><h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">
            Categories
          </h3><ul className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">{categories.map((c) => <li key={c.id}><Link to={`/category/${c.slug}`}
    className="text-white/70 transition-colors hover:text-brand-magenta"
  >{c.name}</Link></li>)}</ul></div>{
    /* Contact */
  }<div><h3 className="text-sm font-semibold uppercase tracking-wide text-white/90">
            Contact
          </h3><ul className="mt-3 space-y-2 text-sm text-white/70"><li>Phone: +91 99999 99999</li><li>Email: info@shreepathyandco.com</li><li><a
    href={whatsappLink("Hi Shreepathy & Co, I would like to enquire about your products.")}
    target="_blank"
    rel="noopener noreferrer"
    className="transition-colors hover:text-brand-magenta"
  >
                Order via WhatsApp
              </a></li><li><Link to="/contact" className="transition-colors hover:text-brand-magenta">
                Request a Quote
              </Link></li></ul></div></div><div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} Shreepathy &amp; Co. All rights reserved.
      </div></footer>;
}
