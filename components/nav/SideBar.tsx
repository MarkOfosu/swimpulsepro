// Sidebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaUsers, FaUser, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../public/image/logo.png';
import styles from '../../components/styles/Sidebar.module.css';
import { logout } from '@app/(auth)/logout/actions';

interface SidebarProps {
  userRole: 'coach' | 'swimmer';
  isAdmin: boolean;
  userEmail: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, isAdmin, userEmail }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallScreen) {
    return null; // Don't render the sidebar on small screens
  }

  return (
    <div className={styles.menu}>
      <Link href="/" className={styles.logo}>
        <Image src={logo} alt="SwimPulsePro Logo" width={40} height={40} />
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