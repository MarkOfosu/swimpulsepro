// app/coach/page.tsx


import React, { ReactNode } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';
import RootLayout from '@app/layout';
import Sidebar from '@components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';

const CoachPageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const links = [
    { href: '/coach/dashboard', label: 'Dashboard' },
    { href: '/coach/swimGroup', label: 'Swim Groups' },
    { href: '/coach/analytics', label: 'Analytics' },
    { href: '/coach/workout', label: 'Workout' },
  ];

  return (
    <ContentRootLayout links={links}>
       {children}
    </ContentRootLayout>
  );
};

export default CoachPageLayout;
