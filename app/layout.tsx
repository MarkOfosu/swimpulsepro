import '@styles/globals.css';
import React, { ReactNode } from 'react';
import Sidebar from '../components/SideBar';
import BottomNav from '@/components/BottomNav';
import TeamLayout from './layouts/TeamLayout';
import CoachLayout from './layouts/CoachLayout';
import ContentRootLayout from './layouts/ContentRootlayout';

export const metadata = {
  title: 'SwimPulsePro',
  description: 'Swim Training Fit Analysis and Tracking Tool',
};


function RootLayout({ children, layoutType }: { children: ReactNode; layoutType: 'team' | 'coach' }) {
  const links =
    layoutType === 'team'
      ? [
          { href: '/team/overview', label: 'Overview' },
          { href: '/team/manage-coaches', label: 'Manage Coaches' },
          { href: '/team/team-settings', label: 'Team Settings' },
        ]
      : [
          { href: '/coach/overview', label: 'Overview' },
          { href: '/coach/manage-swimmers', label: 'Manage Swimmers' },
          { href: '/coach/create-workouts', label: 'Create Workouts' },
          { href: '/coach/monitor-progress', label: 'Monitor Progress' },
        ];

  return (
    <html lang='en'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <body>
        <div id="layout">
          <Sidebar />
          <ContentRootLayout links={links}>
            <main className='content'>{children}</main>
          </ContentRootLayout>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

export default RootLayout;