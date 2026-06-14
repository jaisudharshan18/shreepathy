'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SettingsData } from '@/lib/db/settings'
import { saveSettingsAction } from './actions'

// ── types ─────────────────────────────────────────────────────────────────────

interface Props {
  settings: SettingsData | null
}

// ── defaults ──────────────────────────────────────────────────────────────────

const DEFAULTS: SettingsData = {
  whatsappNumber: '919999999999',
  businessName: 'Shreepathy & Co',
  businessHours: 'Mon – Sat: 9:00 AM – 6:00 PM',
  seoTitle: 'Shreepathy & Co – Premium Food Ingredients for Professionals',
  seoDescription: 'Bangalore-based B2B food ingredients distributor. Bakery premixes, syrups, dairy & more from top brands like Pillsbury, Monin, Amul.',
}

// ── component ─────────────────────────────────────────────────────────────────

export default function SettingsAdmin({ settings }: Props) {
  const data = settings ?? DEFAULTS
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await saveSettingsAction(fd)
      if ('error' in result) {
        setError(result.error)
        setSaved(false)
      } else {
        setSaved(true)
        setError(null)
      }
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit}>
        {/* WhatsApp */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>WhatsApp Business Number</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Format: country code + 10-digit mobile (e.g. 919876543210). The value is persisted
              to the Settings table. Note: the client-side{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">whatsappLink()</code> helper
              in <code className="text-xs bg-muted px-1 py-0.5 rounded">lib/utils.ts</code> still
              uses a hardcoded constant — a later pass will thread this value through.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <Label>WhatsApp Number</Label>
              <Input
                name="whatsappNumber"
                defaultValue={data.whatsappNumber}
                placeholder="919XXXXXXXXX"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <Label>Business Name</Label>
              <Input
                name="businessName"
                defaultValue={data.businessName}
                placeholder="Shreepathy & Co"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label>Business Hours</Label>
              <Input
                name="businessHours"
                defaultValue={data.businessHours}
                placeholder="Mon – Sat: 9 AM – 6 PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Defaults */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>SEO Defaults</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Default meta tags applied to pages that do not override them.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <Label>Default Meta Title</Label>
              <Input
                name="seoTitle"
                defaultValue={data.seoTitle}
                placeholder="Site name – tagline"
              />
            </div>
            <div className="grid gap-1">
              <Label>Default Meta Description</Label>
              <Textarea
                name="seoDescription"
                defaultValue={data.seoDescription}
                placeholder="150–160 character description for search engines"
              />
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive mb-3">{error}</p>}
        {saved && <p className="text-sm text-green-600 mb-3">Settings saved.</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : 'Save Settings'}
        </Button>
      </form>
    </div>
  )
}
