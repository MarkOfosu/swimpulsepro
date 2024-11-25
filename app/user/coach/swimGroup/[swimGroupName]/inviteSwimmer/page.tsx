'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CoachPageLayout from '../../../CoachPageLayout';
import { useToast } from '@components/elements/toasts/Toast';
import { useInviteSwimmer } from '@/app/hooks/useInviteSwimmer';
import { useSwimGroups } from '@/app/hooks/useSwimGroups';
import styles from '../../../../../styles/InviteSwimmer.module.css';
import Loader from '@/components/elements/Loader';

const InviteSwimmerPage: React.FC = () => {
  // State
  const [email, setEmail] = useState('');
  
  // Hooks
  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const swimGroupName = decodeURIComponent(params.swimGroupName as string);
  
  // Custom hooks
  const { 
    groups, 
    isLoading: groupsLoading, 
    error: groupsError,
    getGroupByName 
  } = useSwimGroups();

  const group = getGroupByName(swimGroupName);
  
  const { 
    sendInvitation, 
    isLoading: inviteLoading, 
    error: inviteError 
  } = useInviteSwimmer({
    groupId: group?.id || '',
    onSuccess: () => {
      showToast('Invitation sent successfully', 'success');
      router.push(`/user/coach/swimGroup/${encodeURIComponent(swimGroupName)}`);
    },
    onError: (error) => {
      showToast(error, 'error');
    },
  });

  // Effects
  useEffect(() => {
    if (groupsError) {
      showToast(groupsError, 'error');
      router.push('/user/coach/swimGroup');
    }
  }, [groupsError, showToast, router]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!group) {
      showToast('Invalid group', 'error');
      return;
    }

    try {
      await sendInvitation(email);
      setEmail(''); // Reset form on success
    } catch (error) {
      // Error is handled by the hook
      console.error('Error in invitation flow:', error);
    }
  };

  // Loading states
  if (groupsLoading) {
    return (
      <CoachPageLayout>
        <Loader />
      </CoachPageLayout>
    );
  }

  // Error state
  if (groupsError || !group) {
    return (
      <CoachPageLayout>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            {groupsError || 'Group not found'}
          </p>
          <button 
            onClick={() => router.push('/user/coach/swimGroup')}
            className={styles.backButton}
          >
            Back to Groups
          </button>
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
            className={styles.backLink}
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
              disabled={inviteLoading}
              autoComplete="email"
            />
          </div>

          {inviteError && (
            <div className={styles.errorMessage}>
              {inviteError}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={inviteLoading || !email.trim()}
          >
            {inviteLoading ? (
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