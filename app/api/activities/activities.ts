// lib/api/activities.ts
import { createClient } from '@/utils/supabase/client';
import { UpcomingActivity } from '../../lib/types';

export const activitiesApi = {
  createActivity: async (
    activityData: Partial<UpcomingActivity>,
    coachId: string,
    groupIds: string[]
  ) => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_activity', {
      p_activity_data: activityData,
      p_coach_id: coachId,
      p_group_ids: groupIds
    });

    if (error) throw error;
    return data;
  },

  respondToActivity: async (
    activityId: string,
    swimmerId: string,
    status: 'attending' | 'interested' | 'not_attending'
  ) => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('respond_to_activity', {
      p_activity_id: activityId,
      p_swimmer_id: swimmerId,
      p_status: status
    });

    if (error) throw error;
    return data;
  },

  getActivityResponses: async (activityId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activity_responses')
      .select(`
        id,
        response_status,
        swimmers (
          id,
          first_name,
          last_name
        )
      `)
      .eq('activity_id', activityId);

    if (error) throw error;
    return data;
  }
};