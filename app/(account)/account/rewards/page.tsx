import { requireUser } from '@/lib/auth'
import { getProfileByUserId, getOrders } from '@/lib/db/account'
import { whatsappLink, formatINR } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Tier } from '@/lib/types'

export const metadata = { title: 'Rewards — Shreepathy & Co' }

// Tier thresholds (cumulative spend) — used for progress bar toward next tier
const TIER_THRESHOLDS: Record<Tier, { min: number; next: number | null; nextLabel: string | null }> = {
  Silver: { min: 0, next: 50_000, nextLabel: 'Gold' },
  Gold: { min: 50_000, next: 200_000, nextLabel: 'Platinum' },
  Platinum: { min: 200_000, next: null, nextLabel: null },
}

export default async function RewardsPage() {
  const user = await requireUser()
  const me = await getProfileByUserId(user.id)

  if (!me) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-brand-navy">Rewards &amp; Loyalty</h1>
        <Card>
          <CardContent className="py-8 text-center flex flex-col gap-4 items-center">
            <p className="text-muted-foreground">
              Your profile hasn&apos;t been set up yet. Please set up your profile to view your rewards.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-brand-magenta px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
            >
              Contact Us to Set Up Profile
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const orders = await getOrders(me.id)

  const cumulativeSpend = orders.reduce((sum, o) => sum + o.totalValue, 0)
  // Use stored tier as the authoritative current tier for consistent display with the Profile page
  const currentTier: Tier = me.tier as Tier
  const thresholds = TIER_THRESHOLDS[currentTier]

  // Progress toward next tier
  let progressPercent = 100
  let spendToNext = 0
  if (thresholds.next !== null) {
    const rangeStart = thresholds.min
    const rangeEnd = thresholds.next
    const spentInRange = Math.min(Math.max(cumulativeSpend - rangeStart, 0), rangeEnd - rangeStart)
    progressPercent = Math.round((spentInRange / (rangeEnd - rangeStart)) * 100)
    spendToNext = Math.max(rangeEnd - cumulativeSpend, 0)
  }

  const waMessage = `Join Shreepathy & Co using my referral code ${me.referralCode}`

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-brand-navy">Rewards &amp; Loyalty</h1>

      {/* Points + Tier summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Points Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-magenta">
              {me.pointsBalance.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">pts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase tracking-wide">Current Tier</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Badge variant="default" className="text-sm px-3 py-1">
              {currentTier}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatINR(cumulativeSpend)} total spend
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tier progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-brand-navy">Tier Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {thresholds.next !== null ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{currentTier}</span>
                <span className="font-medium">{thresholds.nextLabel}</span>
              </div>
              <div
                className="h-3 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${progressPercent}% toward ${thresholds.nextLabel} tier`}
              >
                <div
                  className="h-full rounded-full bg-brand-magenta transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Spend{' '}
                <strong className="text-foreground">{formatINR(spendToNext)}</strong>{' '}
                more to reach <strong className="text-foreground">{thresholds.nextLabel}</strong>.
                (Threshold: {formatINR(thresholds.next)} cumulative)
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You are at our highest tier — <strong className="text-foreground">Platinum</strong>. Thank you for your loyalty!
            </p>
          )}

          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            {(['Silver', 'Gold', 'Platinum'] as const).map((tier) => (
              <div
                key={tier}
                className={`rounded-lg border p-2 ${
                  tier === currentTier ? 'border-brand-magenta bg-brand-magenta/5 font-semibold' : 'border-border'
                }`}
              >
                <p className="font-medium">{tier}</p>
                <p className="text-muted-foreground">
                  {tier === 'Silver' && '< ₹50k'}
                  {tier === 'Gold' && '₹50k–₹2L'}
                  {tier === 'Platinum' && '₹2L+'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to earn */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-brand-navy">How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            Earn <strong className="text-foreground">1 point for every ₹100</strong> you spend on orders.
            Points are credited automatically when your order is confirmed.
          </p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Order worth ₹5,000 earns 50 points</li>
            <li>Order worth ₹20,000 earns 200 points</li>
            <li>Order worth ₹1,00,000 earns 1,000 points</li>
          </ul>
          <p className="mt-2">
            Points can be redeemed for discounts on future orders. Contact us on WhatsApp to redeem.
          </p>
        </CardContent>
      </Card>

      {/* Referral */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-brand-navy">Refer &amp; Earn</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Share your referral code with fellow business owners. When they place their first order,
            you both earn bonus points.
          </p>
          <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
            <span className="font-mono text-lg font-semibold tracking-widest text-brand-navy">
              {me.referralCode}
            </span>
          </div>
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center rounded-full bg-[#25D366] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
          >
            Share on WhatsApp
          </a>
        </CardContent>
      </Card>

      {/* Birthday / Anniversary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-brand-navy">Special Offers</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            We celebrate milestones with you! Members receive exclusive discounts and bonus points
            on their business <strong className="text-foreground">anniversary month</strong> and
            personal <strong className="text-foreground">birthday month</strong>. Keep your profile
            up to date to make sure you never miss an offer.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
