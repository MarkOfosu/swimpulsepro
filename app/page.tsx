'use client';
import React, { useEffect } from 'react';
import SectionHeader from '@components/nav/SectionHeader';
import { useRouter } from 'next/navigation';
import LoginForm from './(auth)/signin/page';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleDOMContentLoaded = () => {
      const text = document.getElementById('welcome-to-swimpulsepro');
      if (text) {
        text.innerHTML = text.textContent
          ?.split('')
          .map((char, index) => `<span style="--i:${index}">${char}</span>`)
          .join('') ?? '';
      }
    };

    if (document.readyState === 'complete') {
      handleDOMContentLoaded();
    } else {
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
      return () => document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    }
  }, []);

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleRegisterCoach = () => {
    router.push('/register');
  };

  return (
    <div>
    <div id="welcome-container">
      <h1 id="welcome-to-swimpulsepro">SwimPulsePro</h1>
      <p>Where every stroke counts!</p>
      
      {/* <LoginForm /> */}
    </div>
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleRegisterCoach}>Register as Coach</button>
      <button onClick={() => router.push('/register')}>Join your swim coach</button>
  </div>
  </div>
  );
};

export default HomePage;
