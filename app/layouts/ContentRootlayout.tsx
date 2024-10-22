// ContentRootLayout.tsx
'use client';
import React from 'react';
import ContentNavBar from '@components/nav/ContentNavBar';
import Sidebar from '@components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import CollapsibleNav from '@components/nav/CollapsibleNav';
import { useUser } from '../context/UserContext';
import styles from '../styles/ContentRootLayout.module.css';
import ContentRootLayoutLoading from './ContentRootLayoutLoading';

interface ContentRootLayoutProps {
  links: { href: string; label: string }[];
  children: React.ReactNode;
}

const ContentRootLayout: React.FC<ContentRootLayoutProps> = ({ links, children }) => {
  const { user, loading, error } = useUser();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
         <ContentRootLayoutLoading />
      </div>
    );
  }

  // Show error state without navigation elements
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Only render the layout if we have user data
  if (!user) {
    return <div className="error-message">Unable to load user profile</div>;
  }

  return (
    <div className={styles.contentLayout}>
      <CollapsibleNav userRole={user.role} userEmail={user.email} isAdmin={user.role==='coach'} />
      <ContentNavBar links={links} />
      <div className={styles.contentMain}>
        <Sidebar 
          userRole={user.role} 
          isAdmin={user.role==='coach'}
          userEmail={user.email}
        />
        <div className={styles.contentArea}>
          {children}
        </div>
        <BottomNav userRole={user.role} isAdmin={user.role==='coach'} />
      </div>
    </div>
  );
};

export default ContentRootLayout;