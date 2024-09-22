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
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default SwimPageLayout;
