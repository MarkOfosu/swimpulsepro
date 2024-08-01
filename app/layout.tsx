//app/layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from '../components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import Footer from '../components/ui/Footer';
import './globals.css';

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
        <Footer />
      </body>
    </html>
  );
}

export default RootLayout;