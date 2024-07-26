// app/components/ContentNavBar.tsx
import React from 'react';
import Link from 'next/link';
import styles from '../styles/ContentNavBar.modules.css';

interface LinkItem {
  href: string;
  label: string;
}

interface ContentNavBarProps {
  links: LinkItem[];
}

const ContentNavBar: React.FC<ContentNavBarProps> = ({ links }) => {
  return (
    <nav className={styles.navbar}>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ContentNavBar;
