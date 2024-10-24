'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { X } from 'lucide-react';
import { useToast } from '@components/elements/toasts/Toast';
import styles from '../../../../styles/CreateSwimGroupModal.module.css';

interface CreateSwimGroupProps {
  onClose: () => void;
  onGroupCreated: () => Promise<void>;
}

const CreateSwimGroupModal: React.FC<CreateSwimGroupProps> = ({
  onClose,
  onGroupCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { showToast } = useToast();
  const supabase = createClient();

  const generateGroupCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 8 }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      setLoading(true);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Create new swim group
      const { data: newGroup, error: groupError } = await supabase
        .from('swim_groups')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          coach_id: user.id,
          group_code: generateGroupCode(),
        })
        .select()
        .single();

      if (groupError) throw groupError;

      showToast('Swim group created successfully!', 'success');
      await onGroupCreated();
      onClose();

    } catch (err) {
      console.error('Error creating swim group:', err);
      setError(err instanceof Error ? err.message : 'Failed to create swim group');
      showToast('Failed to create swim group', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Create New Swim Group</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Group Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter group name"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter group description"
              className={styles.textarea}
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
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSwimGroupModal;