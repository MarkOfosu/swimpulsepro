'use client';
import React, { useState, useEffect, useCallback } from 'react';
import SwimmerPageLayout from '../SwimmerPageLayout';
import styles from '../../../styles/SwimmerDashboard.module.css';
import Loader from '@components/elements/Loader';
import Link from 'next/link';
import { AddSwimResult } from '@/components/elements/swimResults/AddSwimResult';
import { Button } from '@/components/elements/Button';
import { SwimmerResultsHistory } from '@/components/elements/swimResults/SwimmerResultsHistory';
import { PersonalBestsComparison } from '@/components/elements/swimResults/PersonalBestsComparison';
import { ProgressChart } from '@/components/elements/swimResults/ProgressChart';
import { ActivityResponseStatus, SwimResult, UpcomingActivity } from '@app/lib/types';
import { createClient } from '@/utils/supabase/client';
import SwimmerStandardsProgress from '@/components/elements/swimResults/SwimmerStandardsProgress';
import { useUser } from '../../../context/UserContext';
import { DashboardUtils } from '@app/api/dashboard/dashboardUtils';
import SwimmerActivitiesList  from '../activities/SwimmerActivityList';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const SwimmerDashboard: React.FC = () => {
  const { user, loading, error } = useUser();
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
  const [upcomingActivities, setUpcomingActivities] = useState<UpcomingActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [currentResponse, setCurrentResponse] = useState<{
      activityId: string;
      status: ActivityResponseStatus;
    } | undefined>(undefined);

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

  // Handle swim result submission
  const handleAddResult = async (newResult: Omit<SwimResult, 'id' | 'is_personal_best'>) => {
    try {
      const supabase = createClient();
      const resultWithPersonalBest = { ...newResult, is_personal_best: false };
      const { error } = await supabase
        .from('swim_results')
        .insert([resultWithPersonalBest])
        .select()
        .single();

      if (error) throw error;
      toast.success('Result added successfully');
    } catch (error) {
      console.error('Error adding result:', error);
      toast.error('Failed to add result');
    }
  };

  // Handle activity response
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
      
      // Update current response
      setCurrentResponse({
        activityId,
        status
      });
      
      await fetchUpcomingActivities();
      toast.success('Response submitted successfully');
    } catch (err) {
      console.error('Error responding to activity:', err);
      toast.error('Failed to submit response');
    }
  };

  if (loading) {
    return (
      <SwimmerPageLayout>
        <Loader />
      </SwimmerPageLayout>
    );
  }

  if (error) {
    return (
      <SwimmerPageLayout>
        <div className={styles.error}>{error}</div>
      </SwimmerPageLayout>
    );
  }

  if (!user) {
    return (
      <SwimmerPageLayout>
        <div className={styles.error}>No user found</div>
      </SwimmerPageLayout>
    );
  }

  return (
    <SwimmerPageLayout>
      <div className={styles.dashboard}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1>Welcome, {user.first_name}!</h1>
            {user.group_id ? (
              <p className={styles.swimTeamName}>
                Your Swim Group: {user.group_name}
                {user.coach_first_name && user.coach_last_name && (
                  <>, Coach: {user.coach_first_name} {user.coach_last_name}</>
                )}
              </p>
            ) : (
              <p className={styles.swimTeamName}>
                You currently don&apos;t have a swim group assigned.
              </p>
            )}
          </div>
        </section>

        {/* Join Group Card */}
        {!user.group_id && (
          <div className={styles.joinGroupCard}>
            <h2>Join a Swim Group</h2>
            <p>You have not joined a swim group yet.</p>
            <Link href="/user/swimmer/swimTeam">
              <Button>Join a Group</Button>
            </Link>
          </div>
        )}

        {/* Performance Overview */}
        <section className={styles.performanceOverview}>
          <h2>Your Performance Overview</h2>
          <ProgressChart swimmerId={user.id} />
        </section>

        {/* Personal Bests */}
        <section className={styles.personalBests}>
          <h2>Personal Bests</h2>
          <PersonalBestsComparison swimmerId={user.id} />
        </section>

        {/* Add New Result */}
        <section className={styles.addResult}>
          <h2>Add New Result</h2>
          <AddSwimResult
            swimmerId={user.id}
            onSubmit={handleAddResult}
          />
        </section>

        {/* Age Group Standards */}
        <section className={styles.ageGroupStandards}>
          <h2>US Age Group Standards</h2>
          <SwimmerStandardsProgress swimmerId={user.id} displayCount={5} />
        </section>

        {/* Upcoming Activities */}
        <section className={styles.upcomingActivities}>
        <div className={styles.sectionHeader}>
          <h2>Upcoming Activities</h2>
          <Link href="/user/swimmer/activities" className={styles.viewAllLink}>
            View All Activities
          </Link>
        </div>

        {activitiesLoading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : upcomingActivities.length === 0 ? (
          <div className={styles.emptyState}>
            <Calendar size={48} />
            <h3>No Upcoming Activities</h3>
            <p>There are no activities scheduled at the moment.</p>
          </div>
        ) : (
          <SwimmerActivitiesList
            activities={upcomingActivities}
            onRespond={handleActivityResponse}
            isLoading={activitiesLoading}
            currentResponse={currentResponse}
            responses={upcomingActivities.flatMap(activity => 
              (activity.responses || []).map(response => ({
                ...response,
                activityId: activity.id
              }))
            )}
          />
        )}
      </section>

        {/* Recent Activities */}
        <section className={styles.recentActivities}>
          <h2>Recent Activities</h2>
          <SwimmerResultsHistory swimmerId={user.id} />
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <Link href="/user/swimmer/performance">
              <Button className={styles.actionButton}>View Detailed Performance</Button>
            </Link>
            {user.group_id && (
              <Link href="/user/swimmer/communication">
                <Button className={styles.actionButton}>Connect with Coach</Button>
              </Link>
            )}
          </div>
        </section>
      </div>
    </SwimmerPageLayout>
  );
};

export default SwimmerDashboard;