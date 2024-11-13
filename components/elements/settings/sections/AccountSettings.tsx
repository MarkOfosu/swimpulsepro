'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { accountService } from '../../../../app/services/accountService';
import styles from '../SettingsDropdown.module.css';
import { SettingsProps } from '../../../../app/lib/types';

export default function AccountSettings({ onClose }: Readonly<SettingsProps>) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');

  const validatePasswords = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswords()) return;

    setIsLoading(true);
    setError('');

    try {
      await accountService.changePassword({
        newPassword
      });

      toast.success('Password updated successfully');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Close the modal
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await accountService.resetPasswordForEmail(
        email,
        `${window.location.origin}/auth/reset-password`
      );

      toast.success('Password reset email sent. Please check your inbox.');
      setIsForgotPassword(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    return (
      <div className={styles.sectionContent}>
        <h3 className={styles.sectionTitle}>Reset Password</h3>
        
        <div className={styles.formSection}>
          <p className={styles.info}>
            Enter your email and we'll send you instructions to reset your password.
          </p>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button 
              className={styles.cancelButton}
              onClick={() => setIsForgotPassword(false)}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className={styles.saveButton}
              onClick={handlePasswordReset}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sectionContent}>
      <h3 className={styles.sectionTitle}>Account Settings</h3>
      
      <div className={styles.formSection}>
        <h4>Change Password</h4>
        
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <button
          className={styles.linkButton}
          onClick={() => setIsForgotPassword(true)}
        >
          Forgot your password?
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.buttonGroup}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={styles.saveButton}
            onClick={handlePasswordChange}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
}