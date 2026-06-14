import { runBirthdayOffers } from '@/lib/db/account'

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false

  // Check Authorization header: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('Authorization')
  if (authHeader === `Bearer ${cronSecret}`) return true

  // Check query param: ?secret=<CRON_SECRET>
  const url = new URL(request.url)
  if (url.searchParams.get('secret') === cronSecret) return true

  return false
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = await runBirthdayOffers(new Date())
  return Response.json({ count: results.length, results })
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = await runBirthdayOffers(new Date())
  return Response.json({ count: results.length, results })
}
