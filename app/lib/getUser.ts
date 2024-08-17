'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@utils/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'coach' | 'swimmer';

export const useUserClient = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('swimmer');

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        console.log('no user');
        return;
      }
      setUser(data.user);

      // Fetch user role from the users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError || !userProfile) {
        console.log('error fetching user profile');
        return;
      }

      setRole(userProfile.role as UserRole);
    }

    fetchUser();
  }, []);

  return { user, role };
};
