// app/components/Team.tsx
import React from 'react';
import ContentRootLayout from '../app/layouts/ContentRootLayout';

const Team: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const teamLinks = [
      { href: '/team/overview', label: 'Overview' },
      { href: '/team/manage-coaches', label: 'Manage Coaches' },
      { href: '/team/team-settings', label: 'Team Settings' },
    ];
  
    return (
      <ContentRootLayout links={teamLinks}>
        {children}
      </ContentRootLayout>
    );
  };
  
  export default Team;
