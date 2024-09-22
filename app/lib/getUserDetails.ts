// lib/getUserDetails.ts
import { createClient } from '@/utils/supabase/client';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  role: 'swimmer' | 'coach';
}

interface SwimmerData {
  date_of_birth: string;
}

interface TeamData {
  name: string;
  location: string;
}

interface UserData extends ProfileData {
  id: string;
  isAdmin: boolean;
  swimmer?: SwimmerData;
  team?: TeamData;
}

export async function getUserDetails(): Promise<UserData | null> {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, role')
    .single();

  if (profileError || !profileData) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  let userData: UserData = {
    ...profileData as ProfileData,
    id: user.id,
    isAdmin: false, 
  };

  if (userData.role === 'swimmer') {
    const { data: swimmerData, error: swimmerError } = await supabase
      .from('swimmers')
      .select('date_of_birth')
      .single();

    if (swimmerError || !swimmerData) {
      console.error('Error fetching swimmer details:', swimmerError);
    } else {
      userData.swimmer = swimmerData;
    }
  } else if (userData.role === 'coach') {
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('team_id')
      .single();

    if (coachError || !coachData) {
      console.error('Error fetching coach details:', coachError);
    } else {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('name, location')
        .eq('id', coachData.team_id)
        .single();

      if (teamError || !teamData) {
        console.error('Error fetching team details:', teamError);
      } else {
        userData.team = teamData;
      }
    }
  }

  return userData;
}




// import { createClient } from '@/utils/supabase/client';

// export async function getUserDetails() {
//   const supabase = createClient();

//   // Get the authenticated user
//   const { data: { user }, error: userError } = await supabase.auth.getUser();

//   if (userError || !user) {
//     console.error('Error fetching user:', userError);
//     return null;
//   }

//   // Fetch the user's profile
//   const { data: profileData, error: profileError } = await supabase
//     .from('profiles')
//     .select('first_name, last_name, email, role')
//     .single(); // Automatically scoped to the logged-in user with RLS

//   if (profileError || !profileData) {
//     console.error('Error fetching profile:', profileError);
//     return null;
//   }

//   // Fetch additional data based on the user's role
//   if (profileData?.role === 'swimmer') {
//     const { data: swimmerData, error: swimmerError } = await supabase
//       .from('swimmers')
//       .select('date_of_birth')
//       .single(); // No need to filter by user_id, RLS handles it

//     if (swimmerError || !swimmerData) {
//       console.error('Error fetching swimmer details:', swimmerError);
//       return profileData; 
//     }

//     // Return consolidated swimmer data
//     return {
//       ...profileData,
//       swimmer: swimmerData,
//     };
//   }

//   if (profileData?.role === 'coach') {
//     const { data: coachData, error: coachError } = await supabase
//       .from('coaches')
//       .select('team_id')
//       .single(); // No need to filter by user_id, RLS handles it

//     if (coachError || !coachData) {
//       console.error('Error fetching coach details:', coachError);
//       return profileData; // Return basic profile if coach details fail
//     }

//     const { data: teamData, error: teamError } = await supabase
//       .from('teams')
//       .select('name, location')
//       .eq('id', coachData.team_id) // We still need this filter since team_id isn't tied to RLS
//       .single();

//     if (teamError || !teamData) {
//       console.error('Error fetching team details:', teamError);
//       return profileData; // Return basic profile if team details fail
//     }

//     return {
//       ...profileData,
//       team: teamData,
//     };
//   }

//   return profileData; // Return profile data if no additional role-specific data is needed
// }


