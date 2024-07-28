// app/coach/page.tsx


import React, { ReactNode } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';

const CoachPage: React.FC<{ children: ReactNode }> = ({ children }) => {
  const links = [
    { href: '/coach/dashboard', label: 'Dashboard' },
    { href: '/coach/athletes', label: 'Athletes' },
    { href: '/coach/programs', label: 'Programs' },
    { href: '/coach/progress', label: 'Progress' },
    { href: '/coach/calendar', label: 'Calendar' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default CoachPage;
