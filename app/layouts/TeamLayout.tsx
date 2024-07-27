'use client';
import React from 'react';
import { LayoutProvider } from '../../context/LayoutContext';
import ContentRootLayout from '../layouts/ContentRootlayout';


const TeamLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export default TeamLayout;