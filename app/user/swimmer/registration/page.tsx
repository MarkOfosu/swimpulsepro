'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const SwimmerRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('group');
  const [groupInfo, setGroupInfo] = useState({ teamName: '', groupName: '', coachName: '' });

  useEffect(() => {
    // Fetch group information based on groupId from backend
    // Example: fetch(`/api/swim-groups/${groupId}`)
    // Set the group information in state
    setGroupInfo({ teamName: 'Example Team', groupName: 'Example Group', coachName: 'Coach Name' });
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Submit swimmer registration data to supabase
    // fetch('/api/register/swimmer', { method: 'POST', body: JSON.stringify({ ... }) })

    router.push('/swimmer/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join {groupInfo.groupName} under {groupInfo.teamName}</h2>
      <p>Coach: {groupInfo.coachName}</p>
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
      <button type="submit">Join Swim Group</button>
    </form>
  );
};

export default SwimmerRegistration;
