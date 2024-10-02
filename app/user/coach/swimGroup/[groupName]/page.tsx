'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../../page';
import Loader from '@components/ui/Loader';
import { useToast } from '@components/ui/toasts/Toast';
import styles from '../../../../styles/SwimGroup.module.css'

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

const SwimGroupPage: React.FC = () => {
  const [swimGroup, setSwimGroup] = useState<SwimGroup | null>(null);
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  const fetchSwimGroupData = useCallback(async () => {
    if (!params.groupName) {
      console.error('No groupName in params');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const groupName = decodeURIComponent(params.groupName as string);

      const groupResult = await supabase
        .from('swim_groups')
        .select('*')
        .eq('name', groupName)
        .single();

      if (groupResult.error) throw groupResult.error;

      const group = groupResult.data as SwimGroup;

      const swimmersResult = await supabase
        .from('swimmers')
        .select('*')
        .eq('group_id', group.id);

      if (swimmersResult.error) throw swimmersResult.error;

      const invitationsResult = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', group.id);

      if (invitationsResult.error && invitationsResult.error.code !== '42P01') {
        throw invitationsResult.error;
      }

      setSwimGroup(group);
      setSwimmers(swimmersResult.data as Swimmer[]);
      setInvitations(invitationsResult.data as Invitation[] || []);

    } catch (err) {
      console.error('Error in fetchSwimGroupData:', err);
      setError('Failed to fetch swim group data. Please try again.');
      showToast('Failed to fetch swim group data', 'error');
    } finally {
      setLoading(false);
    }
  }, [params.groupName]);

  useEffect(() => {
    fetchSwimGroupData();
  }, [fetchSwimGroupData]);

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
        
        <div className={styles.swimmersSection}>
          <h2 className={styles.sectionTitle}>Swimmers</h2>
          {swimmers.length > 0 ? (
            <ul className={styles.swimmersList}>
              {swimmers.map((swimmer) => (
                <li key={swimmer.id} className={styles.swimmerItem}>
                  <span className={styles.swimmerId}>ID: {swimmer.id.slice(0, 8)}...</span>
                  <span className={styles.swimmerDob}>Born: {new Date(swimmer.date_of_birth).toLocaleDateString()}</span>
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
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default SwimGroupPage;