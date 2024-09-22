import React from 'react';
import styles from '../styles/LevelBadge.module.css';

interface LevelBadgeProps {
  level: number;
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, className }) => {
  return (
    <div className={`${styles.levelBadge} ${className}`}>
      <span className={styles.levelText}>Level</span>
      <span className={styles.levelNumber}>{level}</span>
    </div>
  );
};