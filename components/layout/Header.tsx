'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { whatsappLink } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/brands', label: 'Brands' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const WA_MESSAGE = 'Hi Shreepathy & Co, I would like to enquire about your products.'

interface HeaderProps {
  authSlot?: React.ReactNode
}

export function Header({ authSlot }: HeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-navy shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo / name */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white hover:text-brand-magenta transition-colors"
        >
          Shreepathy &amp; Co
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-white/90 hover:text-brand-magenta transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA + Auth slot + Mobile hamburger */}
        <div className="flex items-center gap-3">
          {/* Auth-aware links (Login / Account + Logout) */}
          {authSlot && (
            <div className="hidden md:flex items-center gap-3">
              {authSlot}
            </div>
          )}

          <a
            href={whatsappLink(WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center rounded-full bg-brand-magenta px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
          >
            Order via WhatsApp
          </a>

          {/* Mobile menu — Sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-72 bg-white">
              <SheetHeader>
                <SheetTitle className="text-brand-navy text-lg font-bold">
                  Shreepathy &amp; Co
                </SheetTitle>
              </SheetHeader>

              <nav
                className="flex flex-col gap-1 px-4 pt-4"
                aria-label="Mobile navigation"
              >
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-brand-navy hover:bg-brand-navy/5 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="px-4 pt-6">
                <a
                  href={whatsappLink(WA_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-brand-magenta px-4 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
                >
                  Order via WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
