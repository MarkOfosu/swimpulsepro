'use client';

import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export interface FetchOptions {
  page?: number;
  limit?: number;
  groupIds?: string[];
}

export interface ActivityFeedItem {
  id: string;
  type: string;
  description: string;
  created_at: string;
  swimmer_id: string;
  swimmer: {
    first_name: string;
    last_name: string;
  };
}

export interface UpcomingActivity {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  coach_id: string;
  groups?: { id: string; name: string }[];
  responses?: {
    status: 'attending' | 'interested' | 'not_attending';
    count: number;
  }[];
}

export interface DashboardMetrics {
  totalSwimmers: number;
  totalGroups: number;
  activeSwimmers: number;
  totalBadgesAwarded: number;
  attendanceRate: number;
}

export interface SwimGroup {
  id: string;
  name: string;
  description: string;
  group_code: string;
  coach_id: string;
  swimmers: { count: number }[];
  swimmerCount: number;
}

export interface ActivityResponse {
  activity_id: string;
  response_status: 'attending' | 'interested' | 'not_attending';
  count: number;
}

export class DashboardUtils {
  private userId: string;
  private userRole: 'coach' | 'swimmer';

  constructor(userId: string, userRole: 'coach' | 'swimmer') {
    this.userId = userId;
    this.userRole = userRole;
  }

  async fetchActivityFeed({ page = 1, limit = 5 }: FetchOptions = {}) {
    try {
      let query = supabase
        .from('activity_feed')
        .select(`
          *,
          swimmer:swimmers!inner (
            profiles!inner (
              first_name,
              last_name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (this.userRole === 'coach') {
        query = query.eq('coach_id', this.userId);
      } else {
        const { data: swimmerData } = await supabase
          .from('swimmers')
          .select('group_id')
          .eq('id', this.userId)
          .single();

        if (swimmerData?.group_id) {
          query = query.eq('group_id', swimmerData.group_id);
        }
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        metadata: {
          currentPage: page,
          totalCount: count,
          hasMore: (data?.length || 0) === limit
        }
      };
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      return {
        data: [],
        metadata: {
          currentPage: page,
          totalCount: 0,
          hasMore: false
        }
      };
    }
  }
  

  // async fetchUpcomingActivities({ limit = 3 }: FetchOptions = {}) {
  //   try {
  //     // Fetch activities
  //     const { data: eventsData, error: eventsError } = await supabase
  //       .from('upcoming_activities')
  //       .select(`
  //         id,
  //         title,
  //         description,
  //         start_date,
  //         end_date,
  //         location,
  //         coach_id,
  //         groups:activity_groups (
  //           group_id,
  //           swim_groups (
  //             id,
  //             name
  //           )
  //         )
  //       `)
  //       .eq('coach_id', this.userId)
  //       .gt('start_date', new Date().toISOString())
  //       .order('start_date', { ascending: true })
  //       .limit(limit);

  //     if (eventsError) throw eventsError;

  //     // For each activity, get response counts using a stored function
  //     const activityIds = eventsData?.map(event => event.id) || [];
  //     const responseCounts: ActivityResponse[] = [];

  //     if (activityIds.length > 0) {
  //       const { data: responses } = await supabase
  //         .rpc('get_activity_response_counts', { activity_ids: activityIds });
        
  //       if (responses) {
  //         responseCounts.push(...responses);
  //       }
  //     }

  //     // Transform the data
  //     const activities = eventsData?.map(event => {
  //       const eventResponses = responseCounts
  //         .filter(r => r.activity_id === event.id)
  //         .map(r => ({
  //           status: r.response_status,
  //           count: r.count
  //         }));

  //       return {
  //         ...event,
  //         groups: event.groups?.map(g => ({
  //           id: g.swim_groups[0]?.id,
  //           name: g.swim_groups[0]?.name
  //         })) || [],
  //         responses: eventResponses
  //       };
  //     }) || [];

  //     return {
  //       data: activities,
  //       metadata: {
  //         hasMore: (activities.length) === limit
  //       }
  //     };
  //   } catch (error) {
  //     console.error('Error fetching upcoming activities:', error);
  //     return {
  //       data: [],
  //       metadata: {
  //         hasMore: false
  //       }
  //     };
  //   }
  // }
  async fetchUpcomingActivities({ limit = 3 }: FetchOptions = {}) {
    try {
      let activitiesData;
      let activitiesError;
  
      // Different queries based on user role
      if (this.userRole === 'coach') {
        // For coaches, fetch activities they created
        const response = await supabase
          .from('upcoming_activities')
          .select(`
            *,
            groups:activity_groups(
              group:swim_groups(
                id,
                name
              )
            )
          `)
          .eq('coach_id', this.userId)
          .order('start_date', { ascending: true });
  
        activitiesData = response.data;
        activitiesError = response.error;
      } else {
        // For swimmers, first get their group
        const { data: swimmerData } = await supabase
          .from('swimmers')
          .select('group_id')
          .eq('id', this.userId)
          .single();
  
        if (!swimmerData?.group_id) {
          return { data: [], metadata: { hasMore: false } };
        }
  
        // Then fetch activities for their group
        const response = await supabase
          .from('upcoming_activities')
          .select(`
            *,
            groups:activity_groups(
              group:swim_groups(
                id,
                name
              )
            )
          `)
          .order('start_date', { ascending: true });
  
        // Filter activities for swimmer's group
        activitiesData = response.data?.filter(activity => {
          const groupIds = activity.groups
            ?.map((g: any) => g.group?.id)
            .filter(Boolean);
          return groupIds?.includes(swimmerData.group_id);
        });
        activitiesError = response.error;
      }
  
      if (activitiesError) throw activitiesError;
  
      // Transform the activities data
      const activities = activitiesData?.map(activity => {
        const groups = activity.groups
          ?.map((g: any) => g.group)
          .filter((g: any) => g && g.id && g.name) || [];
  
        return {
          ...activity,
          groups,
          additional_details: activity.additional_details || {}
        };
      }) || [];
  
      // Fetch response counts
      const activityIds = activities.map(a => a.id);
      let responseCounts = [];
      let userResponses: any[] = [];
  
      if (activityIds.length > 0) {
        // Get response counts for all activities
        const responseCountsResult = await supabase
          .rpc('get_activity_response_counts', { activity_ids: activityIds });
        
        if (responseCountsResult.data) {
          responseCounts = responseCountsResult.data;
        }
  
        // If swimmer, get their own responses
        if (this.userRole === 'swimmer') {
          const swimmerResponsesResult = await supabase
            .from('activity_responses')
            .select('activity_id, response_status')
            .eq('swimmer_id', this.userId)
            .in('activity_id', activityIds);
  
          if (swimmerResponsesResult.data) {
            userResponses = swimmerResponsesResult.data;
          }
        }
      }
  
      // Add response counts and user responses to activities
      const activitiesWithResponses = activities.map(activity => ({
        ...activity,
        responses: (responseCounts || [])
          .filter((r: any) => r.activity_id === activity.id)
          .map((r: any) => ({
            status: r.response_status,
            count: r.count
          })),
        // Only include swimmer response if user is a swimmer
        ...(this.userRole === 'swimmer' && {
          swimmerResponse: userResponses.find(
            r => r.activity_id === activity.id
          )?.response_status
        })
      }));
  
      return {
        data: activitiesWithResponses,
        metadata: {
          hasMore: activities.length === limit
        }
      };
    } catch (error) {
      console.error('Error fetching upcoming activities:', error);
      return {
        data: [],
        metadata: {
          hasMore: false
        }
      };
    }
  }



  async fetchDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      // Call a stored function to get metrics
      const { data: metrics } = await supabase
        .rpc('get_dashboard_metrics', { 
          p_user_id: this.userId,
          p_user_role: this.userRole
        });

      return metrics || {
        totalSwimmers: 0,
        totalGroups: 0,
        activeSwimmers: 0,
        totalBadgesAwarded: 0,
        attendanceRate: 0
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return {
        totalSwimmers: 0,
        totalGroups: 0,
        activeSwimmers: 0,
        totalBadgesAwarded: 0,
        attendanceRate: 0
      };
    }
  }

  async createActivity(activityData: Omit<UpcomingActivity, 'id' | 'coach_id'>) {
    if (this.userRole !== 'coach') {
      throw new Error('Only coaches can create activities');
    }

    const { groups, ...activity } = activityData;

    try {
      // Start a transaction
      const { data, error } = await supabase.rpc('create_activity', {
        activity_data: activity,
        coach_id: this.userId,
        group_ids: groups?.map(g => g.id) || []
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async respondToActivity(
    activityId: string, 
    status: 'attending' | 'interested' | 'not_attending'
  ) {
    if (this.userRole !== 'swimmer') {
      throw new Error('Only swimmers can respond to activities');
    }

    try {
      const { data, error } = await supabase
        .rpc('respond_to_activity', {
          p_activity_id: activityId,
          p_swimmer_id: this.userId,
          p_status: status
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error responding to activity:', error);
      throw error;
    }
  }

  async fetchSwimGroups(): Promise<SwimGroup[]> {
    try {
      const { data: groupsData, error: groupsError } = await supabase
        .from('swim_groups')
        .select(`
          id,
          name,
          description,
          group_code,
          coach_id,
          swimmers(count)
        `)
        .eq('coach_id', this.userId)
        .order('name', { ascending: true });
  
      if (groupsError) throw groupsError;
  
      const validatedGroups = (groupsData || []).map(group => ({
        id: group.id,
        name: group.name || 'Unnamed Group',
        description: group.description || 'No description available',
        group_code: group.group_code || 'No code available',
        coach_id: group.coach_id,
        swimmers: group.swimmers || [{ count: 0 }],
        swimmerCount: group.swimmers?.[0]?.count || 0
      }));
  
      return validatedGroups;
    } catch (error) {
      console.error('Error fetching swim groups:', error);
      throw error;
    }
  }
}
