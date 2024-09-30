'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@components/ui/Toast';
import styles from '../../../../styles/CreateSwimGroup.module.css';

const CreateSwimGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      setErrorMessage('Unable to fetch user information');
      showToast('Unable to fetch user information', 'error');
      return;
    }
  
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('id')
      .eq('id', user.id)
      .single();
  
    if (coachError || !coachData) {
      console.error('Error fetching coach ID:', coachError);
      setErrorMessage('Coach not found. Please try again.');
      showToast('Coach not found. Please try again.', 'error');
      return;
    }

    const { data, error } = await supabase
      .from('swim_groups')
      .insert([
        {
          name: groupName,
          description: description,
          coach_id: coachData.id,
        }
      ]);
  
    if (error) {
      console.error('Error creating swim group:', error);
      setErrorMessage('Failed to create swim group. Please try again.');
      showToast('Failed to create swim group. Please try again.', 'error');
    } else {
      showToast('Swim group created successfully', 'success');
      setDescription('');
      setGroupName('');
      setErrorMessage('');
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
        <button type="submit" className={styles.submitButton}>Create Group</button>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateSwimGroup;