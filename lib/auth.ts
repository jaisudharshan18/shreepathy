import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getSessionUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const list = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  return !!email && list.includes(email.toLowerCase())
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin() {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email)) redirect('/')
  return user
}
