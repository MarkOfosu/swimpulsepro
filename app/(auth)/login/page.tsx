// app/login/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { getUserDetails } from '../../lib/getUserDetails';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';
import Loader from '../../../components/elements/Loader';
import styles from '../../styles/LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails) {
          setUser(userDetails);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  if (user?.role === 'coach') {
    router.push('/user/coach/dashboard');
    return null;
  } else if (user?.role === 'swimmer') {
    router.push('/user/swimmer/dashboard');
    return null;
  }

  return <LoginForm />;
};

export default LoginPage;