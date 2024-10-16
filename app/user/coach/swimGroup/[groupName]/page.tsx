// SwimGroupPage.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../../CoachPageLayout';
import Loader from '@components/ui/Loader';
import { useToast } from '@components/ui/toasts/Toast';
import styles from '../../../../styles/SwimGroup.module.css';
import BadgeManagementPage from './badgeSection/BadgeManagement';
import AttendanceInsights from '../../attendance/AttendanceInsights';

interface SwimGroup {
  id: string;
  name: string;
  description: string;
  group_code: string;
  coach_id: string;
  created_at: string;
  updated_at: string;
}

interface Swimmer {
  id: string;
  name: string;
  group_id: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
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
  const [swimGroup, setSwimGroup] = useState<SwimGroup | null>(null);
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
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

  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  const fetchSwimGroupData = useCallback(async () => {
    if (!params.groupName || !coachId) {
      console.error('No groupName in params or coachId not set');
      setError('Unable to fetch swim group data. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const groupName = decodeURIComponent(params.groupName as string);

      // Fetch the swim group, ensuring it belongs to the authenticated coach
      const { data: group, error: groupError } = await supabase
        .from('swim_groups')
        .select('*')
        .eq('name', groupName)
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

      // Fetch swimmers for this group
      // const { data: swimmersData, error: swimmersError } = await supabase
      //   .from('swimmers')
      //   .select('*')
      //   .eq('group_id', group.id);

      // if (swimmersError) throw swimmersError;
      // setSwimmers(swimmersData);
      
      const { data: fetchedData, error: swimmersError } = await supabase
      .from('swimmers')
      .select(`
        id,
        group_id,
        date_of_birth,
        created_at,
        updated_at,
        profiles (
          first_name,
          last_name
        )
      `)
      .eq('group_id', group.id);
    
    if (swimmersError) throw swimmersError;
    
    // Process the fetched data to match the Swimmer type
    const swimmersData: Swimmer[] = fetchedData.map(item => ({
      id: item.id,
      name: `${(item.profiles as unknown as { first_name: string; last_name: string }).first_name} ${(item.profiles as unknown as { first_name: string; last_name: string }).last_name}`,
      group_id: item.group_id,
      date_of_birth: item.date_of_birth,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    setSwimmers(swimmersData);



    
      // Fetch invitations for this group
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', group.id);

      if (invitationsError) throw invitationsError;
      setInvitations(invitationsData || []);

      // Fetch badges for this group
      const { data: badgesData, error: badgesError } = await supabase
        .from('swim_group_badges')
        .select('badges (*)')
        .eq('swim_group_id', group.id);

      if (badgesError) throw badgesError;
      setBadges(badgesData.map(item => item.badges).flat());

      // Fetch awarded badges for this group
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
  }, [params.groupName, coachId]);


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
  }, []);

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
      // Find the selected badge object
      const selectedBadgeObj = badges.find(badge => badge.id === selectedBadge);
      if (!selectedBadgeObj) {
        throw new Error('Selected badge not found');
      }

      const { data, error } = await supabase
        .from('swimmer_badges')
        .insert({
          swimmer_id: selectedSwimmer,
          badge_id: selectedBadge,
          name: selectedBadgeObj.name, // Include the badge name
          group_id: swimGroup.id,
          awarded_by: coachId
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting swimmer badge:', error);
        throw error;
      }

      console.log('Badge awarded successfully:', data);

      setSwimmerBadges([...swimmerBadges, data as SwimmerBadge]);
      showToast('Badge awarded successfully', 'success');
      setSelectedBadge('');
      setSelectedSwimmer('');
    } catch (err) {
      console.error('Error awarding badge:', err);
      showToast(`Failed to award badge: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
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
        {/* Add a new section for Attendance Insights */}
        <div className={styles.attendanceInsightsSection}>
          <h2 className={styles.sectionTitle}>Attendance Insights</h2>
          <button 
            onClick={() => setShowAttendanceInsights(!showAttendanceInsights)}
            className={styles.toggleInsightsButton}
          >
            {showAttendanceInsights ? 'Hide Insights' : 'Show Insights'}
          </button>
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
              <option key={swimmer.id} value={swimmer.id}>{swimmer.name}</option>
            ))}
          </select>
          <button onClick={handleAwardBadge} className={styles.awardButton}>Award Badge</button>
        </div>

        <div className={styles.swimmersSection}>
          <h2 className={styles.sectionTitle}>Swimmers</h2>
          {swimmers.length > 0 ? (
            <ul className={styles.swimmersList}>
              {swimmers.map((swimmer) => (
                <li key={swimmer.id} className={styles.swimmerItem}>
                  <span className={styles.swimmerName}>{swimmer.name}</span>
                  <span className={styles.swimmerDob}>Born: {new Date(swimmer.date_of_birth).toLocaleDateString()}</span>
                  <div className={styles.swimmerBadges}>
                    {swimmerBadges
                      .filter(sb => sb.swimmer_id === swimmer.id)
                      .map(sb => {
                        const badge = badges.find(b => b.id === sb.badge_id);
                        return badge ? (
                          <span key={sb.id} className={styles.badge} title={badge.name}>
                            {badge.icon}
                          </span>
                        ) : null;
                      })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noSwimmersMessage}>No swimmers in this group yet.</p>
          )}
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

export default SwimGroupPage;