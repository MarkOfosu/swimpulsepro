'use client';
import React, { useState, useEffect } from 'react';
import SwimmerPageLayout from '../SwimPageLayout';  // Assuming a SwimmerPageLayout component
import styles from '../../../styles/Dashboard.module.css';
import { getUserDetails } from '../../../lib/getUserDetails';
import Loader from '@components/ui/Loader';

// Import test data
import {
  swimmersPerformanceData,
  recentActivitiesData,
  upcomingEventsData,
} from '../../../lib/testData';

const SwimmerDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null); // For error handling

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user details.');
      }
    };

    fetchUser();
  }, []);

  // If user data is still being fetched
  if (!user && !error) {
    return <Loader />;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SwimmerPageLayout>
      <div>
        <section className={styles.welcomeSection}>
          <h1>Welcome, {user.first_name}!</h1>
          
          {user.team ? (
            <p className={styles.swimTeamName}>
              Your Swim Coach: {user.team.name}, Location: {user.team.location}
            </p>
          ) : (
            <p className={styles.swimTeamName}>
              You currently don&apos;t have a coach assigned.
            </p>
          )}
          <p>Here is an overview of your recent performance.</p>
        </section>

        <section className={styles.recentActivities}>
          <h2>Your Performance Overview</h2>
          {/* <ul className={styles.performanceList}>
            {swimmersPerformanceData.map((performance: { swimmer: string; date: string; metric: string; value: number; }, index) => (
              <li key={index}>
                <p>{`Date: ${performance.date}, Event: ${performance.metric}, Time: ${performance.value}, Outcome: ${performance.swimmer}`}</p>
              </li>
            ))}
          </ul> */}
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
          <button>Connect with Coach</button>
        </section>
      </div>
    </SwimmerPageLayout>
  );
};

export default SwimmerDashboard;
