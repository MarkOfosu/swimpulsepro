'use client';

import { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import MobileSettingsView from './MobileSettingsView';

interface MobileSettingsButtonProps {
  className?: string;
  icon?: React.ReactNode;
}

const MobileSettingsButton = ({ className, icon }: MobileSettingsButtonProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <button 
        className={className}
        onClick={() => setIsSettingsOpen(true)}
      >
        {icon || <FaCog />}
        <span>Settings</span>
      </button>

      <MobileSettingsView 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default MobileSettingsButton;