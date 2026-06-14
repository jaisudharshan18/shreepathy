'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInAction, type AuthState } from '@/app/(account)/actions'

interface LoginFormProps {
  next?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-full bg-brand-magenta px-6 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity disabled:opacity-60"
    >
      {pending ? 'Logging in…' : 'Log In'}
    </button>
  )
}

export function LoginForm({ next }: LoginFormProps) {
  const [state, formAction] = useActionState<AuthState, FormData>(signInAction, {})

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {/* Hidden field for post-login redirect */}
      {next && <input type="hidden" name="next" value={next} />}

      {/* Server-side error */}
      {state.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-brand-navy hover:underline">
          Create Account
        </Link>
      </p>
    </form>
  )
}
