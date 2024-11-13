'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@utils/supabase/client';
import styles from '../SettingsDropdown.module.css';
import { SettingsProps } from '../../../../app/lib/types';
import { UserData, getUserDetails } from '../../../../app/api/getUserDetails';

interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
}

export default function ProfileSettings({ onClose, onSave }: SettingsProps) {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getUserDetails();
      if (userData) {
        // Format date to YYYY-MM-DD if it exists
        if (userData.date_of_birth) {
          userData.date_of_birth = new Date(userData.date_of_birth);
        }
        setProfile(userData);
      }
    } catch (error) {
      setErrorMessage('Failed to load profile data');
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!profile?.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!profile?.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!profile?.gender) {
      newErrors.gender = 'Please select a gender';
    }
    if (profile?.role === 'swimmer' && !profile?.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required for swimmers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!profile) return;
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      setErrorMessage('Please fix the errors before saving');
      return;
    }
    
    setIsSaving(true);
    try {
      const updates = {
        first_name: profile.first_name?.trim(),
        last_name: profile.last_name?.trim(),
        gender: profile.gender,
        updated_at: new Date().toISOString(),
        ...(profile.role === 'swimmer' && {
          date_of_birth: profile.date_of_birth
        })
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      setSuccessMessage('Profile updated successfully');
      if (onSave) onSave();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionContent}>
      <h3 className={styles.sectionTitle}>Profile Settings</h3>
      
      {errorMessage && (
        <div className={styles.errorAlert}>
          <span className={styles.errorIcon}>!</span>
          {errorMessage}
        </div>
      )}
      
      <div className={styles.formSection}>
        <h4>Personal Information</h4>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={profile?.first_name || ''}
            onChange={(e) => {
              setProfile(prev => prev ? { ...prev, first_name: e.target.value } : null);
              setErrors(prev => ({ ...prev, first_name: undefined }));
            }}
            className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
          />
          {errors.first_name && <span className={styles.fieldError}>{errors.first_name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={profile?.last_name || ''}
            onChange={(e) => {
              setProfile(prev => prev ? { ...prev, last_name: e.target.value } : null);
              setErrors(prev => ({ ...prev, last_name: undefined }));
            }}
            className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`}
          />
          {errors.last_name && <span className={styles.fieldError}>{errors.last_name}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={profile?.email || ''}
            disabled
            className={`${styles.input} ${styles.disabled}`}
          />
          <small className={styles.helperText}>Email cannot be changed</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={profile?.gender || ''}
            onChange={(e) => {
              setProfile(prev => prev ? { ...prev, gender: e.target.value } : null);
              setErrors(prev => ({ ...prev, gender: undefined }));
            }}
            className={`${styles.select} ${errors.gender ? styles.inputError : ''}`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className={styles.fieldError}>{errors.gender}</span>}
        </div>

        {profile?.role === 'swimmer' && (
          <div className={styles.formGroup}>
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                setProfile(prev => prev ? { ...prev, date_of_birth: new Date(e.target.value) } : null);
                setErrors(prev => ({ ...prev, date_of_birth: undefined }));
              }}
              className={`${styles.input} ${errors.date_of_birth ? styles.inputError : ''}`}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
            {errors.date_of_birth && <span className={styles.fieldError}>{errors.date_of_birth}</span>}
          </div>
        )}
      </div>

      <div className={styles.formSection}>
        <h4>{profile?.role === 'swimmer' ? 'Team Information' : 'Organization Information'}</h4>
        {profile?.role === 'swimmer' ? (
          <>
            <div className={styles.formGroup}>
              <label>Current Group</label>
              <input
                type="text"
                value={profile.group_name || 'Not Assigned'}
                disabled
                className={`${styles.input} ${styles.disabled}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Coach</label>
              <input
                type="text"
                value={profile.coach_first_name && profile.coach_last_name 
                  ? `${profile.coach_first_name} ${profile.coach_last_name}`
                  : 'Not Assigned'}
                disabled
                className={`${styles.input} ${styles.disabled}`}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label>Team</label>
              <input
                type="text"
                value={profile?.team_name || 'Not Assigned'}
                disabled
                className={`${styles.input} ${styles.disabled}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type="text"
                value={profile?.team_location || 'Not Set'}
                disabled
                className={`${styles.input} ${styles.disabled}`}
              />
            </div>
          </>
        )}
      </div>
      {successMessage && (
        <div className={styles.successAlert}>
          <span className={styles.successIcon}>✓</span>
          {successMessage}
        </div>
      )}
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