// File: components/ui/Card2.tsx
import React from 'react';
import styles from './Card.module.css';

export const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.cardHeader}>{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.cardContent}>{children}</div>;
};
