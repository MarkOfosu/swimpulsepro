// app/user/coach/swimGroup/[swimGroupName]/inviteSwimmer/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../../../CoachPageLayout';
import { useToast } from '@components/elements/toasts/Toast';
import { useInviteSwimmer } from '@/app/hooks/useInviteSwimmer';
import  Loader from '@components/elements/Loader';
import styles from '../../../../../styles/InviteSwimmer.module.css';

interface SwimGroup {
  id: string;
  name: string;
}

const InviteSwimmerPage: React.FC = () => {
  // State
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState<SwimGroup | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Hooks
  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();
  
  // Get group name from URL
  const swimGroupName = decodeURIComponent(params.swimGroupName as string);

  // Initialize invite hook
  const { 
    sendInvitation, 
    isLoading: isSending, 
    error: inviteError 
  } = useInviteSwimmer({
    groupId: group?.id || '',
    onSuccess: () => {
      showToast('Invitation sent successfully', 'success');
      router.push(`/user/coach/swimGroup/${encodeURIComponent(group?.name || '')}`);
    },
    onError: (error) => {
      showToast(error, 'error');
    },
  });

  // Fetch group details
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setFetchError(null);

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/auth/login');
          return;
        }

        // Fetch group details
        const { data, error } = await supabase
          .from('swim_groups')
          .select('id, name')
          .eq('name', swimGroupName)
          .eq('coach_id', user.id)
          .single();

        if (error) throw error;
        setGroup(data);
      } catch (error) {
        console.error('Error fetching group:', error);
        setFetchError('Failed to fetch group details');
        showToast('Failed to fetch group details', 'error');
        router.push('/user/coach/swimGroup');
      }
    };

    if (swimGroupName) {
      fetchGroup();
    }
  }, [swimGroupName, supabase, showToast, router]);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!group) {
      showToast('Invalid group', 'error');
      return;
    }

    if (!email.trim()) {
      showToast('Please enter an email address', 'error');
      return;
    }

    try {
      await sendInvitation(email);
    } catch (error) {
      // Error is handled by the hook
      console.error('Error in invitation flow:', error);
    }
  };

  // Loading state
  if (!group) {
    return (
      <CoachPageLayout>
        <div className={styles.loadingContainer}>
          <Loader />
          <p>Loading group details...</p>
        </div>
      </CoachPageLayout>
    );
  }

  return (
    <CoachPageLayout>
      <div className={styles.inviteSwimmerContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Invite Swimmer to {group.name}</h1>
          <button
            onClick={() => router.push(`/user/coach/swimGroup/${encodeURIComponent(group.name)}`)}
            className={styles.backButton}
          >
            ← Back to Group
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.inviteSwimmerForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter swimmer's email"
              className={styles.input}
              required
              disabled={isSending}
              autoComplete="email"
            />
          </div>

          {inviteError && (
            <div className={styles.errorMessage}>
              {inviteError}
            </div>
          )}

          {fetchError && (
            <div className={styles.errorMessage}>
              {fetchError}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSending || !email.trim()}
          >
            {isSending ? (
              <span className={styles.loadingText}>
                <Loader />
                Sending Invitation...
              </span>
            ) : (
              'Send Invitation'
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default InviteSwimmerPage;