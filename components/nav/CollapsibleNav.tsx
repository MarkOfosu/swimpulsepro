'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaHome, FaChalkboardTeacher, FaUsers, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import styles from '../styles/CollapsibleNav.module.css';
import { logout } from '../../app/auth/logout/actions';
import MobileSettingsView from '../elements/settings/mobileViewVersion/MobileSettingsView';

interface CollapsibleNavProps {
  userRole: 'coach' | 'swimmer';
  isAdmin: boolean;
  userEmail: string;
}

const CollapsibleNav: React.FC<CollapsibleNavProps> = ({ userRole, isAdmin, userEmail }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSettingsOpen(false);
  };

  const handleOpenSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSettingsOpen(true);
    setIsMenuOpen(false); // Close the menu when opening settings
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
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
            <Link href="/user/coach/swimGroup" className={styles.pureMenuLink} onClick={toggleMenu}>
              <FaChalkboardTeacher className={styles.icon} /> Dashboard
            </Link>
          )}
          
          {userRole === 'swimmer' && (
            <Link href="/user/swimmer/dashboard" className={styles.pureMenuLink} onClick={toggleMenu}>
              <FaUsers className={styles.icon} /> Dashboard
            </Link>
          )}
          
          <button 

            className={styles.pureMenuLink}
            onClick={handleOpenSettings}
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <FaCog className={styles.icon} /> 
            Settings
          </button>

          <div className={styles.signOutContainer}>
            <Link href="/" className={styles.pureMenuLink}>
              <FaUser className={styles.icon} /> 
              <span className={styles.text}>{userEmail.split('@')[0]}</span>
            </Link>
            <Link href="/auth/login" onClick={() => logout()} className={styles.pureMenuLink}>
              <FaSignOutAlt className={styles.icon} /> 
              <span className={styles.text}>Logout</span>
            </Link>
          </div>
        </div>
      )}

      <MobileSettingsView 
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
      />
    </div>
  );
};

export default CollapsibleNav;