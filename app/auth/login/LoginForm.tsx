'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/LoginPage.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import Loader from '../../../components/elements/Loader';
import { useUser } from '../../context/UserContext';
import { getUserDetails } from '@app/api/getUserDetails';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Footer from '@components/elements/Footer';

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useUser();
  const supabase = createClient();
  const [formFilled, setFormFilled] = useState(false);

  const handleExistingSession = useCallback(async () => {
    try {
      await refreshUser();
      const userDetails = await getUserDetails();
      if (userDetails?.role === 'coach') {
        setShouldRedirect('/user/coach/swimGroup');
      } else if (userDetails?.role === 'swimmer') {
        setShouldRedirect('/user/swimmer/dashboard');
      }
    } catch (err) {
      // console.error('Session validation failed:', err);
    }
  }, [refreshUser, setShouldRedirect]);

  // Handle redirects in useEffect
  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  // Check existing session
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await handleExistingSession();
        }
      } catch (err) {
        // console.error('Session check failed:', err);
      }
    };

    checkExistingSession();
  }, [supabase, handleExistingSession]);

  const handleInputChange = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;
    setFormFilled(email !== '' && password !== '');
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      await refreshUser();
      const userDetails = await getUserDetails();

      if (userDetails?.role === 'coach') {
        setShouldRedirect('/user/coach/swimGroup');
      } else if (userDetails?.role === 'swimmer') {
        setShouldRedirect('/user/swimmer/dashboard');
      } else {
        throw new Error('Invalid user role');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  }, [supabase, refreshUser, setShouldRedirect, setLoading, setError]);

  return (
    <>
      <WelcomeNavbar />
      <div className={styles.pageContainer}>
        <div className={styles.loginContainer}>
          <div className={styles.formWrapper}>
            <div className={styles.headerSection}>
              <h1 className={styles.title}>Welcome</h1>
              <p className={styles.subtitle}>
                Enter your credentials to access your account
              </p>
            </div>

            {loading ? (
              <div className={styles.loaderWrapper}>
                <Loader />
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit} 
                onChange={handleInputChange}
                className={styles.form}
              >
                <div className={styles.inputGroup}>
                  <Mail className={styles.inputIcon} size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email address"
                    className={styles.input}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Lock className={styles.inputIcon} size={20} />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className={styles.input}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <div className={styles.forgotPassword}>
                  <a href="/auth/forgotPassword">Forgot password?</a>
                </div>

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`${styles.submitButton} ${formFilled ? styles.filled : ''}`}
                  disabled={loading}
                >
                  <span>Log in</span>
                  <ArrowRight size={20} />
                </button>

                <div className={styles.signupPrompt}>
                  <span>Don&apos;t have an account?</span>
                  <button
                    type="button"
                    onClick={() => router.push('/getStarted')}
                    className={styles.signupLink}
                  >
                    Sign up
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className={styles.featuresSection}>
            <div className={styles.featureCard}>
              <h3>Track Progress</h3>
              <p>Monitor your swimming journey with detailed analytics</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Connect with Coaches</h3>
              <p>Direct communication with your swimming coaches</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Performance Insights</h3>
              <p>Get detailed insights into your swimming performance</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginForm;