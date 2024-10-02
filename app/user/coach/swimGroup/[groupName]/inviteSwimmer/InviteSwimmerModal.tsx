import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@components/ui/toasts/Toast';
import styles from '../../../../../styles/InviteSwimmerModal.module.css';

interface InviteSwimmerModalProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
  onInviteSuccess: () => void;
}

const InviteSwimmerModal: React.FC<InviteSwimmerModalProps> = ({ groupId, groupName, onClose, onInviteSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const supabase = createClient();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    console.log('Submitting invitation for email:', email);

    try {
      const { data: existingInvitations, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', groupId)
        .eq('email', email)
        .eq('status', 'pending');

      if (checkError) throw checkError;

      if (existingInvitations && existingInvitations.length > 0) {
        showToast('An invitation for this email is already pending', 'error');
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

      showToast('Invitation sent successfully', 'success');
      onInviteSuccess();
      onClose();
    } catch (error) {
      console.error('Error inviting swimmer:', error);
      showToast('Failed to invite swimmer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>Invite Swimmer to {groupName}</h2>
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