'use client';
import React, { useState, useEffect } from 'react';
import CoachPageLayout from '../page';
import styles from '../../../styles/Dashboard.module.css';
import { getUserDetails } from '../../../lib/getUserDetails';
import Loader from '@components/ui/Loader';

// Import test data
import {
  swimGroupsData,
  recentActivitiesData,
  upcomingEventsData,
} from '../../../lib/testData';

const Dashboard: React.FC = () => {
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
      return (
        <CoachPageLayout>
          <div className="page-heading">
            <h1>Coach Overview</h1>
          </div>
          <Loader />
        </CoachPageLayout>
      );
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <CoachPageLayout>
      <div>
        <section className={styles.welcomeSection}>
          <h1>Welcome, Coach {user.first_name}!</h1>
          {/* Conditionally render the swim team name and location if it exists */}
          {user.team ? (
            <p className={styles.swimTeamName}>
              Swim Team: {user.team.name}, {user.team.location}
            </p>
          ) : (
            <p className={styles.swimTeamName}>
              No swim team assigned
            </p>
          )}
          <p>Here is an overview of your swim team’s performance.</p>
        </section>

        <section className={styles.swimGroups}>
          <h2>Your Swim Groups</h2>
          <ul className={styles.groupsList}>
            {swimGroupsData.map((group, index) => (
              <li key={index}>{group.groupName}</li>
            ))}
          </ul>
        </section>

        <section className={styles.recentActivities}>
          <h2>Recent Activities</h2>
          <ul className={styles.activitiesList}>
            {recentActivitiesData.map((activity, index) => (
              <li key={index}>
                <p>{`${activity.activity} - ${activity.swimmer} on ${activity.date}: ${activity.outcome}`}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.upcomingEvents}>
          <h2>Upcoming Events</h2>
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
          <button>Add New Performance Indicator</button>
          <button>Create New Swim Group</button>
        </section>
      </div>
    </CoachPageLayout>
  );
};

export default Dashboard;
