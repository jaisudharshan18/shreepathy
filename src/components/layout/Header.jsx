"use client";
import { Link } from 'react-router-dom';
import { useState } from "react";
import { Menu } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { useLocation } from 'react-router-dom';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];
const WA_MESSAGE = "Hi Shreepathy & Co, I would like to enquire about your wholesale ingredients.";

export function Header({ authSlot }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-bakery-cream/95 backdrop-blur-md shadow-xs border-b border-bakery-beige">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo / name */}
        <Link to="/"
          className="text-xl font-serif font-extrabold tracking-tight text-bakery-chocolate hover:text-bakery-brown transition-colors"
        >
          Shreepathy &amp; Co
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => {
            const isActive = location.pathname === href;
            return (
              <Link key={href}
                to={href}
                className={`text-sm font-semibold transition-colors ${
                  isActive ? "text-bakery-brown font-bold" : "text-bakery-chocolate/85 hover:text-bakery-brown"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA + Auth slot + Mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Auth-aware links (Login / Account + Logout) */}
          {authSlot && <div className="hidden md:flex items-center gap-3">{authSlot}</div>}
          <a
            href={whatsappLink(WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center rounded-full bg-bakery-chocolate px-5 py-2 text-sm font-bold text-white shadow-xs hover:bg-bakery-brown hover:shadow-md transition-all duration-300"
          >
            Order via WhatsApp
          </a>

          {/* Mobile menu — Sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-bakery-chocolate hover:bg-bakery-beige/40 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-bakery-cream border-l border-bakery-beige">
              <SheetHeader>
                <SheetTitle className="text-bakery-chocolate font-serif text-lg font-bold text-left">
                  Shreepathy &amp; Co
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 px-4 pt-6"
                aria-label="Mobile navigation"
              >
                {navLinks.map(({ href, label }) => {
                  const isActive = location.pathname === href;
                  return (
                    <Link key={href}
                      to={href}
                      onClick={() => setOpen(false)}
                      className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                        isActive ? "bg-bakery-beige/60 text-bakery-brown font-bold" : "text-bakery-chocolate hover:bg-bakery-beige/30"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-4 pt-6">
                <a
                  href={whatsappLink(WA_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-bakery-chocolate px-4 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-bakery-brown hover:shadow-md transition-all duration-300"
                >
                  Order via WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
