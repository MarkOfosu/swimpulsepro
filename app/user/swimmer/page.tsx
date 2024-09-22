"use client";
import React, { ReactNode, useEffect } from 'react';
import ContentRootLayout from '@app/layouts/ContentRootlayout';
import { getUserDetails } from '../../lib/getUserDetails';
import Loader from '@components/ui/Loader';

interface SwimPageLayoutProps {
  children: ReactNode;
}



const SwimPageLayout: React.FC<SwimPageLayoutProps> = ({ children }) => {
  // const [user, setUser] = React.useState<any>(null);
  // const [error, setError] = React.useState<string | null>(null); // For error handling

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const userData = await getUserDetails();
  //       console.log("Fetched user data:", userData); // Log the full user data
  //       setUser(userData);
  //     } catch (err) {
  //       console.error('Error fetching user data:', err);
  //       setError('Failed to load user details.');
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // // If user data is still being fetched
  // if (!user && !error) {
  //   return <Loader />;
  // }
  const links = [
    { href: '/user/swimmer/dashboard', label: 'Dashboard' },
    { href: '/user/swimmer/swimmerProfile', label: 'Profile' },
  ];

  return (
    <ContentRootLayout links={links}>
      {children}
    </ContentRootLayout>
  );
};

export default SwimPageLayout;
