// app/(auth)/login/page.tsx
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
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);
        if (userDetails) {
          setShouldRedirect(
            userDetails.role === 'coach' 
              ? '/user/coach/dashboard' 
              : '/user/swimmer/dashboard'
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle navigation in a separate useEffect
  useEffect(() => {
    if (shouldRedirect) {
      router.push(shouldRedirect);
    }
  }, [shouldRedirect, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // Show login form if no user or redirect path
  if (!shouldRedirect) {
    return <LoginForm />;
  }

  // Return null while redirect is happening
  return null;
};

export default LoginPage;