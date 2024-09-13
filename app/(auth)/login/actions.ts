// 'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// import { createClient } from '@/utils/supabase/client'

// export async function login(formData: FormData) {
//   const supabase = createClient()

//   // Prepare login data
//   const loginData = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   // Attempt to sign in with email and password
//   const { data: session, error } = await supabase.auth.signInWithPassword(loginData);

//   // Handle errors
//   if (error) {
//     console.error('Error during login:', error);
//     redirect('/error');
//     return;
//   }

//   // Revalidate cache
//   revalidatePath('/');
  
//   // Redirect to client-side login page for role-based redirection
//   redirect('/');
// }
