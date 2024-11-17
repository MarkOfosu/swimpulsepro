'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@utils/supabase/client';
import { toast } from 'react-hot-toast';
import styles from '../styles/Auth.module.css';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  // useEffect(() => {
  //   let timeoutId: NodeJS.Timeout;

  //   const checkSession = async () => {
  //     try {
  //       // Wait a bit for Supabase to establish the session
  //       await new Promise(resolve => setTimeout(resolve, 1000));

  //       const { data: { session } } = await supabase.auth.getSession();
        
  //       if (!session) {
  //         throw new Error('No valid session found');
  //       }

  //       setIsValidating(false);

  //     } catch (error) {
  //       console.error('Session check error:', error);
  //       toast.error('Please use the reset link from your email', {
  //         duration: 3000
  //       });

  //       timeoutId = setTimeout(() => {
  //         router.push('/auth/forgotPassword');
  //       }, 3000);
  //     }
  //   };

  //   checkSession();

  //   return () => {
  //     if (timeoutId) clearTimeout(timeoutId);
  //   };
  // }, [router, supabase.auth]);

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Updating password...');

    try {
      // Verify session is still valid
      const { data: { session } } = await supabase.auth.getSession();
      // if (!session) {
      //   throw new Error('Your session has expired. Please request a new reset link.');
      // }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success('Password updated successfully! Redirecting to login...', {
        id: toastId,
        duration: 3000
      });

      // Sign out
      // await supabase.auth.signOut();

      // Redirect to login
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (err) {
      console.error('Password update error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to update password. Please try again.';
      
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking session
  // if (isValidating) {
  //   return (
  //     <div className={styles.pageWrapper}>
  //       <div className={styles.container}>
  //         <h2 className={styles.title}>Verifying Reset Link</h2>
  //         <div className={styles.loadingWrapper}>
  //           <div className={styles.spinnerLarge} />
  //           <p className={styles.subtitle}>
  //             Please wait while we verify your reset link...
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Set New Password</h2>
        <p className={styles.subtitle}>
          Please enter and confirm your new password.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="Enter new password"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="Confirm new password"
              disabled={isLoading}
              autoComplete="new-password"
            />
            {error && <div className={styles.error}>{error}</div>}
          </div>

          <div className={styles.requirements}>
            <p>Password must:</p>
            <ul>
              <li>Be at least 6 characters long</li>
              <li>Include an uppercase letter</li>
              <li>Include a lowercase letter</li>
              <li>Include a number</li>
            </ul>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Updating Password
                <span className={styles.spinner} />
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}