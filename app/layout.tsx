import React, { ReactNode } from 'react';
import Sidebar from '../components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import Footer from '../components/elements/Footer';
import '../styles/global.css';
import WelcomePage from './welcome/page';
import { User } from 'lucide-react';
import { UserProvider } from '../app/context/UserContext';

export const metadata = {
  title: 'SwimPulsePro',
  description: 'Swim Training Fit Analysis and Tracking Tool',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: '/apple-touch-icon.png?v=4',
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
};

function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <UserProvider>
      <html lang="en" className="h-full">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body className="flex min-h-screen flex-col bg-background">
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </UserProvider>
  );
}

export default RootLayout;