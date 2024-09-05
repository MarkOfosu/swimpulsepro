import { createClient } from '@/utils/supabase/client';

export async function getUserDetails() {
  const supabase = createClient();

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return null;
  }

  const userId = user.id;
  console.log("User ID being queried:", userId);

  // Fetch the user's profile from the profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, role')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  console.log("Profile data fetched:", profileData);

  // If the user is a swimmer, get their specific details
  if (profileData?.role === 'swimmer') {
    const { data: swimmerData, error: swimmerError } = await supabase
      .from('swimmers')
      .select('date_of_birth')
      .eq('user_id', userId)
      .single();

    if (swimmerError) {
      console.error('Error fetching swimmer details:', swimmerError);
      return profileData; // Return basic profile if swimmer details fail
    }

    // Return consolidated swimmer data
    return {
      ...profileData,
      swimmer: swimmerData,
    };
  }

  // If the user is a coach, get their specific details
  if (profileData?.role === 'coach') {
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('team_id')
      .eq('user_id', userId)
      .single();

    if (coachError) {
      console.error('Error fetching coach details:', coachError);
      return profileData; // Return basic profile if coach details fail
    }

    // Get team details
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('name, location')
      .eq('id', coachData.team_id)
      .single();

    if (teamError) {
      console.error('Error fetching team details:', teamError);
      return profileData; // Return basic profile if team details fail
    }

    // Return consolidated coach data
    return {
      ...profileData,
      team: teamData,
    };
  }

  // Default return for basic profile data
  return profileData;
}
