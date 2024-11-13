'use client';

import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import styles from './MobileSettingsView.module.css';
import ProfileSettings from '../sections/ProfileSettings';
import AccountSettings from '../sections/AccountSettings';
import PreferencesSettings from '../sections/PreferencesSettings';
import DeleteAccount from '../DeleteAccount';
// import DeleteAccount from '../sections/DeleteAccount';

type Tab = 'profile' | 'account' | 'preferences' | 'delete';

interface MobileSettingsViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSettingsView = ({ isOpen, onClose }: MobileSettingsViewProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: '👤' },
    { id: 'account' as Tab, label: 'Account', icon: '🔐' },
    { id: 'preferences' as Tab, label: 'Preferences', icon: '⚙️' },
    { id: 'delete' as Tab, label: 'Delete', icon: '🗑️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings onClose={onClose} />;
      case 'account':
        return <AccountSettings onClose={onClose} />;
      case 'preferences':
        return <PreferencesSettings onClose={onClose} />;
      case 'delete':
        return <DeleteAccount onClose={onClose} />;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={onClose}
        >
          <FaChevronLeft />
          <span>Back</span>
        </button>
        <h1>Settings</h1>
      </header>

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''} ${
              tab.id === 'delete' ? styles.deleteTab : ''
            }`}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MobileSettingsView;