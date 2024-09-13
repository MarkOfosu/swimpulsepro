'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@components/ui/toasts/Toast';  // Assuming this is your custom toast hook

const CreateSwimGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { showToast, ToastContainer } = useToast(); // Importing toast functions

  // Supabase client with auth
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      setErrorMessage('Unable to fetch user information');
      showToast('Unable to fetch user information', 'error'); // Show error toast
      return;
    }
  
    // Fetch the coach's ID from the coaches table using the user_id
    const { data: coachData, error: coachError } = await supabase
      .from('coaches')
      .select('id')
      .eq('id', user.id)  // Use user.id to fetch the coach's ID
      .single();
  
    if (coachError || !coachData) {
      console.error('Error fetching coach ID:', coachError);
      setErrorMessage('Coach not found. Please try again.');
      showToast('Coach not found. Please try again.', 'error'); // Show error toast
      return;
    }

  
    // Insert swim group with the correct coach_id
    const { data, error } = await supabase
      .from('swim_groups')
      .insert([
        {
          name: groupName,
          description: description,
          coach_id: coachData.id,  // Use the coach's ID, not the user ID
        }
      ]);
  
    if (error) {
      console.error('Error creating swim group:', error);
      setErrorMessage('Failed to create swim group. Please try again.');
      showToast('Failed to create swim group. Please try again.', 'error'); // Show error toast
    } else {
      showToast('Swim group created successfully', 'success'); // Show success toast
      setDescription('');
      setGroupName('');
      setErrorMessage('')
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create Swim Group</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Swim Group Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Create Group</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>

      {/* Toast container to show notifications */}
      <ToastContainer />
    </div>
  );
};

export default CreateSwimGroup;
