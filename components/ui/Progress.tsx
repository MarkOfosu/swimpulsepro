// File: components/ui/Progress.tsx
import React from 'react';
import styles from '../styles/Progress.module.css';

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  return (
    <div className={`${styles.progressContainer} ${className}`}>
      <div className={styles.progressBar} style={{ width: `${value}%` }}></div>
    </div>
  );
};