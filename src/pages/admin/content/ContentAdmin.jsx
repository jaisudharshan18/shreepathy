"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveContentAction } from "./actions";
const DEFAULTS = {
  heroHeadline: "Premium Food Ingredients for Professionals",
  heroSubtext: "Trusted by bakeries, hotels and restaurants across Tamil Nadu. Order online or on WhatsApp.",
  ctaLabel: "Shop Now",
  aboutCopy: "Shreepathy & Co is a Bangalore-based B2B food ingredients distributor supplying bakeries, quick-service restaurants, hotels and caterers since 2010. We partner with leading brands like Pillsbury, Rich's, Monin, Amul and more to bring you consistent quality at competitive prices.",
  contactPhone: "+91 99999 99999",
  contactEmail: "sales@shreepathyandco.in",
  contactAddress: "No. 12, Industrial Layout, Peenya, Bangalore – 560 058",
  mapEmbedUrl: ""
};
export default function ContentAdmin({ content }) {
  const data = content ?? DEFAULTS;
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await saveContentAction(fd);
      if ("error" in result) {
        setError(result.error);
        setSaved(false);
      } else {
        setSaved(true);
        setError(null);
      }
    });
  }
  return <div className="space-y-8"><h1 className="text-2xl font-bold">Site Content</h1><form onSubmit={handleSubmit}>{
    /* Home Hero */
  }<Card className="mb-6"><CardHeader><CardTitle>Home Hero</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-1"><Label>Headline</Label><Input
    name="heroHeadline"
    defaultValue={data.heroHeadline}
    placeholder="Main headline text"
    required
  /></div><div className="grid gap-1"><Label>Subtext</Label><Textarea
    name="heroSubtext"
    defaultValue={data.heroSubtext}
    placeholder="Supporting paragraph"
  /></div><div className="grid gap-1"><Label>CTA Button Label</Label><Input
    name="ctaLabel"
    defaultValue={data.ctaLabel}
    placeholder="e.g. Shop Now"
  /></div></CardContent></Card>{
    /* About Copy */
  }<Card className="mb-6"><CardHeader><CardTitle>About Us Copy</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-1"><Label>About Text</Label><Textarea
    name="aboutCopy"
    className="min-h-32"
    defaultValue={data.aboutCopy}
    placeholder="About the company..."
  /></div></CardContent></Card>{
    /* Contact Info */
  }<Card className="mb-6"><CardHeader><CardTitle>Contact Information</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-1"><Label>Phone</Label><Input
    name="contactPhone"
    defaultValue={data.contactPhone}
    placeholder="+91 XXXXX XXXXX"
  /></div><div className="grid gap-1"><Label>Email</Label><Input
    type="email"
    name="contactEmail"
    defaultValue={data.contactEmail}
    placeholder="sales@example.in"
  /></div><div className="grid gap-1"><Label>Address</Label><Input
    name="contactAddress"
    defaultValue={data.contactAddress}
    placeholder="Street, City – PIN"
  /></div><div className="grid gap-1"><Label>Google Map Embed URL</Label><Input
    name="mapEmbedUrl"
    defaultValue={data.mapEmbedUrl}
    placeholder="https://maps.google.com/..."
  /></div></CardContent></Card>{error && <p className="text-sm text-destructive mb-3">{error}</p>}{saved && <p className="text-sm text-green-600 mb-3">Saved successfully.</p>}<Button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Save All Content"}</Button></form></div>;
}
