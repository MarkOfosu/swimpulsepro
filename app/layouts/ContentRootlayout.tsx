'use client';
import React from 'react';
import { useLayout } from '../../context/LayoutContext';
import ContentNavBar from '@/components/ContentNavBar';
import '@styles/globals.css';
import { LayoutProvider } from '@/context/LayoutContext';



interface ContentRootLayoutProps {
  links: { href: string; label: string }[];
  children: React.ReactNode;
}

const ContentRootLayout: React.FC<ContentRootLayoutProps> = ({ links, children }) => {
  return (
    <LayoutProvider links={links}>
      <div className="content-layout">
        <ContentNavBar links={links} />
        <div className="content-main">{children}</div>
      </div>
    </LayoutProvider>
  );
};

export default ContentRootLayout;

