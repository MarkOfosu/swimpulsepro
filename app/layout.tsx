import '@styles/globals.css';
import React, { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import ContentNavBar from '@components/ContentNavBar';

export const metadata = {
  title: 'SwimPulsePro',
  description: 'Swim Training Fit Analysis and Tracking Tool',
};


function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <body>
        <div id="layout">
          <Sidebar />
          <main className='content'>
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

export default RootLayout;