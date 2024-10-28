// app/auth/confirm/AuthConfirmContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/AuthConfirm.module.css';
import { CheckIcon, XIcon } from 'lucide-react';

export default function AuthConfirmContent() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (!token_hash || !type) {
          throw new Error('Missing confirmation parameters');
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any
        });

        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        setVerificationComplete(true);
        
        // Delay redirect to show success message
        setTimeout(() => {
          if (user) {
            const role = user.user_metadata.role;
            router.push(role === 'coach' ? '/user/coach/swimGroup' : '/user/swimmer/dashboard');
          } else {
            router.push('/auth/login');
          }
        }, 3000);

      } catch (err) {
        console.error('Verification error:', err);
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    handleConfirmation();
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wave}></div>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <h2 className={styles.title}>Verifying Your Email</h2>
          <p className={styles.message}>Just a moment while we confirm your email address...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.wave}></div>
        <div className={styles.content}>
          <div className={styles.errorIcon}>
            <XIcon size={40} color="white" />
          </div>
          <h2 className={styles.title}>Verification Failed</h2>
          <p className={styles.message}>{error}</p>
          <div className={styles.buttonContainer}>
            <button
              onClick={() => router.push('/auth/login')}
              className={styles.primaryButton}
            >
              Return to Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className={styles.secondaryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wave}></div>
      <div className={styles.content}>
        <div className={styles.successIcon}>
          <CheckIcon size={40} color="white" />
        </div>
        <h2 className={styles.title}>Email Verified Successfully! 🎉</h2>
        <p className={styles.message}>
          Welcome to SwimPulsePro! Your email has been verified and your account is now active.
        </p>
        <div className={styles.buttonContainer}>
          <button
            onClick={() => window.open('https://www.swimpulsepro.com', '_blank')}
            className={styles.primaryButton}
          >
            Visit SwimPulsePro
          </button>
          <button
            onClick={() => router.push('/auth/login')}
            className={styles.secondaryButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}