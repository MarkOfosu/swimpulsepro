import React from 'react';
import styles from '../styles/BadgeAwarded.module.css';

interface BadgeProps {
  name: string;
  icon: string;
}

const BadgeAwarded: React.FC<BadgeProps> = ({ name, icon }) => {
  // Array of 10 pure colors
  const colors = [
    '#FF0000', // Red
    '#00FF00', // Lime
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#FFA500', // Orange
    '#800080', // Purple
    '#008000', // Green
    '#FFC0CB', // Pink
  ];

  // Function to select a color based on the badge name
  const selectColor = (str: string) => {
    let total = 0;
    for (let i = 0; i < str.length; i++) {
      total += str.charCodeAt(i);
    }
    return colors[total % colors.length];
  };

  const bgColor = selectColor(name);

  return (
    <div 
      className={`${styles.badge} ${styles.statCard}`}
      style={{
        background: bgColor,
        color: '#000000' // Always black text
      }}
    >
      <div className={styles.badgeIcon}>{icon}</div>
      <span className={styles.badgeName}>{name}</span>
    </div>
  );
};

export default BadgeAwarded;