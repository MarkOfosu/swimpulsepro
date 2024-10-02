'use client';

import React, { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@components/ui/toasts/Toast';
import styles from '../../../../styles/CreateSwimGroup.module.css';

interface CreateSwimGroupProps {
  onGroupCreated?: () => void;
}

const CreateSwimGroup: React.FC<CreateSwimGroupProps> = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  const generateGroupCode = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
  
    try {
      setIsSubmitting(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError || !user) {
        throw new Error('Unable to fetch user information');
      }
  
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select('id')
        .eq('id', user.id)
        .single();
  
      if (coachError || !coachData) {
        throw new Error('Coach not found. Please try again.');
      }

      const groupCode = generateGroupCode();

      const { data, error } = await supabase
        .from('swim_groups')
        .insert({
          name: groupName,
          description: description,
          coach_id: coachData.id,
          group_code: groupCode,
        })
        .select()
        .single();
  
      if (error) throw error;

      showToast(`Swim group created successfully. Group Code: ${groupCode}`, 'success');
      setGroupName('');
      setDescription('');
      
      if (onGroupCreated) {
        onGroupCreated();
      }
    } catch (error) {
      console.error('Error creating swim group:', error);
      showToast('Failed to create swim group. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.createSwimGroupContainer}>
      <form onSubmit={handleSubmit} className={styles.createSwimGroupForm}>
        <h2 className={styles.formTitle}>Create Swim Group</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Swim Group Name"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className={styles.textarea}
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Group'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateSwimGroup;