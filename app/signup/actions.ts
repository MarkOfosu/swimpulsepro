// 'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

// import { createClient } from '@/utils/supabase/server'

// export async function signup(formData: FormData) {
//   const supabase = createClient()

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   }

//   const { error } = await supabase.auth.signUp(data)

//   if (error) {
//     redirect('/error')
//   }

//   revalidatePath('/', 'layout')
//   redirect('/')
// }

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()

  // Collect additional form data
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const swimTeam = formData.get('swimTeam') as string
  const swimTeamLocation = formData.get('swimTeamLocation') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Sign up the user with email and password
  const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  // Store additional profile information
  const user = await supabase.auth.getUser()

  if (user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.data.user?.id,
        first_name: firstName,
        last_name: lastName,
        swim_team: swimTeam,
        swim_team_location: swimTeamLocation,
      })

    if (profileError) {
      redirect('/error')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
