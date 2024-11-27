// hooks/useAuth.ts
import { useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUserStore } from './useUser';

export function useAuth() {
  const supabase = createClient();
  const refreshUser = useUserStore((state) => state.refreshUser);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    useUserStore.setState({ user: null });
  }, [supabase]);

  return {
    signOut,
    refreshUser,
  };
}