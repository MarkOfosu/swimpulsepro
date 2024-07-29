import React, { ReactNode } from 'react';
import styles from '../styles/Card.module.css';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'dark' | 'light' | 'primary' | 'secondary';
}

export default function Card({ title, description, footer, children, size = 'medium', color = 'default' }: Props) {
    return (
        <div className={`${styles.cardContainer} ${styles[size]} ${styles[color]}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{title}</h3>
            {description && <p className={styles.cardDescription}>{description}</p>}
          </div>
          <div className={styles.cardContent}>
            {children}
          </div>
          {footer && (
            <div className={styles.cardFooter}>
              {footer}
            </div>
          )}
        </div>
    );
}
