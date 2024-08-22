"use client"; 
import { signup } from './actions';
import React from 'react';
import styles from '../../styles/RegisterForm.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';

const signupForm = () => {
  return (
    <>
      <WelcomeNavbar />
      <div className={styles.container}>
        <div className={styles.registerBox}>
          <h2>Register</h2>
          <form>
            {/* <div className={styles.inputBox}>
              <input type="text" id="firstName" name="firstName" required />
              <label>First Name</label>
            </div>
            <div className={styles.inputBox}>
              <input type="text" id="lastName" name="lastName" required />
              <label>Last Name</label>
            </div>
            <div className={styles.inputBox}>
              <input type="text" id="swimTeam" name="swimTeam" required />
              <label>Swim Team</label>
            </div>
            <div className={styles.inputBox}>
              <input type="text" id="swimTeamLocation" name="swimTeamLocation" required />
              <label>Swim Team Location</label>
            </div> */}
            <div className={styles.inputBox}>
              <input type="email" id="email" name="email" required />
              <label>Email</label>
            </div>
            <div className={styles.inputBox}>
              <input type="password" id="password" name="password" required />
              <label>Password</label>
            </div>
            <button formAction={signup} className={styles.btn}>Register</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default signupForm ;
