// ForgotPassword.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { accountService } from '../../services/accountService';
import { toast } from 'react-hot-toast';
import styles from '../styles/Auth.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError('');
    const toastId = toast.loading('Verifying email...');

    try {
      await accountService.forgotPassword({
        email,
        redirectUrl: `${window.location.origin}/auth/reset-password`
      });

      toast.success('Password reset instructions sent to your email', { 
        id: toastId,
        duration: 5000 
      });
      setEmailSent(true);
    } catch (err) {
      let errorMessage = 'Failed to process request';
      
      if (err instanceof Error) {
        if (err.message.includes('No account found')) {
          // Still show success for security
          toast.success('If an account exists, password reset instructions will be sent', { 
            id: toastId,
            duration: 5000 
          });
          setEmailSent(true);
          return;
        } else {
          errorMessage = 'An error occurred. Please try again later.';
        }
      }
      
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <WelcomeNavbar />
        <div className={styles.pageWrapper}>
          <div className={styles.container}>
            <h2 className={styles.title}>Check Your Email</h2>
            <div className={styles.message}>
              <p>If an account exists with email:</p>
              <p className={styles.email}>{email}</p>
              <p>
                Password reset instructions have been sent. Please check your inbox (and spam folder) 
                and follow the instructions to reset your password.
              </p>
            </div>
            <button
              className={styles.submitButton}
              onClick={() => router.push('/auth/login')}
            >
              Return to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <p className={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete="email"
            />
            {error && <div className={styles.error}>{error}</div>}
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                Sending Instructions
                <span className={styles.spinner} />
              </>
            ) : (
              'Send Instructions'
            )}
          </button>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => router.push('/auth/login')}
            disabled={isLoading}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}