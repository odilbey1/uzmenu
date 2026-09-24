import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Fast-path 1: Public routes (menu, demo, landing) need zero auth overhead
  const isSuperAdminRoute = pathname.startsWith('/super-admin')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname === '/login' || pathname === '/signup'

  // If request is purely public (e.g. /r/[slug], /demo, /), bypass immediately
  if (!isSuperAdminRoute && !isDashboardRoute && !isAuthRoute) {
    return NextResponse.next({ request })
  }

  // Fast-path 2: Check for presence of Supabase auth cookie before making network call
  const allCookies = request.cookies.getAll()
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  // If user has NO auth cookie and tries to access protected admin route, redirect instantly
  if (!hasAuthCookie && (isSuperAdminRoute || isDashboardRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // If user has NO auth cookie and is on login page, let them through instantly
  if (!hasAuthCookie && isAuthRoute) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check auth user only for protected/auth routes when auth cookies exist
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Not authenticated
  if (!user && (isSuperAdminRoute || isDashboardRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated user — check role from metadata (instant)
  if (user) {
    const role =
      (user.user_metadata?.role as string) ||
      (user.email === 'admin@uzmenu.uz' ? 'super_admin' : 'admin')

    // Super Admin route — only super_admin role allowed
    if (isSuperAdminRoute && role !== 'super_admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Dashboard route — super_admin goes to super-admin
    if (isDashboardRoute && role === 'super_admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/super-admin'
      return NextResponse.redirect(url)
    }

    // Auth routes — redirect logged-in users to their panel
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = role === 'super_admin' ? '/super-admin' : '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
