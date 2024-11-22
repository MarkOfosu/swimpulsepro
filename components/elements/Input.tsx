import React, { forwardRef } from 'react';
import styles from '../styles/Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`${styles.input} ${className || ''}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';