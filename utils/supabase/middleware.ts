// // utils/supabase/middleware.ts
// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'
// import { getUserRole } from './getUserRole'

// export async function updateSession(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({
//     request,
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
//           supabaseResponse = NextResponse.next({
//             request,
//           })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   // Handle API routes first
//   if (request.nextUrl.pathname.startsWith('/api/')) {
//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       )
//     }

//     // Check permissions for coach-specific API routes
//     if (request.nextUrl.pathname.startsWith('/api/coach/')) {
//       const role = await getUserRole(supabase, user.id)
//       if (role !== 'coach') {
//         return NextResponse.json(
//           { error: 'Access denied: Coach role required' },
//           { status: 403 }
//         )
//       }
//     }

//     return supabaseResponse
//   }

//   // Allow access to home and other public routes
//   if (request.nextUrl.pathname === '/' || !request.nextUrl.pathname.startsWith('/user')) {
//     return supabaseResponse
//   }
    
//   if (!user) {
//     // If user is not logged in and is accessing a protected route, redirect to login
//     if (request.nextUrl.pathname.startsWith('/user')) {
//       const url = request.nextUrl.clone()
//       url.pathname = '/auth/login'
//       return NextResponse.redirect(url)
//     }
//   } else {
//     // User is logged in, check their role
//     const role = await getUserRole(supabase, user.id)

//     if (role === 'coach' && !request.nextUrl.pathname.startsWith('/user/coach')) {
//       // Coaches can only access /user/coach/...
//       const url = request.nextUrl.clone()
//       url.pathname = '/user/coach/swimGroup'
//       return NextResponse.redirect(url)
//     } else if (role === 'swimmer' && !request.nextUrl.pathname.startsWith('/user/swimmer')) {
//       // Swimmers can only access /user/swimmer/...
//       const url = request.nextUrl.clone()
//       url.pathname = '/user/swimmer/dashboard'
//       return NextResponse.redirect(url)
//     }
//   }

//   return supabaseResponse
// }


// utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getUserRole } from './getUserRole';
import { UserRole } from '../../app/lib/types/auth';

interface AuthenticatedRequest extends NextRequest {
  user: any; // Replace 'any' with your User type
  role: UserRole;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    // Handle API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const role: UserRole = await getUserRole(supabase, user.id);
      if (request.nextUrl.pathname.startsWith('/api/coach/') && role !== 'coach') {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      (request as AuthenticatedRequest).user = user;
      (request as AuthenticatedRequest).role = role;
      return response;
    }

    // Handle page routes
    if (request.nextUrl.pathname === '/' || !request.nextUrl.pathname.startsWith('/user')) {
      return response;
    }

    if (!user) {
      if (request.nextUrl.pathname.startsWith('/user')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    } else {
      const role: UserRole = await getUserRole(supabase, user.id);
      const redirectMap: Record<UserRole, string> = {
        coach: '/user/coach/swimGroup',
        swimmer: '/user/swimmer/dashboard',
        admin: '/user/admin/dashboard'
      };

      const allowedPath = redirectMap[role];
      if (allowedPath && !request.nextUrl.pathname.startsWith(`/user/${role}`)) {
        return NextResponse.redirect(new URL(allowedPath, request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}