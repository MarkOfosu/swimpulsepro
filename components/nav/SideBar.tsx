'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaUsers, FaUser, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../public/image/logo.png';
import styles from '../styles/SideBar.module.css';
import { logout } from '@app/(auth)/logout/actions';

interface SidebarProps {
  userRole: 'coach' | 'swimmer';
  isAdmin: boolean;
  userEmail: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, isAdmin, userEmail }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setCollapsed(e.matches);
    };

    if (mediaQuery.matches) {
      setCollapsed(true);
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const storedCollapseState = localStorage.getItem('sidebar-collapsed');
    if (storedCollapseState !== null) {
      setCollapsed(JSON.parse(storedCollapseState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <div id="menu" className={`${styles.menu} ${collapsed ? styles.collapsed : ''}`}>
      <Link href="/" className={styles.logo}>
        <Image src={logo} alt="SwimPulsePro Logo" />
      </Link>
      <Link href="/" className={styles.pureMenuLink}>
        <FaHome className={styles.icon} /> <span className={styles.text}>Home</span>
      </Link>
      {userRole === 'coach' ? (
        <>
          <Link href="/user/coach/dashboard" className={styles.pureMenuLink}>
            <FaChalkboardTeacher className={styles.icon} /> <span className={styles.text}>Coach Dashboard</span>
          </Link>
          {isAdmin && (
            <>
              <hr className={styles.separator} />
              <Link href="/user/team/teamOverview" className={styles.pureMenuLink}>
                <FaUsers className={styles.icon} /> <span className={styles.text}>Team Dashboard</span>
              </Link>
            </>
          )}
        </>
      ) : userRole === 'swimmer' ? (
        <Link href="/user/swimmer/dashboard" className={styles.pureMenuLink}>
          <FaUsers className={styles.icon} /> <span className={styles.text}>Swimmer Dashboard</span>
        </Link>
      ) : null}
      <div className={styles.signOutContainer}>
        <Link href="" className={styles.pureMenuLink}>
          <FaUser className={styles.icon} /> <span className={styles.text}>{userEmail.split('@')[0]}</span>
        </Link>
        <Link href="/login" onClick={() => logout()} className={styles.pureMenuLink}>
          <FaSignOutAlt className={styles.icon} /> <span className={styles.text}>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;