// // badgeApi.ts
// import { createClient } from '@/utils/supabase/server';

// export async function getBadgesForSwimGroup(swimGroupId: string) {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('swim_group_badges')
//     .select(`
//       id,
//       name,
//       badges (id, name, description, icon)
//     `)
//     .eq('swim_group_id', swimGroupId);

//   if (error) throw error;
//   return data;
// }

// export async function getSwimmersInGroup(swimGroupId: string) {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('swimmers')
//     .select('id, name')
//     .eq('group_id', swimGroupId);

//   if (error) throw error;
//   return data;
// }

// export async function awardBadgeToSwimmer(swimmerId: string, badgeId: string, name: string | undefined, coachId: string, groupId: string) {
//   console.log('Awarding badge with params:', { swimmerId, badgeId, name, coachId, groupId });
  
//   if (!name) {
//     try {
//       name = await getBadgeNameById(badgeId); // Fetch badge name if not provided
//       if (!name) {
//         throw new Error('Unable to retrieve badge name');
//       }
//     } catch (error) {
//       console.error('Error fetching badge name:', error);
//       throw error; // Exit early if the badge name cannot be retrieved
//     }
//   }

//   const supabase = createClient();
  
//   const insertData = {
//     swimmer_id: swimmerId,
//     badge_id: badgeId,
//     name,  // Ensure this field has a value before insertion
//     group_id: groupId,
//     awarded_by: coachId
//   };
  
//   console.log('Inserting data:', insertData);

//   const { data, error } = await supabase
//     .from('swimmer_badges')
//     .insert([insertData]);

//   if (error) {
//     console.error('Error in awardBadgeToSwimmer:', error);
//     throw error;
//   }
  
//   console.log('Badge awarded successfully:', data);
//   return data;
// }


// export async function getBadgeNameById(badgeId: string) {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('badges')
//     .select('name')
//     .eq('id', badgeId)
//     .single();

//   if (error) {
//     console.error('Error fetching badge name:', error);
//     throw error;
//   }
  
//   console.log('Fetched badge name:', data?.name);
//   return data?.name;
// }
