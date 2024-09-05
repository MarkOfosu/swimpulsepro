

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// import { createClient } from '@/utils/supabase/server'

// export async function signup(formData: FormData) {
//   const supabase = createClient()

//   // Collect additional form data
//   const firstName = formData.get('firstName') as string
//   const lastName = formData.get('lastName') as string
//   const swimTeam = formData.get('swimTeam') as string
//   const swimTeamLocation = formData.get('swimTeamLocation') as string
//   const email = formData.get('email') as string
//   const password = formData.get('password') as string

//   // Sign up the user with email and password
//   // const data = {
//   //       email: formData.get('email') as string,
//   //       password: formData.get('password') as string,
//   //     }

//   const {data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         first_name: firstName,
//         last_name: lastName,
//         swim_team: swimTeam,
//         swim_team_location: swimTeamLocation,
//       },
//     },
//   })



//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }


'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function signup(formData: FormData) {
  const supabase = createClient();

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const role = formData.get('role') as 'coach' | 'swimmer'; // Collect the role

  // Check for confirm password match
  if (password !== confirmPassword) {
    redirect('/error?message=Passwords do not match');
    return;
  }

  // Collect additional form data based on the role
  let additionalData: any = {};
  if (role === 'coach') {
    additionalData = {
      swim_team: formData.get('swimTeam') as string,
      swim_team_location: formData.get('swimTeamLocation') as string,
    };
  } else if (role === 'swimmer') {
    additionalData = {
      date_of_birth: formData.get('dateOfBirth') as string,
    };
  }

  // Sign up the user with email and password
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role,  // Add role to the data
        ...additionalData, // Add the specific data based on the role
      },
    },
  });

  if (error) {
    console.error('Supabase Error:', error); // Log the full error
    redirect('/error?message=' + encodeURIComponent(error.message));
    return;
  }
  

  revalidatePath('/', 'layout')
  redirect('/')
}




