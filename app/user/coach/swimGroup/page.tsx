'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../CoachPageLayout';
import Loader from '@components/elements/Loader';
import { useToast } from '@components/elements/toasts/Toast';
import { 
  LineChart, Activity, Users, Award, 
  Calendar, Plus, User, Clock, MapPin
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import styles from '../../../styles/Dashboard.module.css';
import CreateSwimGroupModal from './createSwimGroup/CreateSwimGroupModal';
import InviteSwimmerModal from './[swimGroupName]/inviteSwimmer/InviteSwimmerModal';
import DashboardLoading from './loading';

interface SwimGroup {
  id: string;
  name: string;
  description: string;
  group_code: string;
  coach_id: string;
  swimmers: { count: number }[];
}

interface DashboardMetrics {
  totalSwimmers: number;
  totalGroups: number;
  activeSwimmers: number;
  totalBadgesAwarded: number;
  attendanceRate: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  swimmer_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

const CoachDashboard: React.FC = () => {
  const { user } = useUser();
  const [swimGroups, setSwimGroups] = useState<SwimGroup[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSwimmers: 0,
    totalGroups: 0,
    activeSwimmers: 0,
    totalBadgesAwarded: 0,
    attendanceRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SwimGroup | null>(null);
  
  const { showToast, ToastContainer } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch swim groups with swimmer count
      const { data: groupsData, error: groupsError } = await supabase
        .from('swim_groups')
        .select(`
          id,
          name,
          description,
          group_code,
          coach_id,
          swimmers(count)
        `)
        .eq('coach_id', user.id)
        .order('name', { ascending: true });

      if (groupsError) throw groupsError;

      // Validate and transform groups data
      const validatedGroups = (groupsData || []).map(group => ({
        id: group.id,
        name: group.name || 'Unnamed Group',
        description: group.description || 'No description available',
        group_code: group.group_code || 'No code available',
        coach_id: group.coach_id,
        swimmers: group.swimmers || [{ count: 0 }]
      }));

      setSwimGroups(validatedGroups);

      // Calculate total swimmers
      const totalSwimmers = validatedGroups.reduce((acc, group) => 
        acc + (group.swimmers[0]?.count || 0), 0);

      setMetrics({
        totalSwimmers,
        totalGroups: validatedGroups.length,
        activeSwimmers: totalSwimmers,
        totalBadgesAwarded: 0,
        attendanceRate: 100,
      });

      // Note: These queries need to be adjusted based on your actual database structure
      try {
        const { data: activitiesData } = await supabase
          .from('activities')
          .select(`
            id,
            description,
            created_at,
            type,
            swimmer_id,
            profiles (
              first_name,
              last_name
            )
          `)
          .in('group_id', validatedGroups.map(g => g.id))
          .order('created_at', { ascending: false })
          .limit(5);

        const validatedActivities = (activitiesData || []).map(activity => ({
          ...activity,
          profiles: activity.profiles ? activity.profiles[0] : undefined,
        }));

        setRecentActivities(validatedActivities);
      } catch (activityError) {
        // console.log('Error fetching activities:', activityError);
      }

      try {
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .in('group_id', validatedGroups.map(g => g.id))
          .order('date', { ascending: true })
          .limit(3);

        setUpcomingEvents(eventsData || []);
      } catch (eventError) {
        // console.log('Error fetching events:', eventError);
      }

    } catch (err) {
      // console.error('Error in fetchDashboardData:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      showToast('Failed to fetch dashboard data. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateGroup = () => {
    setShowCreateModal(true);
  };

  const handleGroupClick = (swimGroupName: string) => {
    if (!swimGroupName) {
      showToast('Invalid group selected', 'error');
      return;
    }
    router.push(`/user/coach/swimGroup/${encodeURIComponent(swimGroupName)}`);
  };

  const handleInvite = (e: React.MouseEvent, group: SwimGroup) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setShowInviteModal(true);
  };

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <CoachPageLayout>
        <div className={styles.pageContainer}>
          <h1 className={styles.pageHeading}>Dashboard</h1>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => fetchDashboardData()} 
              className={styles.retryButton}
            >
              Retry
            </button>
          </div>
        </div>
      </CoachPageLayout>
    );
  }

  return (
    <CoachPageLayout>
      <div className={styles.dashboardContainer}>
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h1>Welcome, Coach {user?.first_name}!</h1>
            {user?.team_name && (
              <p className={styles.swimTeamName}>
                {user.team_name}, {user.team_location}
              </p>
            )}
          </div>
        </section>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Users size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>Total Swimmers</h3>
              <p>{metrics.totalSwimmers}</p>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Activity size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>Active Swimmers</h3>
              <p>{metrics.activeSwimmers}</p>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Award size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>Badges Awarded</h3>
              <p>{metrics.totalBadgesAwarded}</p>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Calendar size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>Attendance Rate</h3>
              <p>{metrics.attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.groupsSection}>
            <div className={styles.sectionHeader}>
              <h2>Swim Groups</h2>
              <button 
                className={styles.addButton}
                onClick={handleCreateGroup}
              >
                <Plus size={16} />
                New Group
              </button>
            </div>
            <div className={styles.groupsGrid}>
              {swimGroups.map((group) => (
                <div 
                  key={group.id} 
                  className={styles.groupCard}
                  onClick={() => handleGroupClick(group.name)}
                >
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <div className={styles.groupStats}>
                    <span>
                      <User size={16} />
                      {group.swimmers[0]?.count || 0} swimmers
                    </span>
                    <span className={styles.groupCode}>
                      Code: {group.group_code}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleInvite(e, group)}
                    className={styles.inviteButton}
                  >
                    Invite Swimmer
                  </button>
                </div>
              ))}
              {swimGroups.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No swim groups created yet</p>
                  <p>Click &apos;New Group&apos; to get started</p>
                </div>
              )}
            </div>
          </section>

          <div className={styles.sideContent}>
            <section className={styles.recentActivities}>
              <div className={styles.sectionHeader}>
                <h2>Recent Activities</h2>
              </div>
              <div className={styles.activityList}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <Activity size={16} />
                    </div>
                    <div className={styles.activityContent}>
                      <p className={styles.activityDescription}>
                        {activity.description}
                      </p>
                      <div className={styles.activityMeta}>
                        <span className={styles.activityTime}>
                          <Clock size={14} />
                          {new Date(activity.created_at).toLocaleDateString()}
                        </span>
                        {activity.profiles && (
                          <span className={styles.activityUser}>
                            <User size={14} />
                            {activity.profiles.first_name} {activity.profiles.last_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {recentActivities.length === 0 && (
                  <div className={styles.emptyState}>
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            </section>

            <section className={styles.upcomingEvents}>
              <div className={styles.sectionHeader}>
                <h2>Upcoming Events</h2>
              </div>
              <div className={styles.eventsList}>
                {upcomingEvents.map((event) => (
                  <div key={event.id} className={styles.eventCard}>
                    <div className={styles.eventHeader}>
                      <Calendar size={18} />
                      <h3>{event.title}</h3>
                    </div>
                    <div className={styles.eventDetails}>
                      <p className={styles.eventDate}>
                        <Clock size={14} />
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className={styles.eventLocation}>
                        <MapPin size={14} />
                        {event.location}
                      </p>
                    </div>
                    {event.description && (
                      <p className={styles.eventDescription}>{event.description}</p>
                    )}
                  </div>
                ))}
                {upcomingEvents.length === 0 && (
                  <div className={styles.emptyState}>
                    <p>No upcoming events</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateSwimGroupModal
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={async () => {
            await fetchDashboardData();
            setShowCreateModal(false);
          }}
        />
      )}

      {showInviteModal && selectedGroup && (
        <InviteSwimmerModal
          groupId={selectedGroup.id}
          swimGroupName={selectedGroup.name}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedGroup(null);
          }}
          onInviteSuccess={() => {
            showToast('Invitation sent successfully!', 'success');
            setShowInviteModal(false);
            setSelectedGroup(null);
          }}
        />
      )}

      <ToastContainer />
    </CoachPageLayout>
  );
};

export default CoachDashboard;