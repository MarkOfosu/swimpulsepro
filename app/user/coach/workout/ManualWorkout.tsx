"use client"

import React, { useState } from 'react';
import { useNotification } from '@/app/hooks/useNotification';
import { SwimWorkout, SwimGroup } from '@app/lib/types';
import styles from '../../../styles/WorkoutPage.module.css';

interface ManualWorkoutProps {
  groups: SwimGroup[];
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onSaveWorkout: (workout: SwimWorkout, groupId: string) => Promise<void>;
}

const ManualWorkout: React.FC<ManualWorkoutProps> = ({
  groups,
  selectedGroup,
  setSelectedGroup,
  onSaveWorkout
}) => {
  const { notification, showNotification } = useNotification();
  const [workout, setWorkout] = useState<SwimWorkout>({
    focus: '',
    warmup: [''],
    preset: [''],
    main_set: [''],
    cooldown: [''],
    distance: '',
    duration: '',
    intensity: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof SwimWorkout, value: string | string[]) => {
    setWorkout(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: keyof SwimWorkout, value: string) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setWorkout(prev => ({ ...prev, [field]: items.length ? items : [''] }));
  };

  const handleSaveWorkout = async () => {
    if (!selectedGroup) {
      showNotification('Please select a group before saving the workout.', 'error');
      return;
    }

    if (!workout.focus || !workout.warmup[0] || !workout.main_set[0]) {
      showNotification('Please fill in at least the focus, warmup, and main set.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveWorkout(workout, selectedGroup);
      showNotification('Workout saved successfully!', 'success');
      setWorkout({
        focus: '',
        warmup: [''],
        preset: [''],
        main_set: [''],
        cooldown: [''],
        distance: '',
        duration: '',
        intensity: '',
        description: ''
      });
      setSelectedGroup('');
    } catch (error) {
      showNotification(
        `Failed to save workout: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.createWorkoutSection}>
      <h2 className={styles.sectionTitle}>Write Manual Workout</h2>
      
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Swim Group:</label>
        <select 
          className={styles.formSelect} 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)}
          required
        >
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      {Object.entries(workout).map(([key, value]) => (
        <div key={key} className={styles.formGroup}>
          <label className={styles.formLabel}>
            {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:
          </label>
          {Array.isArray(value) ? (
            <textarea
              className={styles.formTextarea}
              value={value.join('\n')}
              onChange={(e) => handleArrayInputChange(key as keyof SwimWorkout, e.target.value)}
              placeholder={`Enter ${key.replace('_', ' ')} items, each on a new line`}
              required={key === 'warmup' || key === 'main_set'}
            />
          ) : (
            <input
              type="text"
              className={styles.formInput}
              value={value}
              onChange={(e) => handleInputChange(key as keyof SwimWorkout, e.target.value)}
              placeholder={`Enter ${key.replace('_', ' ')}`}
              required={key === 'focus'}
            />
          )}
        </div>
      ))}

      <button 
        className={styles.saveButton} 
        onClick={handleSaveWorkout}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Workout'}
      </button>
    </div>
  );
};

export default ManualWorkout;