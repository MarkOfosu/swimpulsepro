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

  useEffect(() => {
    const handleHashFragment = async () => {
      try {
        // Get the full URL hash fragment
        const hashFragment = window.location.hash;
        
        // If there's a hash, it might contain the access token
        if (hashFragment) {
          const decodedHash = decodeURIComponent(hashFragment.substring(1));
          const params = new URLSearchParams(decodedHash);
          
          // Extract tokens from the hash
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const type = params.get('type');

          console.log('Hash params:', { type, hasAccessToken: !!access_token });

          if (access_token && type === 'recovery') {
            // Set the session
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token: refresh_token || '',
            });

            if (error) throw error;
            
            setIsValidating(false);
            return;
          }
        }

        // If we get here, check if we already have a valid session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsValidating(false);
          return;
        }

        throw new Error('No valid session found');
      } catch (err) {
        console.error('Session validation error:', err);
        toast.error('Invalid or expired reset link. Please request a new one.', {
          duration: 5000
        });
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/auth/forgot-password');
        }, 3000);
      }
    };

    handleHashFragment();
  }, [router, supabase.auth]);

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
      // Verify session before updating password
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Your session has expired. Please request a new reset link.');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success('Password updated successfully! Redirecting to login...', {
        id: toastId,
        duration: 3000
      });

      // Sign out the user
      await supabase.auth.signOut();

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

  // Show loading state while validating session
  if (isValidating) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <h2 className={styles.title}>Verifying Reset Link</h2>
          <div className={styles.loadingWrapper}>
            <div className={styles.spinnerLarge} />
            <p className={styles.subtitle}>
              Please wait while we verify your reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

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