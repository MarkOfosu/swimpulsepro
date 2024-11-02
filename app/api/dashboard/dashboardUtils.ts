'use client';

import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export type ActivityResponseStatus = 'attending' | 'interested' | 'not_attending';

export interface ActivityResponseDetails {
  swimmer_id: string;
  first_name: string;
  last_name: string;
  response_status: ActivityResponseStatus;
  additional_info?: string;
  status_updated_at: string;
}

export interface ActivityResponseSummary {
  summary: {
    total_responses: number;
    status_counts: {
      attending?: number;
      interested?: number;
      not_attending?: number;
    };
    attending_swimmers: Array<{
      id?: string;  // Only for coaches
      name: string;
    }>;
  };
  user_response?: {
    status: ActivityResponseStatus;
    additional_info?: string;
    updated_at: string;
  };
}

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
    status: ActivityResponseStatus;
    count: number;
  }[];
  additional_details?: {
    equipment_needed?: string;
    preparation_notes?: string;
    capacity_limit?: string;
    skill_level?: string;
    virtual_link?: string;
    minimum_standard?: string;
    recommended_standard?: string;
  };
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

export class DashboardUtils {
  private userId: string;
  private userRole: 'coach' | 'swimmer';

  constructor(userId: string, userRole: 'coach' | 'swimmer') {
    this.userId = userId;
    this.userRole = userRole;
  }

  async getActivityResponses(activityId: string): Promise<ActivityResponseDetails[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_activity_responses_detailed', {
          p_activity_id: activityId,
          p_user_id: this.userId,
          p_user_role: this.userRole
        });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching activity responses:', error);
      return [];
    }
  }

  async getActivityResponseSummary(activityId: string): Promise<ActivityResponseSummary> {
    try {
      const { data, error } = await supabase
        .rpc('get_activity_response_summary', {
          p_activity_id: activityId,
          p_user_id: this.userId,
          p_user_role: this.userRole
        });

      if (error) throw error;

      return {
        summary: {
          total_responses: data?.summary?.total_responses || 0,
          status_counts: data?.summary?.status_counts || {},
          attending_swimmers: data?.summary?.attending_swimmers || []
        },
        user_response: data?.user_response
      };
    } catch (error) {
      console.error('Error fetching activity response summary:', error);
      return {
        summary: {
          total_responses: 0,
          status_counts: {},
          attending_swimmers: []
        }
      };
    }
  }

  async respondToActivity(
    activityId: string, 
    status: ActivityResponseStatus,
    additionalInfo?: string
  ): Promise<void> {
    if (this.userRole !== 'swimmer') {
      throw new Error('Only swimmers can respond to activities');
    }

    try {
      const { error } = await supabase
        .rpc('respond_to_activity', {
          p_activity_id: activityId,
          p_swimmer_id: this.userId,
          p_status: status,
          p_additional_info: additionalInfo
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error responding to activity:', error);
      throw error;
    }
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

  async fetchUpcomingActivities({ limit = 3 }: FetchOptions = {}) {
    try {
      let activitiesData;
      let activitiesError;
  
      // Different queries based on user role
      if (this.userRole === 'coach') {
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
        const { data: swimmerData } = await supabase
          .from('swimmers')
          .select('group_id')
          .eq('id', this.userId)
          .single();
  
        if (!swimmerData?.group_id) {
          return { data: [], metadata: { hasMore: false } };
        }
  
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
  
        activitiesData = response.data?.filter(activity => {
          const groupIds = activity.groups
            ?.map((g: any) => g.group?.id)
            .filter(Boolean);
          return groupIds?.includes(swimmerData.group_id);
        });
        activitiesError = response.error;
      }
  
      if (activitiesError) throw activitiesError;
  
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
  
      const activityIds = activities.map(a => a.id);
      let responseCounts = [];
      let userResponses: any[] = [];
  
      if (activityIds.length > 0) {
        const responseCountsResult = await supabase
          .rpc('get_activity_response_counts', { p_activity_id: activityIds[0] });
        
        if (responseCountsResult.data) {
          responseCounts = responseCountsResult.data;
        }
  
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
  
      const activitiesWithResponses = activities.map(activity => ({
        ...activity,
        responses: (responseCounts || [])
          .filter((r: any) => r.activity_id === activity.id)
          .map((r: any) => ({
            status: r.response_status,
            count: r.count
          })),
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