'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@utils/supabase/client';
import { accountService } from '../../../app/services/accountService';
import { DELETION_REASONS, DeletionReason } from '../../../app/lib/constants';
import styles from './SettingsDropdown.module.css';

interface DeleteAccountProps {
  onClose: () => void;
}

export default function DeleteAccount({ onClose }: DeleteAccountProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletionReason, setDeletionReason] = useState<DeletionReason | ''>('');
  const [otherReason, setOtherReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const validateForm = () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return false;
    }

    if (!deletionReason) {
      setError('Please select a reason for deletion');
      return false;
    }

    if (deletionReason === 'other' && !otherReason.trim()) {
      setError('Please provide a reason for deletion');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDelete = async () => {
    if (!validateForm()) return;
    if (!deletionReason) return;

    setIsDeleting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      await accountService.deleteAccount({
        userId: user.id,
        email: user.email || '',
        reasonType: deletionReason,
        reasonDetails: deletionReason === 'other' ? otherReason : undefined
      });

      setIsSuccess(true);

      setTimeout(() => {
        onClose();
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      let errorMessage = 'Failed to delete account';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes('deletion_reason_type')) {
          errorMessage = 'Invalid deletion reason. Please try again.';
        } else if (err.message.includes('User not allowed')) {
          errorMessage = 'You do not have permission to delete this account. Please contact support.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.deleteSection}>
        <div className={styles.successContainer}>
          <h4 className={styles.successHeader}>Account Deleted Successfully</h4>
          <div className={styles.successMessage}>
            <p>Your account has been successfully deleted.</p>
            <p>You will be automatically redirected to the login page in a few seconds.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.deleteSection}>
      <div className={styles.deleteHeader}>
        <h4>Delete Account</h4>
        <br></br>
        <button 
          onClick={onClose}
          className={styles.closeModalButton}
        >
          ×
        </button>
      </div>
      
      <div className={styles.warningBox}>
        <div className={styles.warningHeader}>
          Warning: This action cannot be undone
        </div>
        <p>This will permanently delete:</p>
        <ul>
          <li>Your profile information</li>
          <li>All your activities and records</li>
          <li>Team and group associations</li>
          <li>All performance metrics</li>
        </ul>
        <p className={styles.warningNote}>Note: Some historical records may be retained for analytical purposes.</p>
      </div>

      <div className={styles.reasonSection}>
        <label>Why are you deleting your account?</label>
        <select
          className={`${styles.select} ${error && !deletionReason ? styles.inputError : ''}`}
          value={deletionReason}
          onChange={(e) => setDeletionReason(e.target.value as DeletionReason)}
          disabled={isDeleting}
        >
          <option value="">Select a reason</option>
          {DELETION_REASONS.map(reason => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>

        {deletionReason === 'other' && (
          <textarea
            className={`${styles.textarea} ${error && !otherReason ? styles.inputError : ''}`}
            placeholder="Please tell us why you're leaving..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            disabled={isDeleting}
            rows={3}
          />
        )}
      </div>

      <div className={styles.confirmationBox}>
        <br></br>
        <label>Type "DELETE" to confirm:</label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className={`${styles.input} ${error && confirmText !== 'DELETE' ? styles.inputError : ''}`}
          placeholder="Type DELETE"
          disabled={isDeleting}
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.cancelButton}
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </button>
        <button
          className={`${styles.deleteButton} ${isDeleting ? styles.deletingButton : ''}`}
          onClick={handleDelete}
          disabled={isDeleting || confirmText !== 'DELETE' || !deletionReason}
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}