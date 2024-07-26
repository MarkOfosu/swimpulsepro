// app/components/Coach.tsx
import React from 'react';
import ContentRootLayout from '../app/layouts/ContentRootLayout';

const Coach: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const coachLinks = [
      { href: '/coach/overview', label: 'Overview' },
      { href: '/coach/manage-swimmers', label: 'Manage Swimmers' },
      { href: '/coach/create-workouts', label: 'Create Workouts' },
      { href: '/coach/monitor-progress', label: 'Monitor Progress' },
    ];
  
    return (
      <ContentRootLayout links={coachLinks}>
        {children}
      </ContentRootLayout>
    );
  };
  
  export default Coach;
