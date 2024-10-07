
import React, { ReactNode, useEffect } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';

interface SwimPageLayoutProps {
  children: ReactNode;
}

const SwimPageLayout: React.FC<SwimPageLayoutProps> = ({ children }) => {

  const links = [
    { href: '/user/swimmer/dashboard', label: 'Dashboard' },
    { href: '/user/swimmer/swimmerProfile', label: 'Profile' },
    { href: '/user/swimmer/swimTeam', label: 'Swim Team'}
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default SwimPageLayout;
