//app/layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from '../components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import Footer from '../components/elements/Footer';
import './globals.css';
import WelcomePage from './welcome/page';

export const metadata = {
  title: 'SwimPulsePro',
  description: 'Swim Training Fit Analysis and Tracking Tool',
  icons: {
    icon: [
      '/favicon.ico?v=4',
    ],
    apple: '/apple-touch-icon.png?v=4',
    shortcut: [
      '/apple-touch-icon.png',
    ],
  },
  manifest: '/site.webmanifest',
};


function RootLayout({ children}: { readonly children: ReactNode}) {
  const signedin = true;

  return (
    <html lang='en'>
      <head>
        <title>{metadata.title}</title>
        <meta name='description' content={metadata.description} />
      </head>
      <body> 
          <main className='content'>{children}</main>   
         <Footer />
      </body>
    </html>
  );
}

export default RootLayout;
