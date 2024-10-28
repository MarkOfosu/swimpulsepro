// LogoutButton.tsx
'use client';

import React, { useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { logout } from './action';
import { useToast } from '@components/elements/toasts/Toast';
import style from '../../styles/LogoutButton.module.css';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '../../context/UserContext'

export default function LogoutButton() {
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();
  const { user } = useUser(); // Get user context to check role

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // First, clear all local storage
      Object.keys(localStorage).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Sign out from Supabase client
      await supabase.auth.signOut();

      // Call server-side logout
      const result = await logout();

      if (result.success) {
        showToast(result.message, 'success');
        
        // Clear client-side router cache
        router.refresh();

        // Use different redirect strategies based on role
        if (user?.role === 'swimmer') {
          // For swimmers, do a full page reload to clear any cached states
          // window.location.href = '/login';
          router.push('/login');
          router.refresh();
        } else {
          // For coaches, use the Next.js router
          router.push('/auth/login');
          router.refresh();
        }
      } else {
        showToast('Failed to log out', 'error');
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      showToast('An error occurred during logout', 'error');
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div 
        onClick={handleLogout} 
        className={`${style.logoutButton} ${isLoggingOut ? style.loading : ''}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleLogout();
          }
        }}
      >
        {isLoggingOut ? (
          <span className={style.loadingText}>Logging out...</span>
        ) : (
          <FaSignOutAlt className={style.logoutIcon} />
        )}
      </div>
    </>
  );
}