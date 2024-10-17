'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../../../CoachPageLayout';
import { useToast } from '@components/elements/toasts/Toast';
import styles from '../../../../../styles/InviteSwimmer.module.css';

const InviteSwimmerPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();
  const params = useParams();
  const groupName = params.groupName as string;
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data, error } = await supabase
          .from('swim_groups')
          .select('id, name')
          .eq('name', decodeURIComponent(groupName))
          .single();

        if (error) throw error;
        setGroup(data);
      } catch (error) {
        console.error('Error fetching group:', error);
        showToast('Failed to fetch group details', 'error');
        router.push('/user/coach/swimGroup');
      }
    };

    fetchGroup();
  }, [groupName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) {
      showToast('Invalid group', 'error');
      return;
    }
    try {
      const { data: existingInvitations, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', group.id)
        .eq('email', email)
        .eq('status', 'pending');

      if (checkError) throw checkError;

      if (existingInvitations && existingInvitations.length > 0) {
        showToast('An invitation for this email is already pending', 'error');
        return;
      }

      const { data, error } = await supabase
        .from('invitations')
        .insert({
          group_id: group.id,
          email: email,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      showToast('Invitation sent successfully', 'success');
      router.push(`/user/coach/swimGroup/${encodeURIComponent(group.name)}`);
    } catch (error) {
      console.error('Error inviting swimmer:', error);
      showToast('Failed to invite swimmer', 'error');
    }
  };

  if (!group) {
    return <CoachPageLayout><div>Loading...</div></CoachPageLayout>;
  }

  return (
    <CoachPageLayout>
      <div className={styles.inviteSwimmerContainer}>
        <h1>Invite Swimmer to {group.name}</h1>
        <form onSubmit={handleSubmit} className={styles.inviteSwimmerForm}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Swimmer's Email"
            required
          />
          <button type="submit">Send Invitation</button>
        </form>
      </div>
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default InviteSwimmerPage;