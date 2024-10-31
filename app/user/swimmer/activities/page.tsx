'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Calendar, Filter } from 'lucide-react';
import { ActivityType, UpcomingActivity, ActivityResponseStatus } from '@/app/lib/types';
import { useUser } from '../../../context/UserContext';
import Loader from '@/components/elements/Loader';
import styles from '../../../styles/SwimmerActivity.module.css';
import SwimmerPageLayout from '../SwimmerPageLayout';
import { DashboardUtils } from '@/app/api/dashboard/dashboardUtils';
import SwimmerActivitiesList from './SwimmerActivityList';
import { toast } from 'react-hot-toast';

const ActivitiesPage = () => {
  const { user } = useUser();
  const [activities, setActivities] = useState<UpcomingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [myResponses, setMyResponses] = useState<{ activityId: string; status: ActivityResponseStatus }[]>([]);

  useEffect(() => {
    if (user?.id) {
      setDashboardUtils(new DashboardUtils(user.id, 'swimmer'));
    }
  }, [user?.id]);

  // Fetch activities and user's responses
  const fetchActivities = useCallback(async () => {
    if (!dashboardUtils || !user?.id) return;
    setLoading(true);

    try {
      const [activitiesResponse, responsesData] = await Promise.all([
        dashboardUtils.fetchUpcomingActivities(),
        fetchUserResponses(user.id)
      ]);

      const now = new Date();
      const filteredActivities = (activitiesResponse.data as UpcomingActivity[])
        .filter((activity: UpcomingActivity) => {
          const activityDate = new Date(activity.start_date);
          switch (selectedFilter) {
            case 'upcoming':
              return activityDate >= now;
            case 'past':
              return activityDate < now;
            default:
              return true;
          }
        })
        .map((activity: any) => ({
          ...activity,
          activity_type: activity.activity_type || '',
          additional_details: activity.additional_details || ''
        }));

      setActivities(filteredActivities);
      setMyResponses(responsesData);
    } catch (err) {
      console.error('Error fetching activities:', err);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [dashboardUtils, selectedFilter, user?.id]);

  const fetchUserResponses = async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activity_responses')
      .select('activity_id, response_status')
      .eq('swimmer_id', userId);

    if (error) {
      console.error('Error fetching responses:', error);
      return [];
    }

    return data.map((response) => ({
      activityId: response.activity_id,
      status: response.response_status,
    }));
  };

  const handleActivityResponse = async (
    activityId: string,
    status: ActivityResponseStatus,
    additionalInfo?: string
  ) => {
    if (!user?.id) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc('respond_to_activity', {
        p_activity_id: activityId,
        p_swimmer_id: user.id,
        p_status: status,
        p_additional_info: additionalInfo
      });

      if (error) throw error;
      
      // Update local state
      setMyResponses(prev => [
        ...prev.filter(response => response.activityId !== activityId),
        { activityId, status }
      ]);
      
      await fetchActivities();
      toast.success('Response submitted successfully');
    } catch (err) {
      console.error('Error responding to activity:', err);
      toast.error('Failed to submit response');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <SwimmerPageLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Swim Activities</h1>
          <div className={styles.filterSection}>
            <Filter size={20} />
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${selectedFilter === 'upcoming' ? styles.active : ''}`}
                onClick={() => setSelectedFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`${styles.filterButton} ${selectedFilter === 'past' ? styles.active : ''}`}
                onClick={() => setSelectedFilter('past')}
              >
                Past
              </button>
              <button
                className={`${styles.filterButton} ${selectedFilter === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <>
            {activities.length === 0 ? (
              <div className={styles.emptyState}>
                <Calendar size={48} />
                <h3>No Activities Found</h3>
                <p>There are no activities scheduled at the moment.</p>
              </div>
            ) : (
              <SwimmerActivitiesList
                activities={activities}
                onRespond={handleActivityResponse}
                isLoading={loading}
                responses={myResponses}
              />
            )}
          </>
        )}
      </div>
    </SwimmerPageLayout>
  );
};

export default ActivitiesPage;