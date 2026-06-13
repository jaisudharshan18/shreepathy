'use client'

import { useState } from 'react'
import { customers } from '@/lib/mock/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatINR } from '@/lib/utils'
import { getOrders } from '@/lib/mock/account'
import { tierForValue, pointsForOrder } from '@/lib/mock/loyalty'
import type { CustomerProfile } from '@/lib/types'

interface MockReferral {
  code: string
  referrer: string
  usedBy: string
  usedAt: string
}

// Derive simple mock referrals from the customers list
const MOCK_REFERRALS: MockReferral[] = [
  { code: customers[0].referralCode, referrer: customers[0].businessName, usedBy: 'New Lead A', usedAt: '2024-05-10' },
  { code: customers[2].referralCode, referrer: customers[2].businessName, usedBy: 'New Lead B', usedAt: '2024-06-01' },
  { code: customers[2].referralCode, referrer: customers[2].businessName, usedBy: 'New Lead C', usedAt: '2024-06-08' },
]

interface AdjustForm {
  customerId: string
  pointsDelta: string
  reason: string
}

const emptyAdj: AdjustForm = { customerId: customers[0]?.id ?? '', pointsDelta: '', reason: '' }

export default function LoyaltyPage() {
  const [adjForm, setAdjForm] = useState<AdjustForm>(emptyAdj)
  const [adjConfirm, setAdjConfirm] = useState<string | null>(null)

  function setAdj(k: keyof AdjustForm, v: string) {
    setAdjForm(prev => ({ ...prev, [k]: v }))
    setAdjConfirm(null)
  }

  function handleAdjust() {
    const customer = customers.find(c => c.id === adjForm.customerId)
    const delta = parseInt(adjForm.pointsDelta, 10)
    if (!customer || isNaN(delta)) return
    console.log('[Admin] Points adjustment:', { customerId: adjForm.customerId, delta, reason: adjForm.reason })
    setAdjConfirm(
      `Adjusted ${delta > 0 ? '+' : ''}${delta} pts for ${customer.businessName}. Reason: "${adjForm.reason}". (Mock — persisted in Phase 2.)`
    )
    setAdjForm(emptyAdj)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Loyalty Programme</h1>

      {/* Tier Configuration */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">Tier Configuration</h2>
        <p className="text-sm text-muted-foreground">Thresholds are based on cumulative purchase value (LTV).</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border p-3 space-y-1">
            <p className="text-sm font-semibold text-foreground">Silver</p>
            <p className="text-xs text-muted-foreground">LTV &lt; {formatINR(50000)}</p>
            <p className="text-xs text-muted-foreground">Default tier on registration</p>
          </div>
          <div className="rounded-lg border p-3 space-y-1 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Gold</p>
            <p className="text-xs text-muted-foreground">LTV ≥ {formatINR(50000)}</p>
            <p className="text-xs text-muted-foreground">Priority support</p>
          </div>
          <div className="rounded-lg border p-3 space-y-1 border-purple-300 bg-purple-50 dark:bg-purple-950/20">
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">Platinum</p>
            <p className="text-xs text-muted-foreground">LTV ≥ {formatINR(200000)}</p>
            <p className="text-xs text-muted-foreground">Dedicated account manager</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground border-t pt-2">
          Points rate: 1 pt per ₹100 spent. Example: ₹10,000 order → {pointsForOrder(10000)} pts. Tier thresholds editable in Phase 2.
        </p>
      </section>

      {/* Customer LTV snapshot */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">Customer Tier Snapshot</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-1">Business</th>
              <th className="text-left py-1">Current Tier</th>
              <th className="text-right py-1">LTV</th>
              <th className="text-right py-1">Computed Tier</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c: CustomerProfile) => {
              const orders = getOrders(c.id)
              const ltv = orders.reduce((sum, o) => sum + o.totalValue, 0)
              const computed = tierForValue(ltv)
              return (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-1">{c.businessName}</td>
                  <td className="py-1">{c.tier}</td>
                  <td className="py-1 text-right">{formatINR(ltv)}</td>
                  <td className="py-1 text-right">{computed}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* Points Adjustment */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">Points Adjustment</h2>
        <p className="text-sm text-muted-foreground">Manually credit or debit loyalty points (logged to console; persisted in Phase 2).</p>
        <div className="grid gap-3 max-w-sm">
          <div className="grid gap-1">
            <Label>Customer</Label>
            <Select value={adjForm.customerId} onValueChange={v => { if (v != null) setAdj('customerId', v) }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.businessName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Points Delta (positive to credit, negative to debit)</Label>
            <Input
              type="number"
              placeholder="e.g. 100 or -50"
              value={adjForm.pointsDelta}
              onChange={e => setAdj('pointsDelta', e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label>Reason</Label>
            <Input
              placeholder="e.g. Manual correction"
              value={adjForm.reason}
              onChange={e => setAdj('reason', e.target.value)}
            />
          </div>
          <Button
            onClick={handleAdjust}
            disabled={!adjForm.customerId || !adjForm.pointsDelta || !adjForm.reason}
            className="w-fit"
          >
            Apply Adjustment
          </Button>
          {adjConfirm && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              ✓ {adjConfirm}
            </p>
          )}
        </div>
      </section>

      {/* Referrals */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">
          Referrals <span className="text-muted-foreground font-normal text-sm">(mock data)</span>
        </h2>
        <p className="text-sm text-muted-foreground">Referral tracking and rewards wired in Phase 2.</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-1">Code</th>
              <th className="text-left py-1">Referrer</th>
              <th className="text-left py-1">Used By</th>
              <th className="text-left py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REFERRALS.map((r, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-1 font-mono text-xs">{r.code}</td>
                <td className="py-1">{r.referrer}</td>
                <td className="py-1">{r.usedBy}</td>
                <td className="py-1">{r.usedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
