'use client';
import React, { useState, useEffect } from 'react';
import SwimmerPageLayout from '../SwimPageLayout';
import styles from '../../../styles/Dashboard.module.css';
import { getUserDetails, UserData } from '../../../lib/getUserDetails';
import Loader from '@components/ui/Loader';
import {
  swimmersPerformanceData,
  recentActivitiesData,
  upcomingEventsData,
} from '../../../lib/testData';
import { Card } from '@components/ui/Card';
import Link from 'next/link';

const SwimmerDashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        if (!userData) throw new Error('Failed to fetch user details');
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user details.');
      }
    };

    fetchUser();
  }, []);

  if (!user && !error) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SwimmerPageLayout>
      <div>
        <section className={styles.welcomeSection}>
          {user && <h1>Welcome, {user.first_name}!</h1>}
          
          {user?.group_id ? (
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
          <p>Here is an overview of your recent performance.</p>
        </section>

        {!user?.group_id && (
          <Card>
            <p>You have not joined a swim group yet.</p>
            <Link href="/user/swimmer/swimTeam">
              <button>Join a Group</button>
            </Link>
          </Card>
        )}

        <section className={styles.recentActivities}>
          <h2>Your Performance Overview</h2>
          <p>Performance data will be displayed here.</p>
        </section>

        <section className={styles.recentActivities}>
          <h2>Recent Activities</h2>
          <ul className={styles.activitiesList}>
            {recentActivitiesData.map((activity, index) => (
              <li key={index}>
                <p>{`${activity.activity} on ${activity.date}: ${activity.outcome}`}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.upcomingEvents}>
          <h2>Upcoming Swim Events</h2>
          <div className={styles.calendarView}>
            {upcomingEventsData.map((event, index) => (
              <div key={index}>
                <p>{`${event.eventName} on ${event.date} at ${event.location}`}</p>
                <p>{`Participants: ${event.participants.join(', ')}`}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <button>View Detailed Performance</button>
          {user && user.group_id && <button>Connect with Coach</button>}
        </section>
      </div>
    </SwimmerPageLayout>
  );
};

export default SwimmerDashboard;