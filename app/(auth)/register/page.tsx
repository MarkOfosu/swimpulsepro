import React from 'react';
import styles from '../../styles/RegisterForm.module.css';

const RegisterForm = () => {
  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h2>Register</h2>
        <form action="#"> 
          <div className={styles.inputBox}>
            <input type="text" required />
            <label>First Name</label>
          </div>
          <div className={styles.inputBox}>
            <input type="text" required />
            <label>Last Name</label>
          </div>
          <div className={styles.inputBox}>
            <input type="text" required />
            <label>Swim Team</label>
          </div>
          <div className={styles.inputBox}>
            <input type="text" required />
            <label> Swim Team Location</label>
          </div>
          <div className={styles.inputBox}>
            <input type="email" required />
            <label>Email</label>
          </div>
          <div className={styles.inputBox}>
            <input type="password" required />
            <label>Password</label>
          </div>
          <button type="submit" className={styles.btn}>Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
