// 'use client';
import React from 'react';
import ContentNavBar from '@components/nav/ContentNavBar';
import '../globals.css';
import Sidebar from '@components/nav/SideBar';
import BottomNav from '@components/nav/BottomNav';


interface ContentRootLayoutProps {
  links: { href: string; label: string }[];
  children: React.ReactNode;
}

const ContentRootLayout: React.FC<ContentRootLayoutProps> = ({ links, children }) => {
  return (

    <div className="content-layout">
      <ContentNavBar links={links} />
      
      <div className="content-main">
        <Sidebar />
        {children}
        <BottomNav />
      </div>
    </div>

  );
}

export default ContentRootLayout;
