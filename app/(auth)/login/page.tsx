"use client";
import React, { useEffect, useState } from 'react';
import { getUserDetails } from '../../lib/getUserDetails';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';
import Loader from '../../../components/elements/Loader';

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
          setLoading(false); // No user, show login form
        }
      } catch (err) {
        // console.error('Error fetching user details:', err);
        // setError('Failed to fetch user details.');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle redirection based on user role after loading is complete
  if (user?.role === 'coach') {
    router.push('/user/coach/dashboard');
    return null; // Prevent further rendering
  } else if (user?.role === 'swimmer') {
    router.push('/user/swimmer/dashboard');
    return null; // Prevent further rendering
  }

  // Show login form if user is not logged in or role not found
  return <LoginForm />;
};

export default LoginPage;
