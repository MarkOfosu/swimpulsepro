


// File: components/ui/Card.tsxd
import React from 'react';
import styles from '../styles/Card.module.css';

interface CardProps {

  children: React.ReactNode;

  className?: string;

}


export const Card: React.FC<CardProps> = ({ children, className }) => {

  return <div className={className}>{children}</div>;

};

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.cardHeader}>{children}</div>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {

  return <div className={className}>{children}</div>;

};











