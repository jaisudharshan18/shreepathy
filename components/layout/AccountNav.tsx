'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/account', label: 'Profile' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/rewards', label: 'Rewards' },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Account navigation"
      className="flex flex-row gap-1 border-b border-border pb-0 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-4 md:min-w-[160px]"
    >
      {navItems.map(({ href, label }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-navy text-white'
                : 'text-foreground hover:bg-brand-navy/10 hover:text-brand-navy'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
