import { createClient } from '@/utils/supabase/client';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'swimmer' | 'coach';
}

interface SwimmerData {
  date_of_birth: string;
  group_id: string | null;
}

interface TeamData {
  name: string;
  location: string;
}

interface UserData extends ProfileData {
  swimmer?: SwimmerData;
  team?: TeamData;
}

export async function getUserDetails(): Promise<UserData | null> {
  const supabase = createClient();

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return null;
  }

  // Fetch the user's profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, email, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profileData) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  let userData: UserData = profileData;

  // Fetch additional data based on the user's role
  if (userData.role === 'swimmer') {
    const { data: swimmerData, error: swimmerError } = await supabase
      .from('swimmers')
      .select('date_of_birth, group_id')
      .eq('id', user.id)
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
      .eq('id', user.id)
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