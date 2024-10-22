// app/layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from '../components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import Footer from '../components/elements/Footer';
import './globals.css';
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
  const signedin = true;

  return (
    <UserProvider>
      <html lang="en" className="h-full">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <body className="flex min-h-screen flex-col">
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </UserProvider>
  );
}

export default RootLayout;