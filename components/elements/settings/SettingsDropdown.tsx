'use client';

import { useState, useRef, useEffect } from 'react';
import ProfileSettings from './sections/ProfileSettings';
import AccountSettings from './sections/AccountSettings';
import PreferencesSettings from './sections/PreferencesSettings';
import DeleteAccount from './DeleteAccount';
import styles from './SettingsDropdown.module.css';
import { useRouter } from 'next/navigation';

type SectionType = 'profile' | 'account' | 'preferences' | 'delete' | null;

const SettingsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setActiveSection(null);
  };

  const handleSectionClick = (section: SectionType) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSettings onClose={handleClose} />;
      case 'account':
        return <AccountSettings onClose={handleClose} />;
      case 'preferences':
        return <PreferencesSettings onClose={handleClose} />;
      case 'delete':
        return <DeleteAccount onClose={handleClose} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.iconButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdownModal}>
          <div className={styles.modalHeader}>
            <h3>Settings</h3>
            <button 
              className={styles.closeButton}
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          
          <div className={styles.modalContent}>
            <div className={styles.settingsList}>
              <button 
                className={`${styles.settingsItem} ${activeSection === 'profile' ? styles.active : ''}`}
                onClick={() => handleSectionClick('profile')}
              >
                <span className={styles.settingsIcon}>👤</span>
                Profile
              </button>
              
              <button 
                className={`${styles.settingsItem} ${activeSection === 'account' ? styles.active : ''}`}
                onClick={() => handleSectionClick('account')}
              >
                <span className={styles.settingsIcon}>🔐</span>
                Account 
              </button>
              
              <button 
                className={`${styles.settingsItem} ${activeSection === 'preferences' ? styles.active : ''}`}
                onClick={() => handleSectionClick('preferences')}
              >
                <span className={styles.settingsIcon}>⚙️</span>
                Preferences
              </button>
              
              <div className={styles.divider} />
              
              <button 
                className={`${styles.settingsItem} ${styles.deleteButton} ${activeSection === 'delete' ? styles.active : ''}`}
                onClick={() => handleSectionClick('delete')}
              >
                <span className={styles.settingsIcon}>🗑️</span>
                Delete Account
              </button>
            </div>

            {activeSection && (
              <div className={styles.settingsContent}>
                {renderContent()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;