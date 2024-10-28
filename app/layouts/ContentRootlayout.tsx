'use client';
import React from 'react';
import ContentNavBar from '@components/nav/ContentNavBar';
import Sidebar from '@components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import CollapsibleNav from '@components/nav/CollapsibleNav';
import { useUser } from '../context/UserContext';
import styles from '../styles/ContentRootLayout.module.css';
import ContentRootLayoutLoading from './ContentRootLayoutLoading';
import Footer from '../../components/elements/Footer';
import { useRouter } from 'next/navigation';

interface ContentRootLayoutProps {
  links: { href: string; label: string }[];
  children: React.ReactNode;
}

const ContentRootLayout: React.FC<ContentRootLayoutProps> = ({ links, children }) => {
  const { user, loading, error } = useUser();
  const Router = useRouter();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <ContentRootLayoutLoading />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    // Redirect to login page if no user
    Router.push('/auth/login');
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <CollapsibleNav userRole={user.role} userEmail={user.email} isAdmin={user.role === 'coach'} />
      <ContentNavBar links={links} />
      <div className={styles.mainWrapper}>
        <Sidebar
          userRole={user.role}
          isAdmin={user.role === 'coach'}
          userEmail={user.email}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.contentArea}>
            {children}
          </div>
          <Footer />
          <BottomNav userRole={user.role} isAdmin={user.role === 'coach'} />
        </div>
      </div>
    </div>
  );
};

export default ContentRootLayout;