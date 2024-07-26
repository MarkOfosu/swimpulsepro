// app/layouts/ContentRootLayout.tsx
import '@styles/globals.css';
import React, { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';
import ContentNavBar from '@components/ContentNavBar';
import styles from '../../styles/ContentNavBar.modules.css';
interface ContentRootLayoutProps {
    links: { href: string; label: string }[];
    children: React.ReactNode;
  }
  
interface ContentRootLayoutProps {
    links: { href: string; label: string }[];
    children: React.ReactNode;
  }
 
const ContentRootLayout: React.FC<ContentRootLayoutProps> = ({ links, children }) => {
    return (
      <div className="content-layout">
        <ContentNavBar links={links} />
        <div className="content-main">
          {children}
        </div>
      </div>
    );
  };
  
  export default ContentRootLayout;