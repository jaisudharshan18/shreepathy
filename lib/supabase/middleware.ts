import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          // Write cookies onto the outgoing request (so Server Components can read them)
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          )
          // Rebuild the response with the updated request cookies
          response = NextResponse.next({ request })
          // Write cookies onto the response (so the browser receives them)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
          // Apply cache-control headers from the library (prevents CDN caching of auth responses)
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, user }
}
