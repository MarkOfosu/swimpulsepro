// components/ProgressUpdate.tsx
import React from 'react';
import styles from '../../../../styles/Goals.module.css';

export const ProgressUpdate: React.FC<{ message: string }> = ({ message }) => (
  <div className={styles.progressUpdate}>
    <span className={styles.progressIcon}>🎯</span>
    <span className={styles.motivationalMessage}>
      {message}
    </span>
  </div>
);