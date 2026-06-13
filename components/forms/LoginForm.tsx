'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormErrors {
  email?: string
  password?: string
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): boolean {
    const next: FormErrors = {}
    if (!email.trim()) next.email = 'Email is required'
    if (!password.trim()) next.password = 'Password is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return
    console.log('Mock login:', { email })
    router.push('/account')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          placeholder="••••••••"
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
        Log In
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-brand-navy hover:underline">
          Create Account
        </Link>
      </p>
    </form>
  )
}
