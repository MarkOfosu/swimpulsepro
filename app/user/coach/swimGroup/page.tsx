'use client';

import { useState, useEffect } from 'react';
import CoachPageLayout from '../page';
import CreateSwimGroup from './createSwimGroup/page';
import Card from '@components/ui/Card';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Assuming you have a Supabase client setup
import { useToast } from '@components/ui/toasts/Toast'; // Assuming you're using a toast notification system

const SwimGroupsPage: React.FC = () => {
  const [swimGroups, setSwimGroups] = useState<any[]>([]); // State for swim groups
  const [loading, setLoading] = useState(true); // Loading state for swim groups
  const [errorMessage, setErrorMessage] = useState(''); // Error state for any issues
  const router = useRouter();
  const { showToast, ToastContainer } = useToast(); // Toast notifications

  // Supabase client
  const supabase = createClient();

  // Fetch swim groups from Supabase
  useEffect(() => {
    const fetchSwimGroups = async () => {
      try {
        setLoading(true); // Set loading to true while fetching
        const { data, error } = await supabase
          .from('swim_groups')
          .select('id, name, description, coach_id, created_at, updated_at'); // Fetch the necessary fields

        if (error) {
          console.error('Error fetching swim groups:', error);
          setErrorMessage('Failed to fetch swim groups. Please try again.');
          showToast('Failed to fetch swim groups', 'error');
        } else {
          setSwimGroups(data);
          showToast('Swim groups fetched successfully', 'success');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred.');
        showToast('Unexpected error occurred', 'error');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchSwimGroups();
  }, []);

  // Display loading state
  if (loading) {
    return (
      <CoachPageLayout>
        <div className="page-heading">
          <h1>Swim Groups</h1>
        </div>
        <p>Loading swim groups...</p>
      </CoachPageLayout>
    );
  }

  // Display error message if any
  if (errorMessage) {
    return (
      <CoachPageLayout>
        <div className="page-heading">
          <h1>Swim Groups</h1>
        </div>
        <p style={{ color: 'red' }}>{errorMessage}</p>
      </CoachPageLayout>
    );
  }

  return (
    <CoachPageLayout>
      <div className="page-heading">
        <h1>Swim Groups</h1>
      </div>
      <div className="flex-container">
        {swimGroups.length > 0 ? (
          swimGroups.map((group) => (
            <Card
              size="small"
              color="dark"
              title={group.name}
              description={group.description}
              key={group.id} // Use group ID as key
              glow={true}
            >
              <button
                onClick={() => router.push(`/coach/swimGroup/${group.id}/addSwimmer`)}
                className="button"
              >
                Add Swimmer
              </button>
            </Card>
          ))
        ) : (
          <p>No swim groups available.</p>
        )}
      </div>
      <CreateSwimGroup />
      <ToastContainer /> {/* Toast container for notifications */}
    </CoachPageLayout>
  );
};

export default SwimGroupsPage;
