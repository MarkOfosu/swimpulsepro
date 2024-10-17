import React from 'react';
import styles from '../styles/Avatar.module.css';

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ children, className }) => {
  return <div className={`${styles.avatar} ${className}`}>{children}</div>;
};

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return <img {...props} className={styles.avatarImage} />;
};

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.avatarFallback}>{children}</div>;
};