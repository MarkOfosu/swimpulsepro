import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SwimGroup } from '@/app/lib/types';

export function useSwimGroups() {
  const [groups, setGroups] = useState<SwimGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if user is logged in
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Not authenticated');
      }

      // Fetch groups through the API
      const response = await fetch('/api/coach/swim-groups', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch swim groups');
      }

      const data = await response.json();
      setGroups(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch swim groups';
      setError(errorMessage);
      console.error('Error fetching swim groups:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, isLoading, error, fetchGroups };

}