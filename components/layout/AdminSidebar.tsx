'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  ShoppingCart,
  UserPlus,
  Users,
  Award,
  Inbox,
  Bot,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',             label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/products',    label: 'Products',    icon: Package         },
  { href: '/admin/categories',  label: 'Categories',  icon: FolderTree      },
  { href: '/admin/brands',      label: 'Brands',      icon: Tags            },
  { href: '/admin/orders',      label: 'Orders',      icon: ShoppingCart    },
  { href: '/admin/leads',       label: 'Leads',       icon: UserPlus        },
  { href: '/admin/customers',   label: 'Customers',   icon: Users           },
  { href: '/admin/loyalty',     label: 'Loyalty',     icon: Award           },
  { href: '/admin/enquiries',   label: 'Enquiries',   icon: Inbox           },
  { href: '/admin/chatbot',     label: 'Chatbot',     icon: Bot             },
  { href: '/admin/content',     label: 'Content',     icon: FileText        },
  { href: '/admin/analytics',   label: 'Analytics',   icon: BarChart3       },
  { href: '/admin/settings',    label: 'Settings',    icon: Settings        },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col bg-brand-navy min-h-screen">
      {/* Brand header */}
      <div className="border-b border-white/10 px-5 py-5">
        <span className="text-sm font-bold leading-tight text-white">
          Shreepathy &amp; Co
          <span className="ml-1 rounded bg-brand-magenta px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Admin
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          // Exact match for dashboard; prefix match for everything else
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-magenta text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
