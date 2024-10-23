// components/SignupForm.tsx
'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/RegisterForm.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import Loader from '../../../components/elements/Loader';
import { useRouter } from 'next/navigation';
import { useUser } from '@app/context/UserContext';

interface SignupFormProps {
  role: 'coach' | 'swimmer';
}

const SignupForm: React.FC<SignupFormProps> = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {refreshUser} = useUser();

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const calculateAgeGroup = (dateOfBirth: string): string => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age <= 10) return '10 & under';
    if (age <= 12) return '11-12';
    if (age <= 14) return '13-14';
    if (age <= 16) return '15-16';
    return '17-18';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const supabase = createClient();

    try {
      const firstName = capitalizeFirstLetter(formData.get('firstName') as string);
      const lastName = capitalizeFirstLetter(formData.get('lastName') as string);
      const email = (formData.get('email') as string).toLowerCase();
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      const gender = formData.get('gender') as string;

      if (!firstName || !lastName || !email || !password || !confirmPassword || !gender) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      let additionalData: any = { gender };
      if (role === 'coach') {
        const swimTeam = capitalizeFirstLetter(formData.get('swimTeam') as string);
        const city = capitalizeFirstLetter(formData.get('city') as string);
        const country = capitalizeFirstLetter(formData.get('country') as string);
        if (!swimTeam || !city || !country) {
          throw new Error('Swim team, city, and country are required for coaches');
        }
        additionalData = { 
          ...additionalData,
          swim_team: swimTeam, 
          swim_team_location: `${city}, ${country}`
        };
      } else {
        const dateOfBirth = formData.get('dateOfBirth') as string;
        if (!dateOfBirth) {
          throw new Error('Date of birth is required for swimmers');
        }
        const formattedDate = new Date(dateOfBirth).toISOString().split('T')[0];
        const ageGroup = calculateAgeGroup(formattedDate);
        additionalData = { 
          ...additionalData,
          date_of_birth: formattedDate,
          age_group: ageGroup,
          last_age_group_update: new Date().toISOString().split('T')[0]
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
            ...additionalData,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        localStorage.setItem('accessToken', data.session.access_token);
        localStorage.setItem('refreshToken', data.session.refresh_token);
        localStorage.setItem('tokenExpiry', data.session.expires_at?.toString() || '');
        //refresh usecontext to fetch user data
        refreshUser();
        router.push(role === 'coach' ? '/user/coach/dashboard' : '/user/swimmer/dashboard');
      } else {
        setError('Signup successful. Please check your email to confirm your account.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WelcomeNavbar />
      <div className={styles.container}>
        <div className={styles.registerBox}>
          {loading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2 className={styles.title}>
                {role === 'coach' ? 'Coach' : 'Swimmer'} Registration
              </h2>

              <div className={styles.formGrid}>
                <div className={styles.inputBox}>
                  <input type="text" id="firstName" name="firstName" required />
                  <label>First Name</label>
                </div>

                <div className={styles.inputBox}>
                  <input type="text" id="lastName" name="lastName" required />
                  <label>Last Name</label>
                </div>

                <div className={styles.inputBox}>
                  <select id="gender" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label>Gender</label>
                </div>

                {role === 'coach' && (
                  <>
                    <div className={styles.inputBox}>
                      <input type="text" id="swimTeam" name="swimTeam" required />
                      <label>Swim Team</label>
                    </div>

                    <div className={styles.inputBox}>
                      <input type="text" id="city" name="city" required />
                      <label>City</label>
                    </div>

                    <div className={styles.inputBox}>
                      <input type="text" id="country" name="country" required />
                      <label>Country</label>
                    </div>
                  </>
                )}

                {role === 'swimmer' && (
                  <div className={styles.inputBox}>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" required />
                    <label>Date of Birth</label>
                  </div>
                )}

                <div className={styles.inputBox}>
                  <input type="email" id="email" name="email" required />
                  <label>Email</label>
                </div>

                <div className={styles.inputBox}>
                  <input type="password" id="password" name="password" required />
                  <label>Password</label>
                </div>

                <div className={styles.inputBox}>
                  <input type="password" id="confirmPassword" name="confirmPassword" required />
                  <label>Confirm Password</label>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submitButton}>
                Register as {role === 'coach' ? 'Coach' : 'Swimmer'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupForm;