'use client'

import { useState, useTransition } from 'react'
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
import { pointsForOrder } from '@/lib/loyalty'
import type { CustomerProfile } from '@/lib/generated/prisma/client'
import { adjustPointsAction, runBirthdayOffersAction } from './actions'

interface Props {
  customers: CustomerProfile[]
}

export default function LoyaltyAdmin({ customers }: Props) {
  const [customerIdSelect, setCustomerIdSelect] = useState(customers[0]?.id ?? '')
  const [error, setError] = useState<string | null>(null)
  const [confirm, setConfirm] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const [birthdayMsg, setBirthdayMsg] = useState<string | null>(null)
  const [birthdayPending, startBirthdayTransition] = useTransition()

  function handleRunBirthday() {
    setBirthdayMsg(null)
    startBirthdayTransition(async () => {
      const result = await runBirthdayOffersAction()
      if ('error' in result) {
        setBirthdayMsg(`Error: ${result.error}`)
      } else {
        setBirthdayMsg(`Sent ${result.count} birthday offer${result.count === 1 ? '' : 's'}.`)
      }
    })
  }

  function handleAdjust(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('customerId', customerIdSelect)
    setError(null)
    setConfirm(null)

    startTransition(async () => {
      const result = await adjustPointsAction(fd)
      if ('error' in result) {
        setError(result.error)
      } else {
        const customer = customers.find((c) => c.id === customerIdSelect)
        const delta = parseInt(fd.get('pointsDelta') as string, 10)
        setConfirm(
          `Adjusted ${delta > 0 ? '+' : ''}${delta} pts for ${customer?.businessName ?? ''}. Saved to database.`
        )
        // Reset form by clearing confirm after a moment (the form resets via key trick)
      }
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Loyalty Programme</h1>

      {/* Tier Configuration */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">Tier Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Thresholds based on cumulative purchase value (LTV).
        </p>
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
          Points rate: 1 pt per ₹100 spent. Example: ₹10,000 order → {pointsForOrder(10000)} pts.
        </p>
      </section>

      {/* Customer Tier Snapshot */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">Customer Tier Snapshot</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-1">Business</th>
              <th className="text-left py-1">Tier</th>
              <th className="text-right py-1">Points</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="py-1">{c.businessName}</td>
                <td className="py-1">{c.tier}</td>
                <td className="py-1 text-right">{c.pointsBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Points Adjustment */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">Points Adjustment</h2>
        <p className="text-sm text-muted-foreground">
          Manually credit or debit loyalty points. Saved immediately to the database.
        </p>

        <form onSubmit={handleAdjust} className="grid gap-3 max-w-sm">
          <div className="grid gap-1">
            <Label>Customer</Label>
            <input type="hidden" name="customerId" value={customerIdSelect} />
            <Select
              value={customerIdSelect}
              onValueChange={(v) => { if (v) { setCustomerIdSelect(v); setConfirm(null) } }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1">
            <Label>Points Delta (positive to credit, negative to debit)</Label>
            <Input
              type="number"
              name="pointsDelta"
              placeholder="e.g. 100 or -50"
            />
          </div>

          <div className="grid gap-1">
            <Label>Reason</Label>
            <Input
              name="reason"
              placeholder="e.g. Manual correction"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {confirm && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              {confirm}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? 'Saving…' : 'Apply Adjustment'}
          </Button>
        </form>
      </section>

      {/* Birthday Offers */}
      <section className="rounded-xl border bg-card p-4 space-y-3">
        <h2 className="font-medium">Birthday Offers</h2>
        <p className="text-sm text-muted-foreground">
          Send discount codes to customers whose birthday is today. Records a loyalty entry per customer and emails the code (no-op if RESEND_API_KEY is not set).
        </p>

        {birthdayMsg && (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {birthdayMsg}
          </p>
        )}

        <Button
          type="button"
          onClick={handleRunBirthday}
          disabled={birthdayPending}
          variant="outline"
          className="w-fit"
        >
          {birthdayPending ? 'Running…' : 'Run birthday offers now'}
        </Button>
      </section>
    </div>
  )
}
