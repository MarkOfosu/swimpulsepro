'use client';

import React, { ReactNode } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';
import { useUser } from '../../context/UserContext';

interface SwimPageLayoutProps {
  children: ReactNode;
}

const SwimPageLayout: React.FC<SwimPageLayoutProps> = ({ children }) => {
  const { user, loading } = useUser();

  const links = [
    { href: '/user/swimmer/dashboard', label: 'Dashboard' },
    { href: '/user/swimmer/goalsAchievements', label: 'Goals & Achievements' },
    { href: '/user/swimmer/standards', label: 'Standards' },
    { href: '/user/swimmer/activities', label: 'Activities' },
  ];

  // Add swim team link if the user has a group
  if (user && user.group_id) {
    links.push({
      href: '/user/swimmer/swimTeam',
      label: user.group_name || 'Swim Team'
    });
  }

  if (loading) {
    return <div>Loading...</div>; // Or any loading indicator you prefer
  }

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default SwimPageLayout;