//app/layout.tsx
import '@styles/globals.css';
import React, { ReactNode } from 'react';
import Sidebar from '../components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';

export const metadata = {
  title: 'SwimPulsePro',
  description: 'Swim Training Fit Analysis and Tracking Tool',
};

function RootLayout({ children}: { readonly children: ReactNode}) {

  return (
    <html lang='en'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <body>
        <div id="layout">
          <Sidebar />
            <main className='content'>{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

export default RootLayout;