'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createProfile } from '@/lib/db/account'

export type AuthState = { error?: string; message?: string }

export async function signInAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''
  const next = (formData.get('next') as string | null)?.trim() || '/account'

  if (!email) return { error: 'Email is required.' }
  if (!password) return { error: 'Password is required.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect(next)
}

export async function signUpAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const businessName = (formData.get('businessName') as string | null)?.trim() ?? ''
  const contactName = (formData.get('contactName') as string | null)?.trim() ?? ''
  const phone = (formData.get('phone') as string | null)?.trim() ?? ''
  const email = (formData.get('email') as string | null)?.trim() ?? ''
  const password = (formData.get('password') as string | null) ?? ''

  if (!businessName) return { error: 'Business name is required.' }
  if (!contactName) return { error: 'Contact name is required.' }
  if (!phone) return { error: 'Phone is required.' }
  if (!email) return { error: 'Email is required.' }
  if (!password) return { error: 'Password is required.' }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) return { error: error.message }

  if (data.user) {
    try {
      await createProfile({ userId: data.user.id, businessName, contactName, phone, email })
    } catch (profileErr: unknown) {
      const msg = profileErr instanceof Error ? profileErr.message : String(profileErr)
      // Unique constraint violation — profile already exists, fine to continue
      if (!msg.toLowerCase().includes('unique') && !msg.toLowerCase().includes('duplicate')) {
        return { error: 'Account created but profile setup failed. Please contact support.' }
      }
    }
  }

  // Session is present when email confirmation is disabled
  if (data.session) {
    redirect('/account')
  }

  // No session → email confirmation required
  return { message: 'Check your email to confirm your account.' }
}

export async function signOutAction(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
