// LoginForm.jsx
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from '../../styles/LoginForm.module.css';


const LoginForm: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <form action="#">
          <div className={styles.inputBox}>
            <input type="email" required />
            <label>Email</label>
          </div>
          <div className={styles.inputBox}>
            <input type="password" required />
            <label>Password</label>
          </div>
          <div className={styles.forgotPassword}>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className={styles.btn}>Login</button>
          <div className={styles.signupLink}>
            <a href="#">Signup</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
