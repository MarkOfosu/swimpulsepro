
// Dashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import CoachPageLayout from '../CoachPageLayout';
import styles from '../../../styles/Dashboard.module.css';
import { useUser } from '../../../context/UserContext';
// import Loader from '@components/elements/Loader';
import { createClient } from '@/utils/supabase/client';
import {
  recentActivitiesData,
  upcomingEventsData,
} from '../../../lib/testData';
import DashboardLoading from './loading';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [swimGroups, setSwimGroups] = useState<any[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();



  useEffect(() => {
    const fetchGroups = async () => {
      if (user?.role === 'coach') {
        try {
          const { data: groups, error: groupsError } = await supabase
            .from('swim_groups')
            .select('id, name')
            .eq('coach_id', user.id);

          if (groupsError) throw groupsError;
          setSwimGroups(groups || []);
        } catch (err) {
          console.error('Error fetching groups:', err);
          setError('Failed to load swim groups.');
        } finally {
          setGroupsLoading(false);
        }
      } else {
        setGroupsLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

 

  // Only show loading for swim groups, not the entire dashboard
  const renderSwimGroups = () => {
    if (groupsLoading) {
      return (
        <section className={styles.swimGroups}>
          <h2>Your Swim Groups</h2>
          <DashboardLoading />
        </section>
      );
    }

    return (
      <section className={styles.swimGroups}>
        <h2>Your Swim Groups</h2>
        {error ? (
          <p className={styles.errorText}>{error}</p>
        ) : swimGroups.length > 0 ? (
          <ul className={styles.groupsList}>
            {swimGroups.map((group) => (
              <li key={group.id}>{group.name}</li>
            ))}
          </ul>
        ) : (
          <p>No swim groups assigned yet.</p>
        )}
      </section>
    );
  };

  return (
    <CoachPageLayout>
      <div className={styles.dashboardContainer}>
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

        {renderSwimGroups()}

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
              <div key={index} className={styles.eventItem}>
                <p className={styles.eventName}>{event.eventName}</p>
                <p className={styles.eventDetails}>{`on ${event.date} at ${event.location}`}</p>
                <p className={styles.eventParticipants}>{`Participants: ${event.participants.join(', ')}`}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <button className={styles.actionButton}>Add New Performance Indicator</button>
          <button className={styles.actionButton}>Create New Swim Group</button>
        </section>
      </div>
    </CoachPageLayout>
  );
};

export default Dashboard;