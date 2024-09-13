"use client";
import React, { ReactNode } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';

interface SwimPageLayoutProps {
  children: ReactNode;
}

const SwimPageLayout: React.FC<SwimPageLayoutProps> = ({ children }) => {
  const links = [
    { href: '/user/swimmer/dashboard', label: 'Dashboard' },
    // { href: '/user/swimmer/analytics', label: 'Analytics' },
    // { href: '/user/swimmer/workout', label: 'Workout' },
    // { href: '/user/swimmer/metrics', label: 'Create Metric' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default SwimPageLayout;
