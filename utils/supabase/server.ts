// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { cookies } from 'next/headers'


// export const isLogin = async () => {
//   const supabase = createClient();
//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser();

//   if (error || !user) {
//     return false;
//   }

//   return true;
// };


// export function createClient() {
//   const cookieStore = cookies()

//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll()
//         },
//         setAll(cookiesToSet) {
//           try {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             )
//           } catch {
//             // The `setAll` method was called from a Server Component.
//             // This can be ignored if you have middleware refreshing
//             // user sessions.
//           }
//         },
//       },
//     }
//   )
// }


// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SupabaseAuthError } from './errors';
import { UserRole } from '../../app/lib/types/auth';

export async function isLogin(): Promise<boolean> {
  const supabase = createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new SupabaseAuthError(error.message);
    return !!user;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

export async function getCurrentUser() {
  const supabase = createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new SupabaseAuthError(error.message);
    if (!user) throw new SupabaseAuthError('No user found', 401, 'USER_NOT_FOUND');
    return user;
  } catch (error) {
    throw error instanceof SupabaseAuthError 
      ? error 
      : new SupabaseAuthError('Authentication failed');
  }
}

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Handle server component cookie setting
            console.warn('Cookie set attempted in server component');
          }
        }
      }
    }
  );
}
