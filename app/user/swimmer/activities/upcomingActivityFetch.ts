"use client";
import { useCallback, useEffect, useState } from "react";
import { DashboardUtils, UpcomingActivity } from '@app/api/dashboard/dashboardUtils';
import toast from "react-hot-toast";
import { useUser } from '../../../context/UserContext';

interface Activity {
    start_date: string;
    activity_type?: string;
    additional_details?: Record<string, any>;
    groups?: any[];
    responses?: any[];
}

export const fetchUpcomingActivities = () => {
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
  const [upcomingActivities, setUpcomingActivities] = useState<UpcomingActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState<boolean>(false);
  const { user, loading, error } = useUser();

  // Initialize DashboardUtils for swimmer
  useEffect(() => {
    if (user?.id) {
      setDashboardUtils(new DashboardUtils(user.id, 'swimmer'));
    }
  }, [user?.id]);

  // Fetch upcoming activities
  const fetchUpcomingActivities = useCallback(async () => {
    if (!dashboardUtils) return;
    setActivitiesLoading(true);

    try {
      const response = await dashboardUtils.fetchUpcomingActivities();
      
      // Filter for upcoming activities and map them with proper types
      const now = new Date();
      const upcomingActivities = response.data
        .filter(activity => {
          const activityDate = new Date(activity.start_date);
          return activityDate >= now;
        })
        .map(activity => ({
          ...activity,
          activity_type: activity.activity_type || 'practice',
          additional_details: activity.additional_details || {},
          groups: activity.groups || [],
          responses: activity.responses || []
        }));

      setUpcomingActivities(upcomingActivities);
    } catch (err) {
      console.error('Error fetching upcoming activities:', err);
      toast.error('Failed to load activities');
    } finally {
      setActivitiesLoading(false);
    }
  }, [dashboardUtils]);

  useEffect(() => {
    fetchUpcomingActivities();
  }, [fetchUpcomingActivities]);

    return { upcomingActivities, activitiesLoading };
};



