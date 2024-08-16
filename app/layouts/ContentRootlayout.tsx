'use client';
import React, { useState } from 'react';
import ContentNavBar from '@components/nav/ContentNavBar';
import '../globals.css';
import Sidebar from '@components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';
import { FaBars, FaHome, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import CollapsibleNav from '@components/nav/CollapsibleNav';

interface ContentRootLayoutProps {
  links: { href: string; label: string }[];
  children: React.ReactNode;
}

const ContentRootLayout: React.FC<ContentRootLayoutProps> = ({ links, children }) => {
  const userRole = 'coach' || 'swimmer'; // This should be dynamically set
  const isAdmin = true; // This should be dynamically set

  return (
    <div className="content-layout">
      <CollapsibleNav userRole={userRole} isAdmin={isAdmin} />
      <ContentNavBar links={links} />
      <div className="content-main">
        <Sidebar />
        {children}
        <BottomNav />
      </div>
    </div>
  );
};

export default ContentRootLayout;