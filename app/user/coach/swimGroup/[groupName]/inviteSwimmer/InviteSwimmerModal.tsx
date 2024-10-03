import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from '../../../../../styles/InviteSwimmerModal.module.css';

interface InviteSwimmerModalProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
  onInviteSuccess: () => void;
}

type NotificationType = 'success' | 'error' | 'warning';

const Notification: React.FC<{ type: NotificationType; message: string }> = ({ type, message }) => (
  <div className={`${styles.notification} ${styles[type]}`}>
    {message}
  </div>
);

const InviteSwimmerModal: React.FC<InviteSwimmerModalProps> = ({ groupId, groupName, onClose,}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setNotification(null);

    try {
      const { data: existingInvitations, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', groupId)
        .eq('email', email)
        .eq('status', 'pending');

      if (checkError) throw checkError;

      if (existingInvitations && existingInvitations.length > 0) {
        setNotification({ type: 'warning', message: 'An invitation for this email is already pending' });
        return;
      }

      const { error } = await supabase
        .from('invitations')
        .insert({
          group_id: groupId,
          email: email,
          status: 'pending'
        });

      if (error) throw error;

      setNotification({ type: 'success', message: 'Invitation sent successfully' });
    //   onInviteSuccess();
      setTimeout(onClose, 3000); 
    } catch (error) {
      console.error('Error inviting swimmer:', error);
      setNotification({ type: 'error', message: 'Failed to invite swimmer' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Invite Swimmer to {groupName}</h2>
        {notification && <Notification type={notification.type} message={notification.message} />}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Swimmer's Email"
            required
          />
          <div className={styles.modalActions}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteSwimmerModal;