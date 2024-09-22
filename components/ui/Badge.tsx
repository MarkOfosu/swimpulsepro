// File: components/ui/Badge.tsx
import React from 'react';
import styles from '../styles/Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
};
