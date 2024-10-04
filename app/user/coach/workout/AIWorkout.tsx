import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../../styles/WorkoutPage.module.css';
import { SwimWorkout, SwimGroup } from '@app/lib/types';
import { generateSwimWorkout } from "@app/lib/langchain/langchainHelper";
import { ClipLoader } from "react-spinners";

interface AIWorkoutProps {
  groups: SwimGroup[];
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onSaveWorkout: (workout: SwimWorkout, groupId: string) => Promise<void>;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const AIWorkout: React.FC<AIWorkoutProps> = ({ groups, selectedGroup, setSelectedGroup, onSaveWorkout }) => {
  const [inputText, setInputText] = useState<string>('');
  const [generatedWorkout, setGeneratedWorkout] = useState<SwimWorkout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleGenerateWorkout = async () => {
    if (!selectedGroup) {
      showNotification("Please select a swim group before generating a workout.", 'error');
      return;
    }
    if (!inputText.trim()) {
      showNotification("Please enter a workout request before generating.", 'error');
      return;
    }
    setLoading(true);
    setGeneratedWorkout(null);
    try {
      const data = await generateSwimWorkout(inputText);
      if ('error' in data) {
        showNotification(`Failed to generate workout: ${data.error}`, 'error');
      } else {
        setGeneratedWorkout(data);
        showNotification("Workout generated successfully!", 'success');
      }
    } catch (error) {
      showNotification(`Failed to generate workout: ${error instanceof Error ? error.message : String(error)}`, 'error');
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
    if (!selectedGroup || !generatedWorkout) {
      showNotification("Please select a swim group and generate a workout before saving.", 'error');
      return;
    }
    setIsSaving(true);
    try {
      await onSaveWorkout(generatedWorkout, selectedGroup);
      showNotification("Workout saved successfully!", 'success');
      // Clear form fields
      setInputText('');
      setGeneratedWorkout(null);
      setSelectedGroup('');
      setIsEditing(false);
    } catch (error) {
      showNotification(`Failed to save workout: ${error instanceof Error ? error.message : String(error)}`, 'error');
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

  const handleDeleteField = (field: keyof SwimWorkout, index: number) => {
    if (generatedWorkout && Array.isArray(generatedWorkout[field])) {
      const newArray = [...generatedWorkout[field] as string[]];
      newArray.splice(index, 1);
      setGeneratedWorkout({
        ...generatedWorkout,
        [field]: newArray
      });
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || !generatedWorkout) {
      return;
    }

    const field = result.source.droppableId as keyof SwimWorkout;
    const items = Array.from(generatedWorkout[field] as string[]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGeneratedWorkout({
      ...generatedWorkout,
      [field]: items
    });
  };

  const renderEditableField = (field: keyof SwimWorkout, label: string) => {
    if (!generatedWorkout) return null;

    if (Array.isArray(generatedWorkout[field])) {
      return (
        <div>
          <h3>{label}</h3>
          <Droppable droppableId={field}>
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {(generatedWorkout[field] as string[]).map((item, index) => (
                  <Draggable key={`${field}-${index}`} draggableId={`${field}-${index}`} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={styles.draggableItem}
                      >
                        <input 
                          type="text" 
                          value={item} 
                          onChange={(e) => {
                            const newArray = [...generatedWorkout[field] as string[]];
                            newArray[index] = e.target.value;
                            handleWorkoutChange(field, newArray);
                          }}
                          required
                        />
                        <button onClick={() => handleDeleteField(field, index)}>Delete</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
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
            required
          />
        </p>
      );
    }
  };

  return (
    <div className={styles.createWorkoutSection}>
      <h2 className={styles.sectionTitle}>Generate AI Workout</h2>
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
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Workout Request:</label>
        <input
          type="text"
          className={styles.formInput}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your workout request"
          required
        />
      </div>
      <button 
        className={styles.generateButton} 
        onClick={handleGenerateWorkout}
        disabled={loading}
      >
        {loading ? <ClipLoader size={20} color={"#ffffff"} /> : "Generate AI Workout"}
      </button>
      
      {generatedWorkout && (
        <div className={styles.generatedWorkout}>
          <h2>Generated Workout</h2>
          <DragDropContext onDragEnd={onDragEnd}>
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
          </DragDropContext>
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
              disabled={isSaving || !generatedWorkout || !selectedGroup}
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