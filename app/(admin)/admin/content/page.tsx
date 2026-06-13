'use client'

import { useState } from 'react'
import { products } from '@/lib/mock/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HeroForm {
  headline: string
  subtext: string
  ctaLabel: string
}

interface AboutForm {
  copy: string
}

interface ContactForm {
  phone: string
  email: string
  address: string
  mapEmbedUrl: string
}

function SavedNote() {
  return (
    <p className="text-xs text-muted-foreground mt-2">
      Saved (Phase 2 persists to CMS/DB)
    </p>
  )
}

export default function ContentPage() {
  // Hero section
  const [hero, setHero] = useState<HeroForm>({
    headline: 'Premium Food Ingredients for Professionals',
    subtext: 'Trusted by bakeries, hotels and restaurants across Karnataka. Order online or on WhatsApp.',
    ctaLabel: 'Shop Now',
  })
  const [heroSaved, setHeroSaved] = useState(false)

  // Featured products
  const [featuredIds, setFeaturedIds] = useState<Set<string>>(
    () => new Set(products.filter(p => p.isFeatured).map(p => p.id))
  )
  const [featuredSaved, setFeaturedSaved] = useState(false)

  // About copy
  const [about, setAbout] = useState<AboutForm>({
    copy: 'Shreepathy & Co is a Bangalore-based B2B food ingredients distributor supplying bakeries, quick-service restaurants, hotels and caterers since 2010. We partner with leading brands like Pillsbury, Rich\'s, Monin, Amul and more to bring you consistent quality at competitive prices.',
  })
  const [aboutSaved, setAboutSaved] = useState(false)

  // Contact info
  const [contact, setContact] = useState<ContactForm>({
    phone: '+91 99999 99999',
    email: 'sales@shreepathyandco.in',
    address: 'No. 12, Industrial Layout, Peenya, Bangalore – 560 058',
    mapEmbedUrl: '',
  })
  const [contactSaved, setContactSaved] = useState(false)

  function saveHero() {
    console.log('[Admin] Save hero (Phase 2 persists):', hero)
    setHeroSaved(true)
  }

  function saveFeatured() {
    const selected = products.filter(p => featuredIds.has(p.id)).map(p => ({ id: p.id, name: p.name }))
    console.log('[Admin] Save featured products (Phase 2 persists):', selected)
    setFeaturedSaved(true)
  }

  function saveAbout() {
    console.log('[Admin] Save about (Phase 2 persists):', about.copy)
    setAboutSaved(true)
  }

  function saveContact() {
    console.log('[Admin] Save contact (Phase 2 persists):', contact)
    setContactSaved(true)
  }

  function toggleFeatured(id: string) {
    setFeaturedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setFeaturedSaved(false)
  }

  const setHeroField = (k: keyof HeroForm, v: string) => { setHero(prev => ({ ...prev, [k]: v })); setHeroSaved(false) }
  const setContactField = (k: keyof ContactForm, v: string) => { setContact(prev => ({ ...prev, [k]: v })); setContactSaved(false) }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Site Content</h1>

      {/* Home Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Home Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label>Headline</Label>
            <Input
              value={hero.headline}
              onChange={e => setHeroField('headline', e.target.value)}
              placeholder="Main headline text"
            />
          </div>
          <div className="grid gap-1">
            <Label>Subtext</Label>
            <Textarea
              value={hero.subtext}
              onChange={e => setHeroField('subtext', e.target.value)}
              placeholder="Supporting paragraph"
            />
          </div>
          <div className="grid gap-1">
            <Label>CTA Button Label</Label>
            <Input
              value={hero.ctaLabel}
              onChange={e => setHeroField('ctaLabel', e.target.value)}
              placeholder="e.g. Shop Now"
            />
          </div>
          <Button onClick={saveHero}>Save Hero</Button>
          {heroSaved && <SavedNote />}
        </CardContent>
      </Card>

      {/* Featured Products */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Tick products to display in the homepage featured section. Changes are local-state only — Phase 2 persists to DB.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {products.map(p => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-brand-navy"
                  checked={featuredIds.has(p.id)}
                  onChange={() => toggleFeatured(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
          <Button onClick={saveFeatured}>Save Featured</Button>
          {featuredSaved && <SavedNote />}
        </CardContent>
      </Card>

      {/* About Copy */}
      <Card>
        <CardHeader>
          <CardTitle>About Us Copy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label>About Text</Label>
            <Textarea
              className="min-h-32"
              value={about.copy}
              onChange={e => { setAbout({ copy: e.target.value }); setAboutSaved(false) }}
              placeholder="About the company..."
            />
          </div>
          <Button onClick={saveAbout}>Save About</Button>
          {aboutSaved && <SavedNote />}
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label>Phone</Label>
            <Input
              value={contact.phone}
              onChange={e => setContactField('phone', e.target.value)}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div className="grid gap-1">
            <Label>Email</Label>
            <Input
              type="email"
              value={contact.email}
              onChange={e => setContactField('email', e.target.value)}
              placeholder="sales@example.in"
            />
          </div>
          <div className="grid gap-1">
            <Label>Address</Label>
            <Input
              value={contact.address}
              onChange={e => setContactField('address', e.target.value)}
              placeholder="Street, City – PIN"
            />
          </div>
          <div className="grid gap-1">
            <Label>Google Map Embed URL</Label>
            <Input
              value={contact.mapEmbedUrl}
              onChange={e => setContactField('mapEmbedUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
          <Button onClick={saveContact}>Save Contact Info</Button>
          {contactSaved && <SavedNote />}
        </CardContent>
      </Card>
    </div>
  )
}
