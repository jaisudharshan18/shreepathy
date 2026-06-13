'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WhatsAppForm {
  number: string
}

interface BusinessForm {
  name: string
  address: string
  hours: string
}

interface SeoForm {
  metaTitle: string
  metaDescription: string
}

function SavedNote() {
  return (
    <p className="text-xs text-muted-foreground mt-2">
      Saved (Phase 2 persists to config store)
    </p>
  )
}

export default function SettingsPage() {
  const [whatsapp, setWhatsapp] = useState<WhatsAppForm>({ number: '919999999999' })
  const [whatsappSaved, setWhatsappSaved] = useState(false)

  const [business, setBusiness] = useState<BusinessForm>({
    name: 'Shreepathy & Co',
    address: 'No. 12, Industrial Layout, Peenya, Bangalore – 560 058',
    hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
  })
  const [businessSaved, setBusinessSaved] = useState(false)

  const [seo, setSeo] = useState<SeoForm>({
    metaTitle: 'Shreepathy & Co – Premium Food Ingredients for Professionals',
    metaDescription: 'Bangalore-based B2B food ingredients distributor. Bakery premixes, syrups, dairy & more from top brands like Pillsbury, Monin, Amul.',
  })
  const [seoSaved, setSeoSaved] = useState(false)

  function saveWhatsapp() {
    console.log('[Admin] Save WhatsApp number (Phase 2 persists):', whatsapp.number)
    setWhatsappSaved(true)
  }

  function saveBusiness() {
    console.log('[Admin] Save business info (Phase 2 persists):', business)
    setBusinessSaved(true)
  }

  function saveSeo() {
    console.log('[Admin] Save SEO defaults (Phase 2 persists):', seo)
    setSeoSaved(true)
  }

  const setWa = (v: string) => { setWhatsapp({ number: v }); setWhatsappSaved(false) }
  const setBiz = (k: keyof BusinessForm, v: string) => { setBusiness(prev => ({ ...prev, [k]: v })); setBusinessSaved(false) }
  const setSeoField = (k: keyof SeoForm, v: string) => { setSeo(prev => ({ ...prev, [k]: v })); setSeoSaved(false) }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business Number</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Format: country code + 10-digit mobile (e.g. 919876543210). Currently stored as a placeholder in{' '}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">lib/utils.ts</code>; Phase 2 reads from this setting.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label>WhatsApp Number</Label>
            <Input
              value={whatsapp.number}
              onChange={e => setWa(e.target.value)}
              placeholder="919XXXXXXXXX"
            />
          </div>
          <Button onClick={saveWhatsapp}>Save</Button>
          {whatsappSaved && <SavedNote />}
        </CardContent>
      </Card>

      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label>Business Name</Label>
            <Input
              value={business.name}
              onChange={e => setBiz('name', e.target.value)}
              placeholder="Shreepathy & Co"
            />
          </div>
          <div className="grid gap-1">
            <Label>Address</Label>
            <Input
              value={business.address}
              onChange={e => setBiz('address', e.target.value)}
              placeholder="Street, City – PIN"
            />
          </div>
          <div className="grid gap-1">
            <Label>Business Hours</Label>
            <Input
              value={business.hours}
              onChange={e => setBiz('hours', e.target.value)}
              placeholder="Mon – Sat: 9 AM – 6 PM"
            />
          </div>
          <Button onClick={saveBusiness}>Save Business Info</Button>
          {businessSaved && <SavedNote />}
        </CardContent>
      </Card>

      {/* SEO Defaults */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Defaults</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Default meta tags applied to pages that do not override them. Phase 2 injects these via Next.js metadata API.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label>Default Meta Title</Label>
            <Input
              value={seo.metaTitle}
              onChange={e => setSeoField('metaTitle', e.target.value)}
              placeholder="Site name – tagline"
            />
          </div>
          <div className="grid gap-1">
            <Label>Default Meta Description</Label>
            <Textarea
              value={seo.metaDescription}
              onChange={e => setSeoField('metaDescription', e.target.value)}
              placeholder="150–160 character description for search engines"
            />
          </div>
          <Button onClick={saveSeo}>Save SEO</Button>
          {seoSaved && <SavedNote />}
        </CardContent>
      </Card>
    </div>
  )
}
