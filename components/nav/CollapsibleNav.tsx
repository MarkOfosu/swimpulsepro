'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaHome, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import styles from '../styles/CollapsibleNav.module.css';
import UserProfile from '@components/ui/UserProfile';
import LogoutButton from '@app/logout/LogoutButton';

interface CollapsibleNavProps {
  userRole: 'coach' | 'swimmer';
  isAdmin?: boolean;
}

const CollapsibleNav: React.FC<CollapsibleNavProps> = ({ userRole, isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div ref={menuRef} className={styles.collapsibleMenuContainer}>
      <div className={styles.menuIcon} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
      {isMenuOpen && (
        <div className={styles.collapsibleMenuList}>
          <Link href="/" className={styles.pureMenuLink} onClick={toggleMenu}>
            <FaHome className={styles.icon} /> Home
          </Link>
          {userRole === 'coach' && (
            <>
              <Link href="/user/coach/dashboard" className={styles.pureMenuLink} onClick={toggleMenu}>
                <FaChalkboardTeacher className={styles.icon} /> Dashboard
              </Link>
              {isAdmin && (
                <Link href="/user/team/teamOverview" className={styles.pureMenuLink} onClick={toggleMenu}>
                  <FaUsers className={styles.icon} /> Team Overview
                </Link>
              )}
            </>
          )}
          {userRole === 'swimmer' && (
            <Link href="/user/swimmer/dashboard" className={styles.pureMenuLink} onClick={toggleMenu}>
              <FaUsers className={styles.icon} /> Dashboard
            </Link>
          )}
           <div className={styles.signOutContainer}>
                <UserProfile /> 
                <LogoutButton />
            </div>
    </div>
      
      )}
    </div>
  );
};

export default CollapsibleNav;
