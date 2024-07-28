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


function RootLayout({ children, layoutType }: { readonly children: ReactNode; readonly layoutType: 'team' | 'coach' }) {
  const getLinks = (layoutType: 'team' | 'coach') => {
    switch (layoutType) {
      case 'team':
        return [
          { href: '/team/dashboard', label: 'Dashboard' },
          { href: '/team/athletes', label: 'Athletes' },
          { href: '/team/programs', label: 'Programs' },
          { href: '/team/progress', label: 'Progress' },
          { href: '/team/calendar', label: 'Calendar' },
        ];
      case 'coach':
        return [
          { href: '/coach/dashboard', label: 'Dashboard' },
          { href: '/coach/athletes', label: 'Athletes' },
          { href: '/coach/programs', label: 'Programs' },
          { href: '/coach/progress', label: 'Progress' },
          { href: '/coach/calendar', label: 'Calendar' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks(layoutType);

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