
import React, { ReactNode} from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';


const CoachPageLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
 

  const links = [
    // { href: '/user/coach/dashboard', label: 'Dashboard' },
    { href: '/user/coach/swimGroup', label: 'Dashboard' },
    // { href: '/user/coach/analytics', label: 'Analytics' },
    { href: '/user/coach/workout', label: 'Workout' },
    { href: '/user/coach/metrics', label: 'Create Metric' },
    { href: '/user/coach/swimGroup/attendance', label: 'Attendance' },
    { href: '/user/coach/activity', label: 'Manage Actvities' },
    { href: '/user/settings', label: 'Settings' },
    
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default CoachPageLayout;
