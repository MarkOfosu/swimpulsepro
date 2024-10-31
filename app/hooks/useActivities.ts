// hooks/useActivities.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UpcomingActivity } from '../lib/types';

interface UseActivitiesProps {
  userId: string;
  userRole: 'coach' | 'swimmer';
  filters?: {
    type?: 'all' | 'meet' | 'practice' | 'event';
    timeFrame?: 'upcoming' | 'past' | 'all';
    groupId?: string;
  };
}

export const useActivities = ({ userId, userRole, filters }: UseActivitiesProps) => {
  const [activities, setActivities] = useState<UpcomingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('get_upcoming_activities', {
            p_user_id: userId,
            p_user_role: userRole,
            p_limit_val: 100
          });

        if (error) throw error;

        let filteredData = [...data];

        // Apply filters
        if (filters?.type && filters.type !== 'all') {
          filteredData = filteredData.filter(
            activity => activity.activity_type === filters.type
          );
        }

        if (filters?.timeFrame) {
          const now = new Date();
          filteredData = filteredData.filter(activity => {
            const activityDate = new Date(activity.start_date);
            switch (filters.timeFrame) {
              case 'upcoming':
                return activityDate > now;
              case 'past':
                return activityDate < now;
              default:
                return true;
            }
          });
        }

        if (filters?.groupId) {
          filteredData = filteredData.filter(
            activity => activity.groups.some((group: { id: string }) => group.id === filters.groupId)
          );
        }

        setActivities(filteredData);
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchActivities();
    }
  }, [userId, userRole, filters]);

  return { activities, loading, error };
};