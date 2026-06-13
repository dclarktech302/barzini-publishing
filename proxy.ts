/*
 * RBAC — Role-Based Access Control
 *
 * Roles defined in lib/types.ts: 'admin' | 'artist'
 * Role stored in Supabase auth user_metadata.role at invite time.
 *
 * Auth model: email + PIN login (see app/(auth)/login and
 * app/(auth)/verify-pin). PIN is stored as the Supabase auth password,
 * following the Nightdeck precedent — no separate credential table.
 *
 * user_metadata.pin_set === true gates dashboard access. Session
 * persistence is handled by Supabase's default refresh-token flow —
 * no custom session caching.
 *
 * Current v1: admin-only. All authenticated users with pin_set = true
 * are treated as admin.
 *
 * Future (artist portal):
 *   - role === 'artist' → redirect to /portal (not yet built)
 *   - artist users scoped to their own artistId (stored in user_metadata)
 *   - admin users have full label-wide access
 *
 * To check role in a Server Component:
 *   const { data: { user } } = await supabase.auth.getUser()
 *   const role = user?.user_metadata?.role as UserRole
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'

const PUBLIC_PATHS = ['/login', '/verify-pin', '/api/auth/set-pin']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const cookieMethods: CookieMethodsServer = {
    getAll() {
      return request.cookies.getAll()
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
      response = NextResponse.next({ request })
      cookiesToSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options),
      )
    },
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: cookieMethods },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const pinSet = user.user_metadata?.pin_set === true
  if (!pinSet) {
    return NextResponse.redirect(new URL('/verify-pin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
