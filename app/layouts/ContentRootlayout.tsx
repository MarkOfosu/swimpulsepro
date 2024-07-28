'use client';
import React from 'react';
import ContentNavBar from '@/components/ContentNavBar';
import '@styles/globals.css';



const ContentRootLayout: React.FC<{ links: { href: string; label: string }[]; children: React.ReactNode }> = ({ links, children }) => {
  return (
      <div className="content-layout">
        <ContentNavBar links={links} />
        <div className="content-main">
          {children}
        </div>
      </div>
  );
}


export default ContentRootLayout;


