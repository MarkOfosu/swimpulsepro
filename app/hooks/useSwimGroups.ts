// hooks/useSwimGroups.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SwimGroup } from '@app/lib/types';

interface CreateGroupData {
  name: string;
  description?: string;
  group_code?: string;
}

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

  // New functionality
  const createGroup = async (groupData: CreateGroupData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/coach/swim-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create swim group');
      }

      const newGroup = await response.json();
      setGroups(prev => [...prev, newGroup]);
      return newGroup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create swim group';
      setError(errorMessage);
      console.error('Error creating swim group:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getGroupById = useCallback((groupId: string) => {
    return groups.find(group => group.id === groupId);
  }, [groups]);

  const getGroupByName = useCallback((groupName: string) => {
    return groups.find(group => group.name === groupName);
  }, [groups]);

  const updateGroup = async (groupId: string, updateData: Partial<CreateGroupData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/coach/swim-groups/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update swim group');
      }

      const updatedGroup = await response.json();
      setGroups(prev => prev.map(group => 
        group.id === groupId ? updatedGroup : group
      ));
      return updatedGroup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update swim group';
      setError(errorMessage);
      console.error('Error updating swim group:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    isLoading,
    error,
    fetchGroups,
    // New additions
    createGroup,
    getGroupById,
    getGroupByName,
    updateGroup,
  };
}

// Example usage remains the same for existing code:
// const { groups, isLoading, error } = useSwimGroups();

// New functionality can be used optionally:
// const { createGroup, getGroupById, updateGroup } = useSwimGroups();