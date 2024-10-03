
'use server'

import { createClient } from '@/utils/supabase/server';

export async function signup(formData: FormData) {
  const supabase = createClient();

  try {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const role = formData.get('role') as 'coach' | 'swimmer';

    // Check if all necessary fields are filled
    if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
      return { error: 'Missing required fields' };
    }

    // Check for password confirmation match
    if (password !== confirmPassword) {
      return { error: 'Passwords do not match' };
    }

    // Collect additional form data based on the role
    let additionalData: any = {};
    if (role === 'coach') {
      const swimTeam = formData.get('swimTeam') as string;
      const swimTeamLocation = formData.get('swimTeamLocation') as string;

      if (!swimTeam || !swimTeamLocation) {
        return { error: 'Missing swim team or location' };
      }

      additionalData = {
        swim_team: swimTeam,
        swim_team_location: swimTeamLocation,
      };
    } else if (role === 'swimmer') {
      const dateOfBirth = formData.get('dateOfBirth') 

      if (!dateOfBirth) {
        return { error: 'Missing date of birth' };
      }

      additionalData = {
        date_of_birth: dateOfBirth,
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
          role,
          ...additionalData,
        },
      },
    });

    if (error) {
      // Return the error message instead of redirecting
      return { error: error.message };
    }

    // Return the session data to the client
    return {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      expiresAt: data.session?.expires_at,
    };
  } catch (e) {
    console.error('Unexpected error during signup:', e);
    return { error: 'An unexpected error occurred' };
  }
}
