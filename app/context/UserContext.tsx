
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserDetails, UserData } from '../api/getUserDetails';
import { createClient } from '@utils/supabase/client';

// Extend UserData interface to include verification status
interface ExtendedUserData extends UserData {
  isVerified?: boolean;
}

interface UserContextType {
  user: ExtendedUserData | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const supabase = createClient();

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;

      if (!authUser) {
        setUser(null);
        return null;
      }

      return {
        ...authUser,
        isVerified: !!authUser.email_confirmed_at,
        role: authUser.user_metadata.role
      };

    } catch (error) {
      console.error('Error checking auth status:', error);
      return null;
    }
  };

  const fetchUser = async () => {
    try {
      // First check auth status
      const authUser = await checkAuthStatus();
      
      if (!authUser) {
        setUser(null);
        return;
      }

      // Then get additional user details
      const userDetails = await getUserDetails();
      
      if (userDetails) {
        // Combine auth status with user details
        setUser({
          ...userDetails,
          isVerified: authUser.isVerified,
          role: authUser.role
        });
        setError(null);
      } else {
        throw new Error('Failed to fetch user details');
      }

    } catch (err) {
      setError('Failed to fetch user details');
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'USER_UPDATED') {
        // Refresh user data when email is verified
        fetchUser();
      }
    });

    // Initial fetch
    fetchUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}