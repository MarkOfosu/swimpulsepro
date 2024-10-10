// File: components/ui/Badge.tsx
import React from 'react';
import styles from '../styles/Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};