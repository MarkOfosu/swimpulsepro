// app/(auth)/signin/LoginForm.tsx
"use client"; 

import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from '../../styles/LoginForm.module.css';
import { useRouter } from 'next/navigation';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';

const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<'coach' | 'swimmer'>('swimmer');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (role === 'coach') {
      router.push('/coach/dashboard');
    } else if (role === 'swimmer') {
      router.push('/swimmer/dashboard');
    }
  };

  return (
    <>
    <WelcomeNavbar />
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
    </>
  );
};

export default LoginForm;
