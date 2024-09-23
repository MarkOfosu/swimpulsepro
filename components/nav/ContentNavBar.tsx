// ContentNavBar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/ContentNavBar.module.css';

interface ContentNavBarProps {
  links: { href: string; label: string }[];
}

const ContentNavBar: React.FC<ContentNavBarProps> = ({ links }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.contentNavbar}>
      <ul>
        {links.map((link) => (
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
    </nav>
  );
};

export default ContentNavBar;