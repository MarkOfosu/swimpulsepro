'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CoachPageLayout from '../../page';

const AddSwimmer: React.FC = () => {
  const [swimmerName, setSwimmerName] = useState('');
  const [swimmerEmail, setSwimmerEmail] = useState('');
  const [groupId, setGroupId] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Submit swimmer data to supabase
    // fetch('/api/swimmers', { method: 'POST', body: JSON.stringify({ ... }) })

    router.push('/coach/dashboard');
  };

  const generateLink = () => {
    // Generate a registration link for the swim group
    const link = `${window.location.origin}/register/swimmer?group=${groupId}`;
    alert(`Registration link: ${link}`);
  };

  return (
    <CoachPageLayout>
      <form onSubmit={handleSubmit}>
        <h2>Add Swimmer</h2>
        <input type="text" value={swimmerName} onChange={(e) => setSwimmerName(e.target.value)} placeholder="Swimmer Name" required />
        <input type="email" value={swimmerEmail} onChange={(e) => setSwimmerEmail(e.target.value)} placeholder="Swimmer Email" required />
        <button type="submit">Add Swimmer</button>
      </form>
      <div>
        <h2>Generate Registration Link</h2>
        <input type="text" value={groupId} onChange={(e) => setGroupId(e.target.value)} placeholder="Swim Group ID" required />
        <button onClick={generateLink}>Generate Link</button>
      </div>
    </CoachPageLayout>
  );
};

export default AddSwimmer;
