"use client"; 
import { login} from './actions';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styles from '../../styles/LoginForm.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const route = useRouter();
  

    const handleSignup = () => {
        route.push('/signup');
    }

  return (
    <>
    <WelcomeNavbar />
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Login</h2>
          <form>
            <div className={styles.inputBox}>
              <input
                id="email"
                name="email"
                type="email"
                required
              />
              <label>Email</label>
            </div>
            <div className={styles.inputBox}>
              <input
                id="password"
                name="password"
                type="password"
                required
              />
              <label>Password</label>
            </div>
            <div className={styles.forgotPassword}>
              <a href="#">Forgot Password?</a>
            </div>
            <button formAction={login} className={styles.btn}>Log in</button>
          </form>
          <div className={styles.signupLink}>
              <button onClick={handleSignup} className={styles.signUpBtn}>Sign up</button>
            </div>
        </div>
      </div>
    </>
  );
}
