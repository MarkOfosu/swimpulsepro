import React from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';

const TeamPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const links = [
    { href: '/user/team/teamOverview', label: 'Overview' },
    { href: '/user/team/manageCoaches', label: 'Manage Coaches' },
    { href: '/user/team/teamSettings', label: 'Team Settings' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default TeamPageLayout;
