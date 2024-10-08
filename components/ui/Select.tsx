import React from 'react';
import styles from '../styles/Select.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
  return (
    <select
      className={`${styles.select} ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  );
};