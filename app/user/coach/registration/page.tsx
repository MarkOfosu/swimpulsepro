'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CoachRegistration: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamAddress, setTeamAddress] = useState('');
  const [teamCity, setTeamCity] = useState('');
  const [teamCountry, setTeamCountry] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCoach, setIsCoach] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Submit registration form data to db - supabase
    //  fetch('/api/register', { method: 'POST', body: JSON.stringify({ ... }) })

    router.push('/coach/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Your Team</h2>
      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
      <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" required />
      <input type="text" value={teamAddress} onChange={(e) => setTeamAddress(e.target.value)} placeholder="Team Address" required />
      <input type="text" value={teamCity} onChange={(e) => setTeamCity(e.target.value)} placeholder="Team City" required />
      <input type="text" value={teamCountry} onChange={(e) => setTeamCountry(e.target.value)} placeholder="Team Country" required />
      <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="Admin Email" required />
      <input type="tel" value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} placeholder="Admin Phone" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
      <label>
        Are you also a swim coach?
        <input type="checkbox" checked={isCoach} onChange={(e) => setIsCoach(e.target.checked)} />
      </label>
      <button type="submit">Register Team</button>
    </form>
  );
};

export default CoachRegistration;
