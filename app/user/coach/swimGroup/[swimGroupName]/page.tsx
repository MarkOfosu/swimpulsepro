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

const CoachDashboard: React.FC = () => {
  const [swimGroup, setSwimGroup] = useState<SwimGroup | null>(null);
  const [swimmers, setSwimmers] = useState<SwimmerWithDetails[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [swimmerBadges, setSwimmerBadges] = useState<SwimmerBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [coachId, setCoachId] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [selectedSwimmer, setSelectedSwimmer] = useState<string>('');
  const [showAttendanceInsights, setShowAttendanceInsights] = useState(false);
  const [selectedSwimmerId, setSelectedSwimmerId] = useState<string | null>(null);
  const [isSwimmerListOpen, setIsSwimmerListOpen] = useState(true);

  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  const fetchSwimGroupData = useCallback(async () => {
    if (!params.swimGroupName || !coachId) {
      console.error('No groupName in params or coachId not set');
      setError('Unable to fetch swim group data. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const swimGroupName = decodeURIComponent(params.swimGroupName as string);

      // Fetch the swim group
      const { data: group, error: groupError } = await supabase
        .from('swim_groups')
        .select('*')
        .eq('name', swimGroupName)
        .eq('coach_id', coachId)
        .single();

      if (groupError) {
        if (groupError.code === 'PGRST116') {
          setError('Swim group not found or you do not have permission to view it.');
          showToast('Swim group not found or access denied', 'error');
          return;
        }
        throw groupError;
      }

      setSwimGroup(group);

      // Fetch swimmers
      const { data: swimmersData, error: swimmersError } = await supabase
        .from('swimmers')
        .select(`
          id,
          group_id,
          date_of_birth,
          created_at,
          updated_at,
          profiles (
            first_name,
            last_name,
            gender
          )
        `)
        .eq('group_id', group.id);

      if (swimmersError) throw swimmersError;
      setSwimmers(swimmersData as unknown as SwimmerWithDetails[]);

      // Fetch invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', group.id);

      if (invitationsError) throw invitationsError;
      setInvitations(invitationsData || []);

      // Fetch badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('swim_group_badges')
        .select('badges (*)')
        .eq('swim_group_id', group.id);

      if (badgesError) throw badgesError;
      setBadges(badgesData.map(item => item.badges).flat());

      // Fetch awarded badges
      const { data: swimmerBadgesData, error: swimmerBadgesError } = await supabase
        .from('swimmer_badges')
        .select('*')
        .eq('group_id', group.id);

      if (swimmerBadgesError) throw swimmerBadgesError;
      setSwimmerBadges(swimmerBadgesData);

    } catch (err) {
      console.error('Error fetching swim group data:', err);
      setError('Failed to fetch swim group data. Please try again.');
      showToast('Failed to fetch swim group data', 'error');
    } finally {
      setLoading(false);
    }
  }, [params.groupName, coachId, supabase]);

  useEffect(() => {
    const fetchCoachId = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('Failed to authenticate user.');
        }

        const { data: coachData, error: coachError } = await supabase
          .from('coaches')
          .select('id')
          .eq('id', user.id)
          .single();

        if (coachError) {
          throw new Error('Failed to verify coach status.');
        }

        setCoachId(coachData.id);
      } catch (err) {
        console.error('Error in fetchCoachId:', err);
        setError((err as Error).message);
        showToast((err as Error).message, 'error');
      }
    };

    fetchCoachId();
  }, [supabase, showToast]);

  useEffect(() => {
    if (coachId) {
      fetchSwimGroupData();
    }
  }, [fetchSwimGroupData, coachId]);

  const handleInviteSwimmer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swimGroup) return;

    try {
      const { data: existingInvitations, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', swimGroup.id)
        .eq('email', inviteEmail)
        .eq('status', 'pending');

      if (checkError) throw checkError;

      if (existingInvitations && existingInvitations.length > 0) {
        showToast('An invitation for this email is already pending', 'default');
        return;
      }

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
      console.error('Error inviting swimmer:', err);
      showToast('Failed to invite swimmer', 'error');
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

      if (error) {
        console.error('Error inserting swimmer badge:', error);
        throw error;
      }

      setSwimmerBadges([...swimmerBadges, data as SwimmerBadge]);
      showToast('Badge awarded successfully', 'success');
      setSelectedBadge('');
      setSelectedSwimmer('');
    } catch (err) {
      console.error('Error awarding badge:', err);
      showToast(`Failed to award badge: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  const toggleSwimmerList = () => {
    setIsSwimmerListOpen(!isSwimmerListOpen);
    if (isSwimmerListOpen) {
      setSelectedSwimmerId(null);
    }
  };

  const toggleAttendanceInsights = () => {
    setShowAttendanceInsights(!showAttendanceInsights);
  };

  if (loading) return <CoachPageLayout><Loader /></CoachPageLayout>;
  if (error) return <CoachPageLayout><div className={styles.error}>{error}</div></CoachPageLayout>;
  if (!swimGroup) return <CoachPageLayout><div className={styles.error}>Swim group not found</div></CoachPageLayout>;

  return (
    <CoachPageLayout>
      <div className={styles.swimGroupContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>{swimGroup.name}</h1>
          <p className={styles.description}>{swimGroup.description}</p>
          <p className={styles.groupCode}>Group Code: <span>{swimGroup.group_code}</span></p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle} onClick={toggleSwimmerList}>
            Swimmers {isSwimmerListOpen ? '▼' : '▶'}
          </h2>
          {isSwimmerListOpen && (
            <div className={styles.content}>
              <div className={styles.swimmersList}>
                <ul>
                  {swimmers.map((swimmer) => (
                    <li
                      key={swimmer.id}
                      onClick={() => setSelectedSwimmerId(swimmer.id === selectedSwimmerId ? null : swimmer.id)}
                      className={selectedSwimmerId === swimmer.id ? styles.selectedSwimmer : ''}
                    >
                      {swimmer.profiles.last_name}, {swimmer.profiles.first_name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.swimmerDetails}>
                {selectedSwimmerId ? (
                  <SwimmerDetails swimmerId={selectedSwimmerId} />
                ) : (
                  <p>Select a swimmer to view details</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle} onClick={toggleAttendanceInsights}>
            Attendance Insights {showAttendanceInsights ? '▼' : '▶'}
          </h2>
          {showAttendanceInsights && <AttendanceInsights groupId={swimGroup.id} />}
        </div>

        <div className={styles.badgeAwardingSection}>
          <h2 className={styles.sectionTitle}>Award Badge</h2>
          <select
            value={selectedBadge}
            onChange={(e) => setSelectedBadge(e.target.value)}
            className={styles.select}
          >
            <option value="">Select a badge</option>
            {badges.map((badge) => (
              <option key={badge.id} value={badge.id}>{badge.name}</option>
            ))}
          </select>
          <select
            value={selectedSwimmer}
            onChange={(e) => setSelectedSwimmer(e.target.value)}
            className={styles.select}
          >
            <option value="">Select a swimmer</option>
            {swimmers.map((swimmer) => (
              <option key={swimmer.id} value={swimmer.id}>{swimmer.profiles.first_name} {swimmer.profiles.last_name}</option>
            ))}
          </select>
          <button onClick={handleAwardBadge} className={styles.awardButton}>Award Badge</button>
        </div>

        <div className={styles.invitationsSection}>
          <h2 className={styles.sectionTitle}>Invitations</h2>
          {invitations.length > 0 ? (
            <ul className={styles.invitationsList}>
              {invitations.map((invitation) => (
                <li key={invitation.id} className={styles.invitationItem}>
                  <span className={styles.invitationEmail}>{invitation.email}</span>
                  <span className={styles.invitationStatus}>{invitation.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noInvitationsMessage}>No pending invitations.</p>
          )}
        </div>

        <form onSubmit={handleInviteSwimmer} className={styles.inviteForm}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter swimmer's email"
            required
            className={styles.inviteInput}
          />
          <button type="submit" className={styles.inviteButton}>
            Invite Swimmer
          </button>
        </form>
      </div>
      <BadgeManagementPage />
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default CoachDashboard;