'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { accountService } from '../../services/accountService';
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
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    let mounted = true;

    const validateResetToken = async () => {
      try {
        // Get all possible token parameters
        const access_token = searchParams?.get('access_token');
        const refresh_token = searchParams?.get('refresh_token');
        const type = searchParams?.get('type');

        // If we have tokens, try to set the session
        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (sessionError) throw sessionError;
        }

        // Verify the session is valid
        const { data: { session }, error: verifyError } = await supabase.auth.getSession();

        if (verifyError || !session) {
          throw new Error('Invalid session');
        }

        // Additional type check for recovery
        if (type !== 'recovery') {
          throw new Error('Invalid reset type');
        }

        if (mounted) {
          setIsValidating(false);
        }
      } catch (err) {
        console.error('Token validation error:', err);
        
        if (mounted) {
          toast.error('Invalid or expired reset link', {
            duration: 3000,
            position: 'top-center',
          });

          redirectTimer = setTimeout(() => {
            if (mounted) {
              router.push('/auth/forgotPassword');
            }
          }, 3000);
        }
      }
    };

    validateResetToken();

    return () => {
      mounted = false;
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [searchParams, router, supabase.auth]);

  const validatePassword = (password: string): string => {
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
      // Get current session to verify token is still valid
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Reset session has expired');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Sign out after successful password change
      await supabase.auth.signOut();

      toast.success('Password updated successfully. Please log in with your new password.', { 
        id: toastId,
        duration: 3000
      });
      
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to update password';
      
      toast.error(errorMessage, { 
        id: toastId,
        duration: 5000
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <h2 className={styles.title}>Validating Reset Link</h2>
          <div className={styles.loadingWrapper}>
            <div className={styles.spinnerLarge} />
            <p className={styles.subtitle}>
              Please wait while we validate your reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Reset Your Password</h2>
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