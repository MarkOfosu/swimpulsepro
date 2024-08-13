'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateSwimGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Submit swim group creation data to the backend
    //fetch('/api/swim-groups', { method: 'POST', body: JSON.stringify({ ... }) })

    router.push('/coach/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Swim Group</h2>
      <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Swim Group Name" required />
      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateSwimGroup;
