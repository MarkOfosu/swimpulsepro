// File: components/ui/Toast.tsx
import React, { useState } from 'react';
import styles from '../../styles/Toast.module.css';


interface ToastProps {
    id: number;
    message: string;
    type?: 'default' | 'success' | 'error';
    onClose: () => void;
  }
  
  const Toast: React.FC<ToastProps> = ({ id, message, type = 'default', onClose }) => {
    const toastClassName = `${styles.toast} ${styles[type]}`;
  
    return (
      <div className={toastClassName}>
        <p>{message}</p>
        <button onClick={onClose}>X</button>
      </div>
    );
  };
  
  export const useToast = () => {
    const [toasts, setToasts] = useState<{ id: number; message: string; type: 'default' | 'success' | 'error' }[]>([]);
  
    const showToast = (message: string, type: 'default' | 'success' | 'error' = 'default') => {
      const id = Date.now();
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
      setTimeout(() => removeToast(id), 3000); // Auto-dismiss after 3 seconds
    };
  
    const removeToast = (id: number) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };
  
    const ToastContainer: React.FC = () => (
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    );
  
    return { showToast, ToastContainer };
  };
  
  export default Toast;