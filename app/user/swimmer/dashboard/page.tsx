'use client';
import React from 'react';
import SwimmerPageLayout from '../SwimmerPageLayout';
import styles from '../../../styles/Dashboard.module.css';
import Loader from '@components/elements/Loader';
import { Card } from '@components/elements/Card';
import Link from 'next/link';
import { AddSwimResult } from '@components/elements/swimResults/AddSwimResult';
import { Button } from '@components/elements/Button';
import { SwimmerResultsHistory } from '@components/elements/swimResults/SwimmerResultsHistory';
import { PersonalBestsComparison } from '@components/elements/swimResults/PersonalBestsComparison';
import { ProgressChart } from '@components/elements/swimResults/ProgressChart';
import { SwimResult } from '@/app/lib/types';
import { createClient } from '@/utils/supabase/client';
import SwimmerStandardsProgress from '@components/elements/swimResults/SwimmerStandardsProgress';
import { useUser } from '../../../context/UserContext';

const SwimmerDashboard: React.FC = () => {
  const { user, loading, error } = useUser();

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
    return(
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
        </section>

        {/* Join Group Card */}
        {!user.group_id && (
          <Card>
            <p>You have not joined a swim group yet.</p>
            <Link href="/user/swimmer/swimTeam">
              <button className={styles.joinButton}>Join a Group</button>
            </Link>
          </Card>
        )}

        {/* Performance Overview */}
        <section className={styles.performanceOverview}>
          <h2>Your Performance Overview</h2>
          <ProgressChart swimmerId={user.id} />
        </section>

        {/* Recent Activities */}
        <section className={styles.personalBests}>
          <h2>Recent Activities</h2>
          <SwimmerResultsHistory swimmerId={user.id} />
        </section>

        {/* Personal Bests */}
        <section className={styles.personalBests}>
          <h2>Personal Bests</h2>
          <PersonalBestsComparison swimmerId={user.id} />
        </section>

        <section className={styles.personalBests}>
          <h2>US Age Group Standards</h2>
          <SwimmerStandardsProgress swimmerId={user.id} displayCount={5} />
        </section>

        {/* Add New Result */}
        <section className={styles.addResult}>
          <h2>Add New Result</h2>
          <AddSwimResult 
            swimmerId={user.id}
            onSubmit={handleAddResult}
          />
        </section>

        {/* Upcoming Events */}
        <section className={styles.upcomingEvents}>
          <h2>Upcoming Swim Events</h2>
          <div className={styles.calendarView}>
            {/* Replace with actual upcoming events data */}
            <p>No upcoming events at the moment.</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <Button className={styles.actionButton}>View Detailed Performance</Button>
          {user.group_id && <button className={styles.actionButton}>Connect with Coach</button>}
        </section>
      </div>
    </SwimmerPageLayout>
  );
};

export default SwimmerDashboard;