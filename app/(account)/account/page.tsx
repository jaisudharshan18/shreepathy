import { customers } from '@/lib/mock/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'My Profile — Shreepathy & Co' }

const TIER_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  Silver: 'secondary',
  Gold: 'default',
  Platinum: 'outline',
}

export default function ProfilePage() {
  const me = customers[0]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-brand-navy">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {me.businessName}
            <Badge variant={TIER_VARIANT[me.tier] ?? 'default'}>{me.tier} Member</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contact Name</dt>
              <dd className="mt-0.5 text-sm">{me.contactName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</dt>
              <dd className="mt-0.5 text-sm">{me.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
              <dd className="mt-0.5 text-sm">{me.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Member Since</dt>
              <dd className="mt-0.5 text-sm">
                {new Date(me.registeredAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Points Balance</dt>
              <dd className="mt-0.5 text-sm font-semibold text-brand-magenta">{me.pointsBalance.toLocaleString('en-IN')} pts</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Referral Code</dt>
              <dd className="mt-0.5 font-mono text-sm tracking-wider">{me.referralCode}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
