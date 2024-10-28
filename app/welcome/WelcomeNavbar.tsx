
// components/WelcomeNavbar.tsx
'use client'
import logo from '../../public/image/logo.png';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/WelcomePage.module.css';

const WelcomeNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image
            src={logo}
            alt="SwimPulsePro Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
           <span className={styles.logoText}>SwimPulsePro</span>
        </Link>
       
      </div>

      {/* <div className={styles.navLinks}>
        <Link href="/features" className={styles.link}>
          Features
        </Link>
        <Link href="/pricing" className={styles.link}>
          Pricing
        </Link>
        <Link href="/about" className={styles.link}>
          About
        </Link>
      </div> */}

      <div className={styles.authButtons}>
        <Link href="/auth/login">
          <button className={styles.loginButton}>Login</button>
        </Link>
        <Link href="/getStarted">
          <button className={styles.signupButton}>Sign up</button>
        </Link>
      </div>
    </nav>
  );
};

export default WelcomeNavbar;
