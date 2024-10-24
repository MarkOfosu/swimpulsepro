// import React, { useState } from 'react';
// import { createClient } from '@/utils/supabase/client';
// import styles from '../../../../../styles/InviteSwimmerModal.module.css';

// interface InviteSwimmerModalProps {
//   groupId: string;
//   groupName: string;
//   onClose: () => void;
//   onInviteSuccess: () => void;
// }

// type NotificationType = 'success' | 'error' | 'warning';

// const Notification: React.FC<{ type: NotificationType; message: string }> = ({ type, message }) => (
//   <div className={`${styles.notification} ${styles[type]}`}>
//     {message}
//   </div>
// );

// const InviteSwimmerModal: React.FC<InviteSwimmerModalProps> = ({ groupId, groupName, onClose,}) => {
//   const [email, setEmail] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null);
//   const supabase = createClient();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     setIsSubmitting(true);
//     setNotification(null);

//     try {
//       const { data: existingInvitations, error: checkError } = await supabase
//         .from('invitations')
//         .select('*')
//         .eq('group_id', groupId)
//         .eq('email', email)
//         .eq('status', 'pending');

//       if (checkError) throw checkError;

//       if (existingInvitations && existingInvitations.length > 0) {
//         setNotification({ type: 'warning', message: 'An invitation for this email is already pending' });
//         return;
//       }

//       const { error } = await supabase
//         .from('invitations')
//         .insert({
//           group_id: groupId,
//           email: email,
//           status: 'pending'
//         });

//       if (error) throw error;

//       setNotification({ type: 'success', message: 'Invitation sent successfully' });
//     //   onInviteSuccess();
//       setTimeout(onClose, 3000); 
//     } catch (error) {
//       console.error('Error inviting swimmer:', error);
//       setNotification({ type: 'error', message: 'Failed to invite swimmer' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
//         <h2>Invite Swimmer to {groupName}</h2>
//         {notification && <Notification type={notification.type} message={notification.message} />}
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Swimmer's Email"
//             required
//           />
//           <div className={styles.modalActions}>
//             <button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? 'Sending...' : 'Send Invitation'}
//             </button>
//             <button type="button" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default InviteSwimmerModal;

'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { X } from 'lucide-react';
import { useToast } from '@components/elements/toasts/Toast';
import styles from '../../../../../styles/InviteSwimmerModal.module.css';

interface InviteSwimmerModalProps {
  groupId: string;
  groupName: string;
  onClose: () => void;
  onInviteSuccess: () => void;
}

const InviteSwimmerModal: React.FC<InviteSwimmerModalProps> = ({
  groupId,
  groupName,
  onClose,
  onInviteSuccess
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);

      // Check if invitation already exists
      const { data: existingInvites, error: checkError } = await supabase
        .from('invitations')
        .select('*')
        .eq('group_id', groupId)
        .eq('email', email.trim())
        .eq('status', 'pending');

      if (checkError) throw checkError;

      if (existingInvites && existingInvites.length > 0) {
        setError('An invitation has already been sent to this email');
        return;
      }

      // Create new invitation
      const { data: newInvite, error: inviteError } = await supabase
        .from('invitations')
        .insert({
          group_id: groupId,
          email: email.trim(),
          status: 'pending'
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Here you would typically trigger an email to the invited user
      // This would be handled by a server-side function

      showToast('Invitation sent successfully!', 'success');
      onInviteSuccess();
      onClose();

    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
      showToast('Failed to send invitation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Invite Swimmer to {groupName}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Swimmer's Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter swimmer's email"
              className={styles.input}
              disabled={loading}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteSwimmerModal;