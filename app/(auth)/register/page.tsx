'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase } from '../utils/supabaseClient';

const RegisterTeamForm: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [coachName, setCoachName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
//     const { data, error } = await supabase
//       .from('teams')
//       .insert([{ name: teamName }])
//       .select();
    
//     if (data && data.length > 0) {
//       const teamId = data[0].id;
//       const { error: coachError } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             team_id: teamId,
//             name: coachName,
//           },
//         },
//       });

//       if (!coachError) {
//         router.push('/team'); // Redirect to the team route after successful registration
//       } else {
//         alert('Team registration failed. Please try again.');
//       }
//     }
  };

  return (
    <div>
      <h1>Register a Team</h1>
      <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Team Name" />
      <input type="text" value={coachName} onChange={(e) => setCoachName(e.target.value)} placeholder="Coach Name" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterTeamForm;
