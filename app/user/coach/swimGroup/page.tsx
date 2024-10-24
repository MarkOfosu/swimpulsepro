'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../CoachPageLayout';
import Loader from '@components/elements/Loader';
import { useToast } from '@components/elements/toasts/Toast';
import { ActivityFeed } from '@components/elements/dashboard/ActivityFeed';
import { UpcomingActivities } from '@components/elements/dashboard/UpcomingActivities';
import { DashboardUtils } from '@/utils/dashboard/dashboardUtils';
import { 
  Activity, Users, Award, 
  Calendar, Plus, User
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import styles from '../../../styles/Dashboard.module.css';
import DashboardLoading from './loading';
import { SwimGroup, DashboardMetrics } from '../../../lib/types';
import CreateSwimGroupModal from './createSwimGroup/CreateSwimGroupModal';
import InviteSwimmerModal from './[swimGroupName]/inviteSwimmer/InviteSwimmerModal';

// Initialize Supabase client
const supabase = createClient();

const CoachDashboard: React.FC = () => {
  // User and navigation
  const { user } = useUser();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  // State
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
  const [swimGroups, setSwimGroups] = useState<SwimGroup[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSwimmers: 0,
    totalGroups: 0,
    activeSwimmers: 0,
    totalBadgesAwarded: 0,
    attendanceRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingActivities, setUpcomingActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityPage, setActivityPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SwimGroup | null>(null);

  // Initialize DashboardUtils
  useEffect(() => {
    if (user?.id) {
      setDashboardUtils(new DashboardUtils(user.id, 'coach'));
    }
  }, [user?.id]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!dashboardUtils || !user?.id) return;
  
    try {
      setLoading(true);
      setError(null);
  
      // Fetch all data concurrently
      const [
        groups,
        metricsData,
        activitiesResponse,
        upcomingResponse
      ] = await Promise.all([
        dashboardUtils.fetchSwimGroups(),
        dashboardUtils.fetchDashboardMetrics(),
        dashboardUtils.fetchActivityFeed({ page: activityPage }),
        dashboardUtils.fetchUpcomingActivities()
      ]);
  
  
      // Update state with fetched data
      setSwimGroups(groups);
      setMetrics(metricsData);
      setRecentActivities(activitiesResponse.data);
      setHasMoreActivities(activitiesResponse.metadata.hasMore);
      setUpcomingActivities(upcomingResponse.data);
  
    } catch (err) {
      console.error('Error in fetchDashboardData:', err);
      setError('Failed to fetch dashboard data');
      showToast('Failed to fetch dashboard data. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }, [dashboardUtils, user?.id, activityPage]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handlers
  const handleLoadMoreActivities = useCallback(() => {
    setActivityPage(prev => prev + 1);
  }, []);

  const handleGroupClick = (swimGroupName: string) => {
    if (!swimGroupName) {
      showToast('Invalid group selected', 'error');
      return;
    }
    router.push(`/user/coach/swimGroup/${encodeURIComponent(swimGroupName)}`);
  };

  const handleCreateGroup = () => setShowCreateModal(true);

  const handleInvite = (e: React.MouseEvent, group: SwimGroup) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setShowInviteModal(true);
  };

  // Loading state
  if (loading) {
    return <DashboardLoading />;
  }

  // Error state
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

  // Main render
  return (
    <CoachPageLayout>
      <div className={styles.dashboardContainer}>
        {/* Welcome Section */}
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

        {/* Metrics Grid */}
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

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Swim Groups Section */}
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
        {group.swimmerCount || 0} swimmers
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

          {/* Side Content */}
          <div className={styles.sideContent}>
            <section className={styles.recentActivities}>
              <div className={styles.sectionHeader}>
                <h2>Recent Activities</h2>
              </div>
              <ActivityFeed
                activities={recentActivities}
                loading={loading}
                error={error}
                onLoadMore={handleLoadMoreActivities}
                hasMore={hasMoreActivities}
              />
            </section>

            <section className={styles.upcomingEvents}>
              <div className={styles.sectionHeader}>
                <h2>Upcoming Activities</h2>
              </div>
              <UpcomingActivities
                activities={upcomingActivities}
                loading={loading}
                error={error}
                userRole="coach"
                showResponses={true}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Modals */}
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

