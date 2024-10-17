"use client";
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from '../../styles/LoginForm.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Loader from '../../../components/elements/Loader'; // Assuming you have a Loader component
import { getUserDetails } from '@app/lib/getUserDetails'; // Assuming this fetches user details like role

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    const formData = new FormData(e.currentTarget);
    try {
      // Prepare login data
      const loginData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      // Create Supabase client and attempt to log in
      const supabase = createClient();
      const { data: session, error } = await supabase.auth.signInWithPassword(loginData);

      // Handle login errors
      if (error) {
        setError('Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // After login, fetch user details
      const userDetails = await getUserDetails();

      // Handle redirection based on user role
      if (userDetails?.role === 'coach') {
        router.push('/user/coach/dashboard');
      } else if (userDetails?.role === 'swimmer') {
        router.push('/user/swimmer/dashboard');
      } else {
        setError('Unknown user. Please contact support.');
      }

    } catch (err) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <>
      <WelcomeNavbar />
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2>Login</h2>
          {loading ? (
            <Loader /> 
          ) : (
            <form onSubmit={handleSubmit}>
              <div className={styles.inputBox}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                />
                <label>Email</label>
              </div>
              <div className={styles.inputBox}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
                <label>Password</label>
              </div>
              <div className={styles.forgotPassword}>
                <a href="#">Forgot Password?</a>
              </div>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button type="submit" className={styles.btn}>Log in</button>
            </form>
          )}
          <div className={styles.signupLink}>
            <button onClick={handleSignup} className={styles.signUpBtn}>Sign up</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
