"use client";
import React, { ReactNode, useEffect } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';
import { getUserDetails } from '../../lib/getUserDetails';
import Loader from '@components/ui/Loader';

interface SwimPageLayoutProps {
  children: ReactNode;
}



const SwimPageLayout: React.FC<SwimPageLayoutProps> = ({ children }) => {

  const links = [
    { href: '/user/swimmer/dashboard', label: 'Dashboard' },
    { href: '/user/swimmer/swimmerProfile', label: 'Profile' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default SwimPageLayout;
