'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase } from '../utils/supabaseClient';

const SignInForm: React.FC = () => {
  const [team, setTeam] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    // const { error } = await supabase.auth.signIn({ email, password });
    // if (!error) {
    //   router.push('/coach'); // Redirect to the coach route after successful sign-in
    // } else {
    //   alert('Sign in failed. Please check your credentials.');
    // }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <select value={team} onChange={(e) => setTeam(e.target.value)}>
        {/* Options should be fetched from the database */}
        <option value="">Select Team</option>
        <option value="team1">Team 1</option>
        <option value="team2">Team 2</option>
      </select>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}

export default SignInForm;
