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

const SwimGroupPage: React.FC = () => {
  const [swimGroup, setSwimGroup] = useState<SwimGroup | null>(null);
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  const fetchSwimGroupData = useCallback(async () => {
    if (!params.groupName) return;

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
      setSwimGroup(groupResult.data);

      if (groupResult.data) {
        const swimmersResult = await supabase
          .from('swimmers')
          .select('*')
          .eq('group_id', groupResult.data.id);

        if (swimmersResult.error) throw swimmersResult.error;
        setSwimmers(swimmersResult.data || []);
      }
    } catch (err) {
      console.error('Error fetching swim group data:', err);
      setError('Failed to fetch swim group data. Please try again.');
      showToast('Failed to fetch swim group data', 'error');
    } finally {
      setLoading(false);
    }
  }, [params.groupName]);

  useEffect(() => {
    fetchSwimGroupData();
  }, [fetchSwimGroupData]);

  const handleAddSwimmer = useCallback(() => {
    if (swimGroup) {
      router.push(`/user/coach/swimGroup/${encodeURIComponent(swimGroup.name)}/addSwimmer`);
    }
  }, [router, swimGroup]);

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
            <div className={styles.noSwimmersMessage}>
              <p>There are no swimmers in this group yet.</p>
              <p>Click the button below to add your first swimmer!</p>
            </div>
          )}
        </div>
        
        <button onClick={handleAddSwimmer} className={styles.addSwimmerButton}>
          {swimmers.length > 0 ? 'Add Another Swimmer' : 'Add Your First Swimmer'}
        </button>
      </div>
      <ToastContainer />
    </CoachPageLayout>
  );
};

export default SwimGroupPage;
