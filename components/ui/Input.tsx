import React from 'react';
import styles from '../styles/Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`${styles.input} ${className || ''}`}
      {...props}
    />
  );
};