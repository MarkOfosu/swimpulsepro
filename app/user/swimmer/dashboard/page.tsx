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
import { SwimResult, UpcomingActivity } from '@/app/lib/types';
import { createClient } from '@/utils/supabase/client';
import SwimmerStandardsProgress from '@/components/elements/swimResults/SwimmerStandardsProgress';
import { useUser } from '../../../context/UserContext';
import { DashboardUtils } from '@app/api/dashboard/dashboardUtils';

const SwimmerDashboard: React.FC = () => {
  const { user, loading, error } = useUser();
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
  const [upcomingActivities, setUpcomingActivities] = useState<UpcomingActivity[]>([]);

  useEffect(() => {
    if (user?.id) {
      setDashboardUtils(new DashboardUtils(user.id, 'swimmer'));
    }
  }, [user?.id]);

  const fetchUpcomingActivities = useCallback(async () => {
    if (!dashboardUtils) return;

    try {
      const upcomingResponse = await dashboardUtils.fetchUpcomingActivities();
      const activitiesWithTypes = upcomingResponse.data.map((activity: any) => ({
        ...activity,
        activity_type: activity.activity_type || 'default_type', // Provide a default value if necessary
      }));
      setUpcomingActivities(activitiesWithTypes);
    } catch (err) {
      console.error('Error fetching upcoming activities:', err);
    }
  }, [dashboardUtils]);

  useEffect(() => {
    fetchUpcomingActivities();
  }, [fetchUpcomingActivities]);

  const handleAddResult = async (newResult: Omit<SwimResult, 'id' | 'is_personal_best'>) => {
    try {
      const supabase = createClient();
      const resultWithPersonalBest = { ...newResult, is_personal_best: false };
      const { data, error } = await supabase
        .from('swim_results')
        .insert([resultWithPersonalBest])
        .select()
        .single();

      if (error) throw error;
    } catch (error) {
      console.error('Error adding result:', error);
    }
  };

  if (loading) {
    return (
      <SwimmerPageLayout>
        <Loader />
      </SwimmerPageLayout>
    )
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
          <h2>Upcoming Swim Activities</h2>
          {upcomingActivities.length > 0 ? (
            <div className={styles.activityList}>
              {upcomingActivities.map((activity) => (
                <div key={activity.id} className={styles.activityCard}>
                  <div className={styles.activityHeader}>
                    <h3>{activity.title}</h3>
                  </div>
                  <div className={styles.activityBody}>
                    <p>{activity.description}</p>
                    <p>
                      <strong>Date:</strong> {new Date(activity.start_date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Location:</strong> {activity.location}
                    </p>
                    <p>
                      <strong>Groups:</strong>{' '}
                      {activity.groups?.map((group) => group.name).join(', ')}
                    </p>
                    <p>
                      <strong>Responses:</strong>{' '}
                      {activity.responses?.map((response) => (
                        <span
                          key={response.status}
                          className={`${styles.responseStatus} ${styles[response.status]}`}
                        >
                          {response.status} ({response.count})
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming activities at the moment.</p>
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
          <Button className={styles.actionButton}>View Detailed Performance</Button>
          {user.group_id && <Button className={styles.actionButton}>Connect with Coach</Button>}
        </section>
      </div>
    </SwimmerPageLayout>
  );
};

export default SwimmerDashboard;