// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getUserRole } from './getUserRole'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Handle API routes first
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check permissions for coach-specific API routes
    if (request.nextUrl.pathname.startsWith('/api/coach/')) {
      const role = await getUserRole(supabase, user.id)
      if (role !== 'coach') {
        return NextResponse.json(
          { error: 'Access denied: Coach role required' },
          { status: 403 }
        )
      }
    }

    return supabaseResponse
  }

  // Allow access to home and other public routes
  if (request.nextUrl.pathname === '/' || !request.nextUrl.pathname.startsWith('/user')) {
    return supabaseResponse
  }
    
  if (!user) {
    // If user is not logged in and is accessing a protected route, redirect to login
    if (request.nextUrl.pathname.startsWith('/user')) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  } else {
    // User is logged in, check their role
    const role = await getUserRole(supabase, user.id)

    if (role === 'coach' && !request.nextUrl.pathname.startsWith('/user/coach')) {
      // Coaches can only access /user/coach/...
      const url = request.nextUrl.clone()
      url.pathname = '/user/coach/swimGroup'
      return NextResponse.redirect(url)
    } else if (role === 'swimmer' && !request.nextUrl.pathname.startsWith('/user/swimmer')) {
      // Swimmers can only access /user/swimmer/...
      const url = request.nextUrl.clone()
      url.pathname = '/user/swimmer/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
