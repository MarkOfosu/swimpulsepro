import React, { useState } from 'react';
import styles from '../../../styles/WorkoutPage.module.css';
import { SwimWorkout, SwimGroup } from '@app/lib/types';

interface ManualWorkoutProps {
  groups: SwimGroup[];
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onSaveWorkout: (workout: SwimWorkout, groupId: string) => void;
}

const ManualWorkout: React.FC<ManualWorkoutProps> = ({ groups, selectedGroup, setSelectedGroup, onSaveWorkout }) => {
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

  const handleInputChange = (field: keyof SwimWorkout, value: string | string[]) => {
    setWorkout(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: keyof SwimWorkout, value: string) => {
    setWorkout(prev => ({ ...prev, [field]: value.split('\n') }));
  };

  const handleSaveWorkout = () => {
    if (!selectedGroup) {
      alert('Please select a group before saving the workout.');
      return;
    }
    onSaveWorkout(workout, selectedGroup);
  };

  return (
    <div className={styles.createWorkoutSection}>
      <h2 className={styles.sectionTitle}>Write Manual Workout</h2>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Swim Group:</label>
        <select className={styles.formSelect} value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>
      {Object.entries(workout).map(([key, value]) => (
        <div key={key} className={styles.formGroup}>
          <label className={styles.formLabel}>{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}:</label>
          {Array.isArray(value) ? (
            <textarea
              className={styles.formTextarea}
              value={value.join('\n')}
              onChange={(e) => handleArrayInputChange(key as keyof SwimWorkout, e.target.value)}
              placeholder={`Enter ${key.replace('_', ' ')} items, each on a new line`}
            />
          ) : (
            <input
              type="text"
              className={styles.formInput}
              value={value}
              onChange={(e) => handleInputChange(key as keyof SwimWorkout, e.target.value)}
              placeholder={`Enter ${key.replace('_', ' ')}`}
            />
          )}
        </div>
      ))}
      <button className={styles.saveButton} onClick={handleSaveWorkout}>Save Workout</button>
    </div>
  );
};

export default ManualWorkout;