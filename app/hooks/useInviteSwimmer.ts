import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface UseInviteSwimmerProps {
  groupId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useInviteSwimmer({ groupId, onSuccess, onError }: UseInviteSwimmerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const sendInvitation = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/coach/swim-groups/${groupId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      onSuccess?.();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invitation';
      setError(message);
      onError?.(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendInvitation,
    isLoading,
    error,
  };
}