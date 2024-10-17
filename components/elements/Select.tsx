import React, { forwardRef } from 'react';
import styles from '../styles/Select.module.css';

// Define the props and forward the ref
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

// Wrap the component in React.forwardRef to allow refs
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <select
        ref={ref} // Forward the ref here
        className={`${styles.select} ${className || ''}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

// Add displayName for better debugging
Select.displayName = 'Select';


