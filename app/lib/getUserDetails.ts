// lib/getUserDetails.ts
import { createClient } from '@/utils/supabase/client';

export interface UserData {
  photo?: string | undefined;
  level?: number;
  xp?: any;
  nextLevelXp?: any;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'swimmer' | 'coach';
  date_of_birth: Date | null;
  group_id?: string | null;
  group_name?: string;
  coach_first_name?: string;
  coach_last_name?: string;
  team_name?: string;
  team_location?: string;
  age_group?: string;
  gender?: string;
}

export async function getUserDetails(): Promise<UserData | null> {
  const supabase = createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    // console.error('Error fetching user:', userError);
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profileData) {
    // console.error('Error fetching profile:', profileError);
    return null;
  }

  let userData: UserData = {
    id: profileData.id,
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    email: profileData.email,
    role: profileData.role,
    date_of_birth: profileData.date_of_birth,
    gender: profileData.gender,
  };

  if (userData.role === 'swimmer') {
    const { data: swimmerData, error: swimmerError } = await supabase
      .from('swimmers')
      .select('group_id, age_group')
      .eq('id', user.id)
      .single();

    if (swimmerError) {
      // console.error('Error fetching swimmer details:', swimmerError);
    } else if (swimmerData) {
      userData.group_id = swimmerData.group_id;
      userData.age_group = swimmerData.age_group;

      if (swimmerData.group_id) {
        const { data: groupData, error: groupError } = await supabase
          .from('swim_groups')
          .select('name, coach_id')
          .eq('id', swimmerData.group_id)
          .single();

        if (groupError) {
          // console.error('Error fetching group details:', groupError);
        } else if (groupData) {
          userData.group_name = groupData.name;

          if (groupData.coach_id) {
            const { data: coachData, error: coachError } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', groupData.coach_id)
              .single();

            if (coachError) {
              // console.error('Error fetching coach details:', coachError);
            } else if (coachData) {
              userData.coach_first_name = coachData.first_name;
              userData.coach_last_name = coachData.last_name;
            }
          }
        }
      }
    }
  } else if (userData.role === 'coach') {
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('team_id')
      .eq('id', user.id)
      .single();

    if (coachError) {
      // console.error('Error fetching coach details:', coachError);
    } else if (coachData && coachData.team_id) {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('name, location')
        .eq('id', coachData.team_id)
        .single();

      if (teamError) {
        // console.error('Error fetching team details:', teamError);
      } else if (teamData) {
        userData.team_name = teamData.name;
        userData.team_location = teamData.location;
      }
    }
  }

  return userData;
}