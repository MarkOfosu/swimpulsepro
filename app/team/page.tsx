import React from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';

const TeamPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const links = [
    { href: '/team/teamOverview', label: 'Overview' },
    { href: '/team/manageCoaches', label: 'Manage Coaches' },
    { href: '/team/teamSettings', label: 'Team Settings' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default TeamPageLayout;
