// components/nav/NavItems.tsx
import React from 'react';
import Link from 'next/link';
import { FaHome, FaUsers, FaChalkboardTeacher, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '@app/(auth)/logout/actions';

interface NavItemsProps {
  userRole: 'coach' | 'swimmer';
  isAdmin: boolean;
  userEmail: string;
  styles: any;
  onClick?: () => void;
}

const NavItems: React.FC<NavItemsProps> = ({ userRole, isAdmin, userEmail, styles, onClick }) => {
  return (
    <>
      <Link href="/" className={styles.pureMenuLink} onClick={onClick}>
        <FaHome className={styles.icon} /> <span className={styles.text}>Home</span>
      </Link>
      
      {userRole === 'coach' && (
        <>
          <Link href="/user/coach/coachDashboard" className={styles.pureMenuLink} onClick={onClick}>
            <FaChalkboardTeacher className={styles.icon} /> <span className={styles.text}>Coach Dashboard</span>
          </Link>
          {isAdmin && (
            <Link href="/user/team/teamOverview" className={styles.pureMenuLink} onClick={onClick}>
              <FaUsers className={styles.icon} /> <span className={styles.text}>Team Overview</span>
            </Link>
          )}
        </>
      )}
      
      {userRole === 'swimmer' && (
        <Link href="/user/swimmer/dashboard" className={styles.pureMenuLink} onClick={onClick}>
          <FaUsers className={styles.icon} /> <span className={styles.text}>Swimmer Dashboard</span>
        </Link>
      )}
      
      <div className={styles.signOutContainer}>
        <Link href="/" className={styles.pureMenuLink}>
          <FaUser className={styles.icon} /> <span className={styles.text}>{userEmail.split('@')[0]}</span>
        </Link>
        <Link href="/login" onClick={() => logout()} className={styles.pureMenuLink}>
          <FaSignOutAlt className={styles.icon} /> <span className={styles.text}>Logout</span>
        </Link>
      </div>
    </>
  );
};

export default NavItems;