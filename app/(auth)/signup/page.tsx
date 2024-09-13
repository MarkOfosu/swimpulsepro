"use client";
import { signup } from './actions';
import React, { useState } from 'react';
import styles from '../../styles/RegisterForm.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import Loader from '../../../components/ui/Loader';

const SignupForm = () => {
  const [role, setRole] = useState('coach'); // Default to coach
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState(''); // To store the signup error from the server
  const [loading, setLoading] = useState(false); // Loading state

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    setSignupError(''); // Reset signup errors when switching roles
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError(''); // Reset the error state
    setLoading(true); // Show loader during the signup process

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const response = await signup(formData);

      if (response.error) {
        setSignupError(response.error); // Show the error on the form
        setLoading(false); // Hide the loader
      } else {
        // Store tokens in localStorage if available
        const { accessToken, refreshToken, expiresAt } = response;
        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('tokenExpiry', expiresAt ? expiresAt.toString() : '');
        }

        // Redirect to the dashboard based on role
        if (role === 'coach') {
          window.location.href = 'user/coach/dashboard';
        } else {
          window.location.href = 'user/swimmer/dashboard';
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setSignupError('An unexpected error occurred. Please try again.');
      setLoading(false); // Hide the loader
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
            <form onSubmit={handleSubmit}>
              <div className={styles.inputBox}>
                <select id="role" name="role" value={role} onChange={handleRoleChange}>
                  <option value="coach">Coach</option>
                  <option value="swimmer">Swimmer</option>
                </select>
                <label>Register as:</label>
              </div>

              <h2>{role === 'coach' ? 'Coach' : 'Swimmer'} Registration</h2>

              <div className={styles.inputBox}>
                <input type="text" id="firstName" name="firstName" required />
                <label>First Name</label>
              </div>

              <div className={styles.inputBox}>
                <input type="text" id="lastName" name="lastName" required />
                <label>Last Name</label>
              </div>

              {role === 'coach' && (
                <>
                  <div className={styles.inputBox}>
                    <input type="text" id="swimTeam" name="swimTeam" required />
                    <label>Swim Team</label>
                  </div>

                  <div className={styles.inputBox}>
                    <input type="text" id="swimTeamLocation" name="swimTeamLocation" required />
                    <label>Swim Team Location</label>
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
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                />
                <label>Email</label>
              </div>

              <div className={styles.inputBox}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <label>Password</label>
              </div>

              <div className={styles.inputBox}>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <label>Confirm Password</label>
              </div>

              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
              {signupError && <p style={{ color: 'red' }}>{signupError}</p>}

              <button
                type="submit"
                className={styles.btn}
                disabled={!!passwordError}
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupForm;
