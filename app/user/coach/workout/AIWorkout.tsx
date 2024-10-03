import React, { useState } from 'react';
import styles from '../../../styles/WorkoutPage.module.css';
import { SwimWorkout, SwimGroup } from '@app/lib/types';
import { generateSwimWorkout } from "@app/lib/langchain/langchainHelper";
import ClipLoader from "react-spinners/ClipLoader";

interface AIWorkoutProps {
  groups: SwimGroup[];
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onSaveWorkout: (workout: SwimWorkout, groupId: string) => Promise<void>;
}

const AIWorkout: React.FC<AIWorkoutProps> = ({ groups, selectedGroup, setSelectedGroup, onSaveWorkout }) => {
  const [inputText, setInputText] = useState<string>('');
  const [generatedWorkout, setGeneratedWorkout] = useState<SwimWorkout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleGenerateWorkout = async () => {
    setLoading(true);
    setError(null);
    setGeneratedWorkout(null);
    setSaveSuccess(false);
    try {
      const data = await generateSwimWorkout(inputText);
      if ('error' in data) {
        setError(`Failed to generate workout: ${data.error}`);
      } else {
        setGeneratedWorkout(data);
      }
    } catch (error) {
      setError(`Failed to generate workout: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDoneEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedGroup || !generatedWorkout) return;
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await onSaveWorkout(generatedWorkout, selectedGroup);
      setSaveSuccess(true);
      // Clear form fields
      setInputText('');
      setGeneratedWorkout(null);
      setSelectedGroup('');
      setIsEditing(false);
    } catch (error) {
      setError(`Failed to save workout: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWorkoutChange = (field: keyof SwimWorkout, value: any) => {
    if (generatedWorkout) {
      setGeneratedWorkout({ ...generatedWorkout, [field]: value });
    }
  };

  const handleAddField = (field: keyof SwimWorkout) => {
    if (generatedWorkout && Array.isArray(generatedWorkout[field])) {
      setGeneratedWorkout({
        ...generatedWorkout,
        [field]: [...(generatedWorkout[field] as string[]), '']
      });
    }
  };

  const renderEditableField = (field: keyof SwimWorkout, label: string) => {
    if (!generatedWorkout) return null;

    if (Array.isArray(generatedWorkout[field])) {
      return (
        <div>
          <h3>{label}</h3>
          <ul>
            {(generatedWorkout[field] as string[]).map((item, index) => (
              <li key={index}>
                <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => {
                    const newArray = [...generatedWorkout[field] as string[]];
                    newArray[index] = e.target.value;
                    handleWorkoutChange(field, newArray);
                  }}
                />
              </li>
            ))}
          </ul>
          <button onClick={() => handleAddField(field)}>Add {label} Item</button>
        </div>
      );
    } else {
      return (
        <p>
          <strong>{label}:</strong> 
          <input 
            type="text" 
            value={generatedWorkout[field] as string || ''} 
            onChange={(e) => handleWorkoutChange(field, e.target.value)}
          />
        </p>
      );
    }
  };

  return (
    <div className={styles.createWorkoutSection}>
      <h2 className={styles.sectionTitle}>Generate AI Workout</h2>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Select Swim Group:</label>
        <select 
          className={styles.formSelect} 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Workout Request:</label>
        <input
          type="text"
          className={styles.formInput}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your workout request"
        />
      </div>
      <button 
        className={styles.generateButton} 
        onClick={handleGenerateWorkout}
        disabled={loading || !inputText.trim()}
      >
        {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Generate AI Workout"}
      </button>
      
      {error && <p className={styles.errorMessage}>{error}</p>}
      {saveSuccess && <p className={styles.successMessage}>Workout saved successfully!</p>}
      
      {generatedWorkout && (
        <div className={styles.generatedWorkout}>
          <h2>Generated Workout</h2>
          <div className={styles.workoutDetails}>
            {isEditing ? (
              <>
                {renderEditableField('focus', 'Focus')}
                {renderEditableField('warmup', 'Warmup')}
                {renderEditableField('preset', 'Preset')}
                {renderEditableField('main_set', 'Main Set')}
                {renderEditableField('cooldown', 'Cooldown')}
                {renderEditableField('distance', 'Distance')}
                {renderEditableField('duration', 'Duration')}
                {renderEditableField('intensity', 'Intensity')}
                {renderEditableField('description', 'Description')}
              </>
            ) : (
              <>
                <p><strong>Focus:</strong> {generatedWorkout.focus}</p>
                <h3>Warmup:</h3>
                <ul>
                  {generatedWorkout.warmup.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3>Preset:</h3>
                <ul>
                  {generatedWorkout.preset.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3>Main Set:</h3>
                <ul>
                  {generatedWorkout.main_set.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <h3>Cooldown:</h3>
                <ul>
                  {generatedWorkout.cooldown.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p><strong>Distance:</strong> {generatedWorkout.distance || 'N/A'}</p>
                <p><strong>Duration:</strong> {generatedWorkout.duration || 'N/A'}</p>
                <p><strong>Intensity:</strong> {generatedWorkout.intensity || 'N/A'}</p>
                <p><strong>Description:</strong> {generatedWorkout.description || 'N/A'}</p>
              </>
            )}
          </div>
          <div className={styles.buttonGroup}>
            {isEditing ? (
              <button 
                className={styles.doneButton} 
                onClick={handleDoneEditing}
              >
                Done Editing
              </button>
            ) : (
              <button 
                className={styles.editButton} 
                onClick={handleEdit}
              >
                Edit Workout
              </button>
            )}
            <button 
              className={styles.saveButton} 
              onClick={handleSave}
              disabled={isSaving || !generatedWorkout}
            >
              {isSaving ? <ClipLoader size={20} color={"#ffffff"} /> : "Save Workout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWorkout;