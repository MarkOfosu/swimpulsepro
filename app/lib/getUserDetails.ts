import { createClient } from '@/utils/supabase/client';

export async function getUserDetails() {
  const supabase = createClient();

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError);
    return null;
  }

  console.log("User ID being queried:", user.id);

  // Fetch the user's profile, no need for explicit user ID filtering
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, role')
    .single(); // Automatically scoped to the logged-in user with RLS

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return null;
  }

  console.log("Profile data fetched:", profileData);

  // Fetch additional data based on the user's role
  if (profileData?.role === 'swimmer') {
    const { data: swimmerData, error: swimmerError } = await supabase
      .from('swimmers')
      .select('date_of_birth')
      .single(); // No need to filter by user_id, RLS handles it

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

  if (profileData?.role === 'coach') {
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('team_id')
      .single(); // No need to filter by user_id, RLS handles it

    if (coachError) {
      console.error('Error fetching coach details:', coachError);
      return profileData; // Return basic profile if coach details fail
    }

    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('name, location')
      .eq('id', coachData.team_id) // We still need this filter since team_id isn't tied to RLS
      .single();

    if (teamError) {
      console.error('Error fetching team details:', teamError);
      return profileData; // Return basic profile if team details fail
    }

    return {
      ...profileData,
      team: teamData,
    };
  }

  return profileData; // Return profile data if no additional role-specific data is needed
}
