'use client';
import React, { useEffect } from 'react';
import SectionHeader from '@components/nav/SectionHeader';
import { useRouter } from 'next/navigation';
import LoginForm from './(auth)/signin/page';
import { sign } from 'crypto';
import WelcomePage from './welcome/page';
import Sidebar from '@components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';

const HomePage: React.FC = () => {
  const router = useRouter();

  // const handleSignIn = () => {
  //   router.push('/signin');
  // };

  // const handleRegisterCoach = () => {
  //   router.push('/register');
  // };

  return (
    <div>
        <WelcomePage />
    </div>
  );
}

export default HomePage;