import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {getUserRole} from './getUserRole'

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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
