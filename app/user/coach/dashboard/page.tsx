'use client';
import React, { useState, useEffect } from 'react';
import CoachPageLayout from '../CoachPageLayout';
import styles from '../../../styles/Dashboard.module.css';
import { getUserDetails, UserData } from '../../../lib/getUserDetails';
import Loader from '@components/ui/Loader';
import { createClient } from '@/utils/supabase/client';

import {
  recentActivitiesData,
  upcomingEventsData,
} from '../../../lib/testData';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [swimGroups, setSwimGroups] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndGroups = async () => {
      try {
        const userData = await getUserDetails();
        if (!userData) throw new Error('Failed to fetch user details');
        setUser(userData);

        if (userData.role === 'coach') {
          const { data: groups, error: groupsError } = await supabase
            .from('swim_groups')
            .select('id, name')
            .eq('coach_id', userData.id);

          if (groupsError) throw groupsError;
          setSwimGroups(groups || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load user details or swim groups.');
      }
    };

    fetchUserAndGroups();
  }, []);

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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <CoachPageLayout>
      <div>
        <section className={styles.welcomeSection}>
          <h1>Welcome, Coach {user?.first_name}!</h1>
          {user?.team_name ? (
            <p className={styles.swimTeamName}>
              Swim Team: {user.team_name}, {user.team_location}
            </p>
          ) : (
            <p className={styles.swimTeamName}>
              No swim team assigned
            </p>
          )}
          <p>Here is an overview of your swim team&apos;s performance.</p>
        </section>

        <section className={styles.swimGroups}>
          <h2>Your Swim Groups</h2>
          {swimGroups.length > 0 ? (
            <ul className={styles.groupsList}>
              {swimGroups.map((group) => (
                <li key={group.id}>{group.name}</li>
              ))}
            </ul>
          ) : (
            <p>No swim groups assigned yet.</p>
          )}
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