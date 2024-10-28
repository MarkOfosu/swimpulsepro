// import { type EmailOtpType } from '@supabase/supabase-js'
// import { type NextRequest } from 'next/server'

// import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const token_hash = searchParams.get('token_hash')
//   const type = searchParams.get('type') as EmailOtpType | null
//   const next = searchParams.get('next') ?? '/'

//   if (token_hash && type) {
//     const supabase = createClient()

//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     })
//     if (!error) {
//       // redirect user to specified redirect URL or root of app
//       redirect(next)
//     }
//   }

//   // redirect the user to an error page with some instructions
//   redirect('/error')
// }

// app/auth/confirm/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (!token_hash || !type) {
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    const cookieStore = cookies();
    const supabase = createClient();

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any
    });

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/error?message=${error.message}`, request.url)
      );
    }

    // Redirect to the client-side confirmation page
    return NextResponse.redirect(
      new URL(`/auth/confirm?token_hash=${token_hash}&type=${type}`, request.url)
    );

  } catch (error) {
    console.error('Auth confirmation error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}