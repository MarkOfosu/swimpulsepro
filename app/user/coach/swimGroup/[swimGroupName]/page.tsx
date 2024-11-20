'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../../CoachPageLayout';
import Loader from '@components/elements/Loader';
import { useToast } from '@components/elements/toasts/Toast';
import styles from '../../../../styles/SwimGroup.module.css';
import BadgeManagementPage from './badgeSection/BadgeManagement';
import AttendanceInsights from '../attendance/AttendanceInsights';
import SwimmerDetails from './swimmerDetails/SwimmerDetails';


// Core Interfaces
interface SwimGroup {
  id: string;
  name: string;
  description: string;
  group_code: string;
  coach_id: string;
  created_at: string;
  updated_at: string;
}

interface SwimmerWithDetails {
  id: string;
  group_id: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    gender: string;
  };
}

interface Invitation {
  id: string;
  group_id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SwimmerBadge {
  id: string;
  swimmer_id: string;
  badge_id: string;
  group_id: string;
  awarded_by: string;
  awarded_at: string;
}

const SwimGroupPage: React.FC = () => {
  // State Management
  const [swimGroup, setSwimGroup] = useState<SwimGroup | null>(null);
  const [swimmers, setSwimmers] = useState<SwimmerWithDetails[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [swimmerBadges, setSwimmerBadges] = useState<SwimmerBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [selectedSwimmer, setSelectedSwimmer] = useState<string>('');
  const [showAttendanceInsights, setShowAttendanceInsights] = useState(false);
  const [selectedSwimmerId, setSelectedSwimmerId] = useState<string | null>(null);
  const [isSwimmerListOpen, setIsSwimmerListOpen] = useState(true);
  const [coachId, setCoachId] = useState<string | null>(null);

  // Hooks
  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  // Coach Authentication
  useEffect(() => {
    const authenticateCoach = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('Authentication failed');
        }

        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('id')
          .eq('id', user.id)
          .single();

        if (coachError) {
          throw new Error('Coach verification failed');
        }

        setCoachId(coachData.id);
      } catch (err) {
        setError((err as Error).message);
        showToast('Authentication Error: ' + (err as Error).message, 'error');
      }
    };

    authenticateCoach();
  }, [supabase]);

  // Data Fetching
  const fetchSwimGroupData = useCallback(async () => {
    if (!params.swimGroupName || !coachId) {
      setError('Unable to fetch swim group data. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const swimGroupName = decodeURIComponent(params.swimGroupName as string);

      // Fetch group data
      const { data: group, error: groupError } = await supabase
        .from('swim_groups')
        .select('*')
        .eq('name', swimGroupName)
        .eq('coach_id', coachId)
        .single();

      if (groupError) {
        if (groupError.code === 'PGRST116') {
          throw new Error('Swim group not found or access denied');
        }
        throw groupError;
      }
      setSwimGroup(group);

      // Fetch all related data in parallel
      const [swimmersResponse, invitationsResponse, badgesResponse, swimmerBadgesResponse] = await Promise.all([
        supabase
          .from('swimmers')
          .select(`
            id,
            group_id,
            date_of_birth,
            created_at,
            updated_at,
            profiles (first_name, last_name, gender)
          `)
          .eq('group_id', group.id),
        
        supabase
          .from('invitations')
          .select('*')
          .eq('group_id', group.id),
        
        supabase
          .from('swim_group_badges')
          .select('badges (*)')
          .eq('swim_group_id', group.id),
        
        supabase
          .from('swimmer_badges')
          .select('*')
          .eq('group_id', group.id)
      ]);

      // Check for errors
      [swimmersResponse, invitationsResponse, badgesResponse, swimmerBadgesResponse].forEach(response => {
        if (response.error) throw response.error;
      });

      // Update state with fetched data


      setSwimmers(swimmersResponse.data as any);
      setInvitations(invitationsResponse.data || []);
      setBadges((badgesResponse.data || []).map(item => item.badges).flat());
      setSwimmerBadges(swimmerBadgesResponse.data || []);

    } catch (err) {
      console.error('Error fetching swim group data:', err);
      setError('Failed to fetch swim group data: ' + (err as Error).message);
      showToast('Data fetch failed: ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  }, [params.swimGroupName, coachId, supabase]);

  useEffect(() => {
    if (coachId) {
      fetchSwimGroupData();
    }
  }, [fetchSwimGroupData, coachId]);

  // Event Handlers
  const handleInviteSwimmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swimGroup) return;

    try {
      // Check for existing invitation
      const { data: existingInvitations, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', swimGroup.id)
        .eq('email', inviteEmail)
        .eq('status', 'pending');

      if (checkError) throw checkError;

      if (existingInvitations?.length > 0) {
        showToast('An invitation is already pending for this email', 'default');
        return;
      }

      // Create new invitation
      const { data, error } = await supabase
        .from('invitations')
        .insert({
          group_id: swimGroup.id,
          email: inviteEmail,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setInvitations([...invitations, data as Invitation]);
      setInviteEmail('');
      showToast('Invitation sent successfully', 'success');
    } catch (err) {
      showToast('Failed to send invitation: ' + (err as Error).message, 'error');
    }
  };

  const handleAwardBadge = async () => {
    if (!selectedBadge || !selectedSwimmer || !swimGroup) {
      showToast('Please select both a badge and a swimmer', 'error');
      return;
    }

    try {
      const selectedBadgeObj = badges.find(badge => badge.id === selectedBadge);
      if (!selectedBadgeObj) {
        throw new Error('Selected badge not found');
      }

      const { data, error } = await supabase
        .from('swimmer_badges')
        .insert({
          swimmer_id: selectedSwimmer,
          badge_id: selectedBadge,
          name: selectedBadgeObj.name,
          group_id: swimGroup.id,
          awarded_by: coachId
        })
        .select()
        .single();

      if (error) throw error;

      setSwimmerBadges([...swimmerBadges, data as SwimmerBadge]);
      showToast('Badge awarded successfully! 🎉', 'success');
      setSelectedBadge('');
      setSelectedSwimmer('');
    } catch (err) {
      showToast('Failed to award badge: ' + (err as Error).message, 'error');
    }
  };

  // Toggle Handlers
  const toggleSwimmerList = () => {
    setIsSwimmerListOpen(!isSwimmerListOpen);
    if (isSwimmerListOpen) {
      setSelectedSwimmerId(null);
    }
  };

  const toggleAttendanceInsights = () => {
    setShowAttendanceInsights(!showAttendanceInsights);
  };

  // Loading and Error States
  if (loading) return <CoachPageLayout><Loader /></CoachPageLayout>;
  if (error) return (
    <CoachPageLayout>
      <div className={styles.error}>
        <span className={styles.errorIcon}>⚠️</span>
        {error}
      </div>
    </CoachPageLayout>
  );
  if (!swimGroup) return (
    <CoachPageLayout>
      <div className={styles.error}>
        <span className={styles.errorIcon}>🔍</span>
        Swim group not found
      </div>
    </CoachPageLayout>
  );
 
  return (
    <CoachPageLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.swimGroupContainer}>
          {/* Header Section */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>
                {swimGroup?.name}
                <span className={styles.groupBadge}>{swimmers.length} Swimmers</span>
              </h1>
              <p className={styles.description}>{swimGroup?.description}</p>
              <div className={styles.groupCodeContainer}>
                <div className={styles.groupCode}>
                  <span className={styles.groupCodeLabel}>Group Code</span>
                  <code className={styles.groupCodeValue}>{swimGroup?.group_code}</code>
                  <button 
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(swimGroup?.group_code || '');
                      showToast('Group code copied!', 'success');
                    }}
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className={styles.mainContent}>
            {/* Swimmers Management */}
            <section className={styles.managementSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>👥</span>
                <div>
                  <h2 className={styles.sectionTitle}>
                    Your Swimmers 
                  </h2>
                  <p className={styles.sectionDescription}>
                    View swimmers details here
                  </p>
                </div>
              </div>
              
              <div className={styles.sectionContent}>
                <div className={styles.swimmersList}>
                  {swimmers.map((swimmer) => (
                    <div
                      key={swimmer.id}
                      onClick={() => setSelectedSwimmerId(
                        swimmer.id === selectedSwimmerId ? null : swimmer.id
                      )}
                      className={`${styles.swimmerItem} ${
                        selectedSwimmerId === swimmer.id ? styles.selectedSwimmer : ''
                      }`}
                    >
                      <div className={styles.swimmerInfo}>
                        <span className={styles.swimmerName}>
                          {swimmer.profiles.last_name}, {swimmer.profiles.first_name}
                        </span>
                      </div>
                      {swimmerBadges.filter(badge => 
                        badge.swimmer_id === swimmer.id
                      ).length > 0 && (
                        <span className={styles.badgeCount}>
                          🏅 {swimmerBadges.filter(badge => 
                            badge.swimmer_id === swimmer.id
                          ).length}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.swimmerDetails}>
                  {selectedSwimmerId ? (
                    <SwimmerDetails swimmerId={selectedSwimmerId} />
                  ) : (
                    <div className={styles.detailsPlaceholder}>
                      <p>Select a swimmer to view details</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Badge and Invitation Management Grid */}
            <div className={styles.managementGrid}>
              {/* Badge Award Section */}
              <section className={styles.managementSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>🏅</span>
                  <div>
                    <h2 className={styles.sectionTitle}>Award Achievement Badge</h2>
                    <p className={styles.sectionDescription}>
                      Recognize swimmer achievements and milestones
                    </p>
                  </div>
                </div>

                <div className={styles.sectionContent}>
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Badge Type
                      <select
                        value={selectedBadge}
                        onChange={(e) => setSelectedBadge(e.target.value)}
                        className={styles.select}
                      >
                        <option value="">Select a badge</option>
                        {badges.map((badge) => (
                          <option key={badge.id} value={badge.id}>
                            {badge.icon} {badge.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>
                      Swimmer
                      <select
                        value={selectedSwimmer}
                        onChange={(e) => setSelectedSwimmer(e.target.value)}
                        className={styles.select}
                      >
                        <option value="">Select a swimmer</option>
                        {swimmers.map((swimmer) => (
                          <option key={swimmer.id} value={swimmer.id}>
                            {swimmer.profiles.first_name} {swimmer.profiles.last_name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <button 
                    onClick={handleAwardBadge} 
                    className={styles.button}
                    disabled={!selectedBadge || !selectedSwimmer}
                  >
                    Award Badge
                  </button>
                </div>
              </section>

              {/* Invitations Section */}
              <section className={styles.managementSection}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✉️</span>
                  <div>
                    <h2 className={styles.sectionTitle}>Manage Invitations</h2>
                    <p className={styles.sectionDescription}>
                      Invite new swimmers to join your group
                    </p>
                  </div>
                </div>

                <div className={styles.sectionContent}>
                  {invitations.length > 0 && (
                    <div className={styles.invitationsList}>
                      {invitations.map((invitation) => (
                        <div key={invitation.id} className={styles.invitationItem}>
                          <span className={styles.invitationEmail}>
                            {invitation.email}
                          </span>
                          <span className={`${styles.invitationStatus} ${styles[invitation.status]}`}>
                            {invitation.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleInviteSwimmer} className={styles.inviteForm}>
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Swimmer's Email
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Enter email address"
                          className={styles.input}
                          required
                        />
                      </label>
                    </div>
                    <button type="submit" className={styles.button}>
                      Send Invitation
                    </button>
                  </form>
                </div>
              </section>
            </div>

            {/* Attendance Section */}
            <section className={styles.managementSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>📊</span>
                <div>
                  <h2 className={styles.sectionTitle}>Attendance Insights</h2>
                  <p className={styles.sectionDescription}>
                    Track and analyze attendance patterns
                  </p>
                </div>
              </div>
              
              <div className={styles.sectionContent}>
                <AttendanceInsights groupId={swimGroup?.id} />
              </div>
            </section>
          </main>
        </div>
        <BadgeManagementPage />
      </div>
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default SwimGroupPage;