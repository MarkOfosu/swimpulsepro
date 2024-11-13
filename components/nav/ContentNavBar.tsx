'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SettingsDropdown from '../elements/settings/SettingsDropdown';
import styles from '../styles/ContentNavBar.module.css';

interface ContentNavBarProps {
  links: { href: string; label: string }[];
}

const ContentNavBar: React.FC<ContentNavBarProps> = ({ links }) => {
  const pathname = usePathname();
  const navigationLinks = links.filter(link => link.label !== 'Settings');

  return (
    <nav className={styles.contentNavbar}>
      <ul>
        {navigationLinks.map((link) => (
          <li key={link.href}>
            <Link 
              href={link.href} 
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <SettingsDropdown />
    </nav>
  );
};

export default ContentNavBar;