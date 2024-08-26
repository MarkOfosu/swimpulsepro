'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'


export const isLogin = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there's an error or no user, return false
  if (error || !user) {
    return false;
  }

  return true;
};

  

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  //validate your inputs later
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }



  revalidatePath('/', 'layout')
  //for now redirect to coach dashboard
  redirect('/user/coach/dashboard')
 
}
