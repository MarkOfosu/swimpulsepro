"use client";
import { signup } from './actions';
import React, { useState } from 'react';
import styles from '../../styles/RegisterForm.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';

const SignupForm = () => {
  const [role, setRole] = useState('coach'); // Default to coach
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Reset the password error on change
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    // Instant feedback for confirm password check
    if (password && e.target.value !== password) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData(e.target as HTMLFormElement);
  
    try {
      await signup(formData);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <>
      <WelcomeNavbar />
      <div className={styles.container}>
        <div className={styles.registerBox}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <select id="role" name="role" value={role} onChange={(e) => setRole(e.target.value)}>
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

            {/* Display the password mismatch error */}
            {passwordError && (
              <p style={{ color: 'red' }}>{passwordError}</p>
            )}

            <button
              type="submit"
              className={styles.btn}
              disabled={!!passwordError} // Convert string to boolean
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupForm;
