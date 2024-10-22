'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CoachPageLayout from '../CoachPageLayout';
import CreateSwimGroup from './createSwimGroup/page';
import Card2 from '@components/elements/Card2';
import InviteSwimmerModal from '../swimGroup/[groupName]/inviteSwimmer/InviteSwimmerModal'
import { useToast } from '@components/elements/toasts/Toast';
import Loader from '@components/elements/Loader';
import styles from '../../../styles/SwimGroups.module.css';
import SwimGroupsLoading from './loading';


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

  const fetchSwimGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('swim_groups')
        .select('id, name, description, coach_id, group_code');

      if (error) throw error;

      setSwimGroups(data || []);
    } catch (err) {
      console.error('Error fetching swim groups:', err);
      setError('Failed to fetch swim groups. Please try again.');
      showToast('Failed to fetch swim groups', 'error');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchSwimGroups();
  }, [fetchSwimGroups]);

  const handleGroupClick = useCallback((groupName: string) => {
    router.push(`/user/coach/swimGroup/${encodeURIComponent(groupName)}`);
  }, [router]);

  const handleInviteClick = useCallback((e: React.MouseEvent, group: SwimGroup) => {
    e.stopPropagation();
    setSelectedGroup(group);
    setInviteModalOpen(true);
  }, []);

  if (loading) {
    return (
        <div className={styles.pageContainer}>
          <h1 className={styles.pageHeading}>Swim Groups</h1>
          <SwimGroupsLoading />
        </div>

    );
  }

  if (error) {
    return (
      <CoachPageLayout>
        <div className={styles.pageContainer}>
          <h1 className={styles.pageHeading}>Swim Groups</h1>
          <p className={styles.errorMessage}>{error}</p>
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
                <p>{group.description}</p>
                <p>Group Code: {group.group_code}</p>
                <button
                  onClick={(e) => handleInviteClick(e, group)}
                  className={styles.inviteButton}
                >
                  Invite Swimmer
                </button>
              </Card2>
            ))
          ) : (
            <p className={styles.noGroupsMessage}>No swim groups available.</p>
          )}
        </div>
        <div className={styles.createGroupSection}>
          <CreateSwimGroup onGroupCreated={fetchSwimGroups} />
        </div>
      </div>
      {inviteModalOpen && selectedGroup && (
        <InviteSwimmerModal
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          onClose={() => setInviteModalOpen(false)}
          onInviteSuccess={() => {}} 
        />
      )}
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default SwimGroupsPage;