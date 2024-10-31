// components/elements/activities/ActivityResponseModal.tsx
'use client';
import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Button } from '@/components/elements/Button';
import { X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { UpcomingActivity, ActivityResponseStatus } from '@/app/lib/types';
import styles from '../../styles/ActivityResponseModal.module.css';

interface ActivityResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: ActivityResponseStatus, additionalInfo?: string) => Promise<void>;
  activity: UpcomingActivity;
  initialStatus?: ActivityResponseStatus;
  initialInfo?: string;
}

export const ActivityResponseModal: React.FC<ActivityResponseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  activity,
  initialStatus,
  initialInfo = ''
}) => {
  const [status, setStatus] = useState<ActivityResponseStatus>(initialStatus || 'attending');
  const [additionalInfo, setAdditionalInfo] = useState(initialInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(status, additionalInfo);
      onClose();
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (responseStatus: ActivityResponseStatus) => {
    switch (responseStatus) {
      case 'attending':
        return <CheckCircle className={styles.attendingIcon} size={20} />;
      case 'interested':
        return <Clock className={styles.interestedIcon} size={20} />;
      case 'not_attending':
        return <XCircle className={styles.notAttendingIcon} size={20} />;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.backdrop} aria-hidden="true" />
      
      <div className={styles.modalContainer}>
        <DialogPanel className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <DialogTitle className={styles.modalTitle}>
              Respond to Activity
            </DialogTitle>
            <button 
              onClick={onClose} 
              className={styles.closeButton}
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.activityInfo}>
              <h3>{activity.title}</h3>
              <p className={styles.activityDate}>
                {new Date(activity.start_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.responseForm}>
              <div className={styles.responseOptions}>
                <div className={styles.responseOptionGroup}>
                  <button
                    type="button"
                    onClick={() => setStatus('attending')}
                    className={`${styles.responseOption} ${
                      status === 'attending' ? styles.selected : ''
                    } ${styles.attending}`}
                    disabled={isSubmitting}
                  >
                    {getStatusIcon('attending')}
                    <span>Attending</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStatus('interested')}
                    className={`${styles.responseOption} ${
                      status === 'interested' ? styles.selected : ''
                    } ${styles.interested}`}
                    disabled={isSubmitting}
                  >
                    {getStatusIcon('interested')}
                    <span>Interested</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStatus('not_attending')}
                    className={`${styles.responseOption} ${
                      status === 'not_attending' ? styles.selected : ''
                    } ${styles.notAttending}`}
                    disabled={isSubmitting}
                  >
                    {getStatusIcon('not_attending')}
                    <span>Not Attending</span>
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="additionalInfo">
                  Additional Information (Optional)
                </label>
                <textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Add any notes or special requirements..."
                  rows={4}
                  disabled={isSubmitting}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.modalFooter}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </Button>
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};