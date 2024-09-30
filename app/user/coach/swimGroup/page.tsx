
'use client';

import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import CoachPageLayout from '../page';
import CreateSwimGroup from './createSwimGroup/page';
import Card2 from '@components/ui/Card2';
import { useRouter } from 'next/navigation';
import { useToast } from '@components/ui/Toast';
import Loader from '@components/ui/Loader';
import styles from '../../../styles/SwimGroups.module.css';

const GET_SWIM_GROUPS = gql`
  query GetSwimGroups {
    swimGroupsCollection {
      edges {
        node {
          id
          name
          description
          coachId
        }
      }
    }
  }
`;

const SwimGroupsPage: React.FC = () => {
  const [swimGroups, setSwimGroups] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const { loading, error, data } = useQuery(GET_SWIM_GROUPS);
  console.log("Apollo Query Result:", { loading, error, data });

  useEffect(() => {
    if (data) {
      console.log("Received data:", data);
      if (data.swimGroupsCollection && data.swimGroupsCollection.edges) {
        setSwimGroups(data.swimGroupsCollection.edges.map((edge: { node: any }) => edge.node));
      } else {
        console.error("Unexpected data structure:", data);
        setErrorMessage('Received unexpected data structure.');
        showToast('Error in data structure', 'error');
      }
    }
    if (error) {
      console.error('Error fetching swim groups:', error);
      setErrorMessage(`Failed to fetch swim groups. Error: ${error.message}`);
      showToast(`Failed to fetch swim groups: ${error.message}`, 'error');
    }
  }, [data, error, showToast]);

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