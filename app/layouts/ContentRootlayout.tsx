// ContentRootLayout.tsx
'use client';
import React, { useState, useEffect } from 'react';
import ContentNavBar from '@components/nav/ContentNavBar';
import Sidebar from '@components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import CollapsibleNav from '@components/nav/CollapsibleNav';
import { getUserDetails } from '../lib/getUserDetails';
import Loader from '@components/elements/Loader';
import styles from '../styles/ContentRootLayout.module.css';

interface ContentRootLayoutProps {
  links: { href: string; label: string }[];
  children: React.ReactNode;
}

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'coach' | 'swimmer';
  isAdmin: boolean;
  team?: {
    name: string;
    location: string;
  };
  swimmer?: {
    date_of_birth: string;
  };
}

const ContentRootLayout: React.FC<ContentRootLayoutProps> = ({ links, children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserDetails();
        if (userData) {
          setUser(userData as UserData);
        } else {
          setError('Failed to load user details.');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user details.');
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <Loader />;
  }

  return (
    <div className={styles.contentLayout}>
      <CollapsibleNav userRole={user.role} isAdmin={user.isAdmin} userEmail={user.email} />
      <ContentNavBar links={links} />
      <div className={styles.contentMain}>
        <Sidebar 
          userRole={user.role} 
          isAdmin={user.isAdmin} 
          userEmail={user.email}
        />
        <div className={styles.contentArea}>
          {React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<any>, { user })
              : child
          )}
        </div>
        <BottomNav userRole={user.role} isAdmin={user.isAdmin} />
      </div>
    </div>
  );
};

export default ContentRootLayout;