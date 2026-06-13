'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormFields {
  businessName: string
  contactName: string
  phone: string
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

const INITIAL: FormFields = {
  businessName: '',
  contactName: '',
  phone: '',
  email: '',
  password: '',
}

export function RegisterForm() {
  const router = useRouter()
  const [fields, setFields] = useState<FormFields>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})

  function set(key: keyof FormFields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))
  }

  function validate(): boolean {
    const next: FormErrors = {}
    if (!fields.businessName.trim()) next.businessName = 'Business name is required'
    if (!fields.contactName.trim()) next.contactName = 'Contact name is required'
    if (!fields.phone.trim()) next.phone = 'Phone is required'
    if (!fields.email.trim()) next.email = 'Email is required'
    if (!fields.password.trim()) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return
    console.log('Mock register:', {
      businessName: fields.businessName,
      contactName: fields.contactName,
      phone: fields.phone,
      email: fields.email,
    })
    router.push('/account')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Business Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          type="text"
          value={fields.businessName}
          onChange={set('businessName')}
          aria-invalid={!!errors.businessName}
          aria-describedby={errors.businessName ? 'businessName-error' : undefined}
          placeholder="Your bakery or restaurant name"
        />
        {errors.businessName && (
          <p id="businessName-error" className="text-xs text-destructive" role="alert">
            {errors.businessName}
          </p>
        )}
      </div>

      {/* Contact Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contactName">Contact Name</Label>
        <Input
          id="contactName"
          type="text"
          autoComplete="name"
          value={fields.contactName}
          onChange={set('contactName')}
          aria-invalid={!!errors.contactName}
          aria-describedby={errors.contactName ? 'contactName-error' : undefined}
          placeholder="Your full name"
        />
        {errors.contactName && (
          <p id="contactName-error" className="text-xs text-destructive" role="alert">
            {errors.contactName}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={fields.phone}
          onChange={set('phone')}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          placeholder="10-digit mobile number"
        />
        {errors.phone && (
          <p id="phone-error" className="text-xs text-destructive" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={set('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={fields.password}
          onChange={set('password')}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          placeholder="Choose a password"
        />
        {errors.password && (
          <p id="password-error" className="text-xs text-destructive" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-brand-magenta px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity"
      >
        Create Account
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-brand-navy hover:underline">
          Log In
        </Link>
      </p>
    </form>
  )
}
