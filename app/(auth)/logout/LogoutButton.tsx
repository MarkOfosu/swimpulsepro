// LogoutButton.tsx
'use client';

import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { logout } from './actions';
import { useToast } from '@components/ui/toasts/Toast';
import style from '../styles/LogoutButton.module.css';

export default function LogoutButton() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();  // Initialize the toast

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      showToast(result.message, 'success');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      showToast('Failed to log out', 'error');
    }
  };

  return (
    <>
      <ToastContainer /> 
      <div onClick={handleLogout} className={style.logoutButton}>
      </div>
    </>
  );
}
