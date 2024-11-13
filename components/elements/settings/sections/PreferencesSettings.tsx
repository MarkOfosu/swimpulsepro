'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from '../SettingsDropdown.module.css';
import { SettingsProps } from '../../../../app/lib/types';

interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}

export default function PreferencesSettings({ onClose, onSave }: SettingsProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    theme: 'system'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setPreferences(data as UserPreferences);
      }
    } catch (err) {
      setError('Failed to load preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setSuccessMessage('Preferences saved successfully');
      if (onSave) onSave();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading preferences...</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionContent}>
      <h3 className={styles.sectionTitle}>Preferences</h3>
      
      {error && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      {successMessage && (
        <div className={styles.successAlert}>
          <span className={styles.successIcon}>✓</span>
          {successMessage}
        </div>
      )}
      
      <div className={styles.formSection}>
        <h4>Notifications</h4>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  emailNotifications: e.target.checked
                }))}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxCustom}></span>
            </div>
            <div className={styles.checkboxContent}>
              <span className={styles.checkboxTitle}>Email Notifications</span>
              <span className={styles.checkboxDescription}>
                Receive email updates about your activities and achievements
              </span>
            </div>
          </label>
          
          <label className={styles.checkboxLabel}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  pushNotifications: e.target.checked
                }))}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxCustom}></span>
            </div>
            <div className={styles.checkboxContent}>
              <span className={styles.checkboxTitle}>Push Notifications</span>
              <span className={styles.checkboxDescription}>
                Get instant notifications in your browser
              </span>
            </div>
          </label>
        </div>
      </div>

      <div className={styles.formSection}>
        <h4>Theme</h4>
        <div className={styles.themeSelector}>
          {(['light', 'dark', 'system'] as const).map((theme) => (
            <label
              key={theme}
              className={`${styles.themeOption} ${preferences.theme === theme ? styles.themeOptionSelected : ''}`}
            >
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={preferences.theme === theme}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  theme: e.target.value as UserPreferences['theme']
                }))}
                className={styles.themeInput}
              />
              <div className={styles.themeContent}>
                <span className={styles.themeIcon}>
                  {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '⚙️'}
                </span>
                <span className={styles.themeName}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button 
          className={styles.cancelButton}
          onClick={onClose}
          disabled={isSaving}
          type="button"
        >
          Cancel
        </button>
        <button
          className={`${styles.saveButton} ${isSaving ? styles.savingButton : ''}`}
          onClick={handleSave}
          disabled={isSaving}
          type="button"
        >
          {isSaving ? (
            <>
              <span className={styles.savingSpinner}></span>
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}