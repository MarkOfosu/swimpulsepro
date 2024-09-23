'use client';

// app/team/team-overview/page.tsx
import React from 'react';
import TeamLayout from '../page';
import Card2 from '@components/ui/Card2';

import { useToast } from '../../../../components/ui/toasts/Toast';


const TeamOverview: React.FC = () => {
  const { showToast, ToastContainer } = useToast();

  const handleShowToast = () => {
    showToast('This is a success notification!', 'success');
  };

  const handleShowErrorToast = () => {
    showToast('This is an error notification!', 'error');
  };

  return (
    <TeamLayout>
      <h1>Team Overview</h1>
      <Card2 title="Team Stats card" description="Team stats for the current season" size="large" color="dark" glow>
        <p>Team stats go here...</p>
      </Card2>
      <button onClick={handleShowToast}>Show Success Toast</button>
      <button onClick={handleShowErrorToast}>Show Error Toast</button>
      <button onClick={() => showToast('This is a default notification!')}>Show Default Toast</button>
      <ToastContainer />
    </TeamLayout>
  );
};

export default TeamOverview;