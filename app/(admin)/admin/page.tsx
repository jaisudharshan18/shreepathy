import Link from 'next/link'
import { BarChart3, Package, UserPlus } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'
import { getAnalyticsSummary } from '@/lib/db/analytics'
import { getLeads } from '@/lib/db/crm'
import { getEnquiries } from '@/lib/db/crm'
import { StatCard } from '@/components/admin/StatCard'
import { formatINR } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default async function AdminDashboardPage() {
  await requireAdmin()

  const [summary, allLeads, allEnquiries] = await Promise.all([
    getAnalyticsSummary(),
    getLeads(),
    getEnquiries(),
  ])

  const recentLeads = allLeads.slice(0, 5)
  const recentEnquiries = allEnquiries.slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here&apos;s a quick overview.
        </p>
      </div>

      {/* Stat cards */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Summary statistics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={formatINR(summary.revenue)}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            label="Customers"
            value={summary.customerCount}
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            label="Leads"
            value={summary.leadCount}
            icon={<UserPlus className="h-5 w-5" />}
          />
          <StatCard
            label="Orders"
            value={summary.orderCount}
            icon={<Package className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Recent lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <section className="rounded-xl bg-card ring-1 ring-foreground/10 p-5 flex flex-col gap-3" aria-labelledby="recent-leads-heading">
          <div className="flex items-center justify-between">
            <h2 id="recent-leads-heading" className="text-sm font-semibold text-foreground">
              Recent Leads
            </h2>
            <Link href="/admin/leads" className="text-xs text-brand-magenta hover:underline font-medium">
              View all
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground truncate">{lead.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {lead.businessName ?? '—'} &middot; {lead.source}
                  </span>
                </div>
                <Badge variant={
                  lead.status === 'New' ? 'default' :
                  lead.status === 'Contacted' ? 'secondary' :
                  lead.status === 'Converted' ? 'outline' : 'destructive'
                }>
                  {lead.status}
                </Badge>
              </li>
            ))}
            {recentLeads.length === 0 && (
              <li className="text-sm text-muted-foreground">No leads yet.</li>
            )}
          </ul>
        </section>

        {/* Recent Enquiries */}
        <section className="rounded-xl bg-card ring-1 ring-foreground/10 p-5 flex flex-col gap-3" aria-labelledby="recent-enquiries-heading">
          <div className="flex items-center justify-between">
            <h2 id="recent-enquiries-heading" className="text-sm font-semibold text-foreground">
              Recent Enquiries
            </h2>
            <Link href="/admin/enquiries" className="text-xs text-brand-magenta hover:underline font-medium">
              View all
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recentEnquiries.map((enq) => (
              <li key={enq.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground truncate">{enq.name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {enq.products} &middot; {enq.location ?? '—'}
                  </span>
                </div>
                <Badge variant={enq.handled ? 'outline' : 'default'}>
                  {enq.handled ? 'Handled' : 'Open'}
                </Badge>
              </li>
            ))}
            {recentEnquiries.length === 0 && (
              <li className="text-sm text-muted-foreground">No enquiries yet.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Quick-link buttons */}
      <section aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className="text-sm font-semibold text-foreground mb-3">
          Quick Links
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <UserPlus className="h-4 w-4" />
            Leads
          </Link>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-2 rounded-md bg-brand-magenta px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
        </div>
      </section>
    </div>
  )
}
