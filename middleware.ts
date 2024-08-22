import { type NextRequest } from 'next/server'
import { updateSession } from '@utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// import { NextResponse, type NextRequest } from 'next/server';
// import { createClient } from '@utils/supabase/client';

// export async function middleware(request: NextRequest) {
//   const response = await updateSession(request);
//   const supabase = createClient();
//   const { data: { session } } = await supabase.auth.getSession();

//   const pathname = request.nextUrl.pathname;

//   // Example of role-based access control
//   if (session) {
//     const role = session.user.user_metadata.role;
    
//     if (pathname.startsWith('/user/coach') && role !== 'coach') {
//       return NextResponse.redirect(new URL('/403', request.url));
//     }

//     if (pathname.startsWith('/user/swimmer') && role !== 'swimmer') {
//       return NextResponse.redirect(new URL('/403', request.url));
//     }
//   }

//   return response;
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };
