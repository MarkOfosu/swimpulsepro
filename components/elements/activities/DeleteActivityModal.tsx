// components/elements/activities/DeleteActivityModal.tsx
import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/elements/Button';
import styles from './Activities.module.css';

interface DeleteActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  activityTitle: string;
}

export const DeleteActivityModal: React.FC<DeleteActivityModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  activityTitle,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.backdrop} />
      <DialogPanel className={styles.modalContent}>
        <div className={styles.deleteModalHeader}>
          <AlertCircle className={styles.deleteIcon} size={24} />
          <DialogTitle className={styles.deleteTitle}>
            Delete Activity
          </DialogTitle>
        </div>

        <div className={styles.deleteModalBody}>
          <p>
            Are you sure you want to delete "{activityTitle}"? This action cannot be undone.
          </p>
          <p className={styles.deleteWarning}>
            All participant responses and related data will be permanently removed.
          </p>
        </div>

        <div className={styles.deleteModalActions}>
          <Button
            variant="secondary"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={onConfirm}
            className={styles.deleteButton}
          >
            Delete Activity
          </Button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};