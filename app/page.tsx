'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomePage from './welcome/page';

const HomePage: React.FC = () => {
  const router = useRouter();

  return (
    <div>
        <WelcomePage />
    </div>
  );
}

export default HomePage;