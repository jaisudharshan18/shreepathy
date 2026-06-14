import Link from 'next/link'
import { getSessionUser } from '@/lib/auth'
import { signOutAction } from '@/app/(account)/actions'

export async function AuthNav() {
  const user = await getSessionUser()

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-white/90 hover:text-brand-magenta transition-colors"
      >
        Login
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className="text-sm font-medium text-white/90 hover:text-brand-magenta transition-colors"
      >
        Account
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          className="text-sm font-medium text-white/90 hover:text-brand-magenta transition-colors"
        >
          Logout
        </button>
      </form>
    </div>
  )
}
