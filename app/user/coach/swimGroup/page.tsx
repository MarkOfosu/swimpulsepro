'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../CoachPageLayout';
import CreateSwimGroup from './createSwimGroup/page';
import Card2 from '@components/elements/Card2';
import InviteSwimmerModal from '../swimGroup/[groupName]/inviteSwimmer/InviteSwimmerModal';
import { useToast } from '@components/elements/toasts/Toast';
import SwimGroupsLoading from './loading';
import styles from '../../../styles/SwimGroups.module.css';
import { useUser } from '../../../context/UserContext'

interface SwimGroup {
  id: string;
  name: string;
  description: string;
  coach_id: string;
  group_code: string;
}

const SwimGroupsPage: React.FC = () => {
  const [swimGroups, setSwimGroups] = useState<SwimGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<SwimGroup | null>(null);
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();
  const { user } = useUser();

  const fetchSwimGroups = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Basic query without RLS
      const { data, error: queryError } = await supabase
        .from('swim_groups')
        .select('id, name, description, coach_id, group_code')
        .filter('coach_id', 'eq', user.id)
        .order('name', { ascending: true });

      if (queryError) {
        console.error('Database query error:', queryError);
        throw new Error('Failed to fetch swim groups');
      }

      if (!data) {
        throw new Error('No data returned from the database');
      }

      // Validate and transform the data
      const validatedGroups = data.map(group => ({
        id: group.id,
        name: group.name || 'Unnamed Group',
        description: group.description || 'No description available',
        coach_id: group.coach_id,
        group_code: group.group_code || 'No code available'
      }));

      setSwimGroups(validatedGroups);

    } catch (err) {
      console.error('Error in fetchSwimGroups:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch swim groups');
      showToast('Failed to fetch swim groups. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    fetchSwimGroups();
  }, [fetchSwimGroups]);

  const handleGroupClick = useCallback((groupName: string) => {
    if (!groupName) {
      showToast('Invalid group selected', 'error');
      return;
    }
    router.push(`/user/coach/swimGroup/${encodeURIComponent(groupName)}`);
  }, [router, showToast]);

  const handleInviteClick = useCallback((e: React.MouseEvent, group: SwimGroup) => {
    e.stopPropagation();
    if (!group.id) {
      showToast('Invalid group selected for invitation', 'error');
      return;
    }
    setSelectedGroup(group);
    setInviteModalOpen(true);
  }, [showToast]);

  const handleCreateSuccess = useCallback(async () => {
    showToast('Group created successfully!', 'success');
    await fetchSwimGroups();
  }, [fetchSwimGroups]);

  if (loading) {
    return (
        <SwimGroupsLoading />
    )
  }

  if (error) {
    return (
      <CoachPageLayout>
        <div className={styles.pageContainer}>
          <h1 className={styles.pageHeading}>Swim Groups</h1>
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => fetchSwimGroups()} 
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
      <div className={styles.pageContainer}>
        <h1 className={styles.pageHeading}>Swim Groups</h1>
        <div className={styles.swimGroupsGrid}>
          {swimGroups.length > 0 ? (
            swimGroups.map((group) => (
              <Card2
                key={group.id}
                title={group.name}
                description={group.description}
                size="small"
                color="dark"
                glow={true}
                onClick={() => handleGroupClick(group.name)}
              >
                <div className={styles.groupContent}>
                  <p className={styles.groupDescription}>{group.description}</p>
                  <p className={styles.groupCode}>Group Code: {group.group_code}</p>
                  <button
                    onClick={(e) => handleInviteClick(e, group)}
                    className={styles.inviteButton}
                  >
                    Invite Swimmer
                  </button>
                </div>
              </Card2>
            ))
          ) : (
            <div className={styles.noGroupsContainer}>
              <p className={styles.noGroupsMessage}>No swim groups available.</p>
              <p className={styles.noGroupsSubtext}>Create your first group to get started!</p>
            </div>
          )}
        </div>
        
        <div className={styles.createGroupSection}>
          <CreateSwimGroup onGroupCreated={handleCreateSuccess} />
        </div>
      </div>

      {inviteModalOpen && selectedGroup && (
        <InviteSwimmerModal
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          onClose={() => {
            setInviteModalOpen(false);
            setSelectedGroup(null);
          }}
          onInviteSuccess={() => {
            showToast('Invitation sent successfully!', 'success');
            setInviteModalOpen(false);
            setSelectedGroup(null);
          }}
        />
      )}
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default SwimGroupsPage;