//page/team/page.tsx

import React, { ReactNode } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';

const TeamPage: React.FC<{ children: ReactNode }> = ({ children }) => {
  const links = [
    { href: '/team/overview', label: 'Overview' },
    { href: '/team/manage-coaches', label: 'Manage Coaches' },
    { href: '/team/team-settings', label: 'Team Settings' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default TeamPage;
