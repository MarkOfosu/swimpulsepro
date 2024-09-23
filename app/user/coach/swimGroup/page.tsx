'use client';

import { useState, useEffect } from 'react';
import CoachPageLayout from '../page';
import CreateSwimGroup from './createSwimGroup/page';
import Card2 from '@components/ui/Card2';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@components/ui/toasts/Toast';
import Loader from '@components/ui/Loader';
import styles from '../../../styles/SwimGroups.module.css';

const SwimGroupsPage: React.FC = () => {
  const [swimGroups, setSwimGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const fetchSwimGroups = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('swim_groups')
          .select('id, name, description, coach_id');
   
        if (error) {
          console.error('Error fetching swim groups:', error);
          setErrorMessage('Failed to fetch swim groups. Please try again.');
          showToast('Failed to fetch swim groups', 'error');
        } else {
          setSwimGroups(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred.');
        showToast('Unexpected error occurred', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSwimGroups();
  }, []);

  if (loading) {
    return (
      <CoachPageLayout>
        <div className={styles.pageContainer}>
          <h1 className={styles.pageHeading}>Swim Groups</h1>
          <Loader />
        </div>
      </CoachPageLayout>
    );
  }

  if (errorMessage) {
    return (
      <CoachPageLayout>
        <div className={styles.pageContainer}>
          <h1 className={styles.pageHeading}>Swim Groups</h1>
          <p className={styles.errorMessage}>{errorMessage}</p>
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
                size="small"
                color="dark"
                title={group.name}
                description={group.description}
                key={group.id}
                glow={true}
               
              >
                <button
                  onClick={() => router.push(`/coach/swimGroup/${group.id}/addSwimmer`)}
                  className={styles.addSwimmerButton}
                >
                  Add Swimmer
                </button>
              </Card2>
            ))
          ) : (
            <p className={styles.noGroupsMessage}>No swim groups available.</p>
          )}
        </div>
        <div className={styles.createGroupSection}>
          <CreateSwimGroup />
        </div>
      </div>
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default SwimGroupsPage;