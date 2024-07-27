// context/LayoutContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface LayoutContextProps {
  links: { href: string; label: string }[];
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode; links: { href: string; label: string }[] }> = ({
  children,
  links,
}) => {
  return <LayoutContext.Provider value={{ links }}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
