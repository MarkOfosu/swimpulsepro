// badgeApi.ts
import { createClient } from '@/utils/supabase/server';

export async function getBadgesForSwimGroup(swimGroupId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('swim_group_badges')
    .select(`
      badges (id, name, description, icon)
    `)
    .eq('swim_group_id', swimGroupId);

  if (error) throw error;
  return data;
}

export async function getSwimmersInGroup(swimGroupId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('swimmers')
    .select('id, name')
    .eq('group_id', swimGroupId);

  if (error) throw error;
  return data;
}

export async function awardBadgeToSwimmer(swimmerId: string, badgeId: string, coachId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('swimmer_badges')
    .insert({
      swimmer_id: swimmerId,
      badge_id: badgeId,
      awarded_by: coachId
    });

  if (error) throw error;
  return data;
}