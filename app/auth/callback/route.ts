// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the SSR package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/server-side/nextjs
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const origin = requestUrl.origin;

//   if (code) {
//     const supabase = createClient();
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}/coach`);
// }

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createClient();
      
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) throw error;
      
      if (session) {
        // Get user's role from metadata
        const role = session.user.user_metadata.role;
        
        // Determine redirect based on role
        const redirectPath = role === 'coach' 
          ? '/user/coach/swimGroup' 
          : '/user/swimmer/dashboard';
        
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      // Redirect to error page with message
      return NextResponse.redirect(
        `${origin}/auth/error?message=Failed to verify email. Please try again.`
      );
    }
  }

  // If no code or session, redirect to error page
  return NextResponse.redirect(
    `${origin}/auth/error?message=Invalid verification attempt`
  );
}

