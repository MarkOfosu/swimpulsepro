// app/workouts/page.tsx
"use client"

import React, { useState } from 'react';
import CoachPageLayout from "../CoachPageLayout";
import { useWorkouts } from '@/app/hooks/useWorkouts';
import { useSwimGroups } from '@/app/hooks/useSwimGroups';
import { useNotification } from '@/app/hooks/useNotification';
import { SwimWorkout } from '@app/lib/types';
import styles from '../../../styles/WorkoutPage.module.css';
import ViewWorkouts from './ViewWorkouts';
import ManualWorkout from './ManualWorkout';
import AIWorkout from './AIWorkout';
import WorkoutPageSkeleton from './loading';

const WorkoutPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [viewMode, setViewMode] = useState<'view' | 'manual' | 'ai'>('view');
  
  const { 
    workouts, 
    isLoading: workoutsLoading, 
    error: workoutsError,
    saveWorkout 
  } = useWorkouts();

  const {
    groups,
    isLoading: groupsLoading,
    error: groupsError
  } = useSwimGroups();

  const { showNotification } = useNotification();

  const isLoading = workoutsLoading || groupsLoading;
  const error = workoutsError || groupsError;

  const handleSaveWorkout = async (workout: SwimWorkout, groupId: string) => {
    try {
      await saveWorkout(workout, groupId);
      showNotification('Workout saved successfully!', 'success');
      
      // Reset selection after successful save if needed
      setSelectedGroup('');
      
      // Optionally switch back to view mode
      setViewMode('view');
    } catch (error) {
      showNotification(
        `Failed to save workout: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error'
      );
      throw error; // Re-throw to let the component handle it if needed
    }
  };

  if (isLoading) {
    return <WorkoutPageSkeleton />;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <CoachPageLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Workouts</h1>

        <div className={styles.buttonGroup}>
          <button 
            onClick={() => setViewMode('view')} 
            className={`${styles.optionButton} ${viewMode === 'view' ? styles.active : ''}`}
          >
            View Past Workouts
          </button>
          <button 
            onClick={() => setViewMode('manual')} 
            className={`${styles.optionButton} ${viewMode === 'manual' ? styles.active : ''}`}
          >
            Write Manual Workout
          </button>
          <button 
            onClick={() => setViewMode('ai')} 
            className={`${styles.optionButton} ${viewMode === 'ai' ? styles.active : ''}`}
          >
            Generate AI Workout
          </button>
        </div>

        <div className={styles.contentBox}>
          {viewMode === 'view' && (
            <ViewWorkouts 
              groups={groups} 
              selectedGroup={selectedGroup} 
              setSelectedGroup={setSelectedGroup} 
            />
          )}

          {viewMode === 'manual' && (
            <ManualWorkout 
              groups={groups} 
              selectedGroup={selectedGroup} 
              setSelectedGroup={setSelectedGroup} 
              onSaveWorkout={handleSaveWorkout} 
            />
          )}

          {viewMode === 'ai' && (
            <AIWorkout 
              groups={groups} 
              selectedGroup={selectedGroup} 
              setSelectedGroup={setSelectedGroup} 
              onSaveWorkout={handleSaveWorkout} 
            />
          )}
        </div>
      </div>
    </CoachPageLayout>
  );
};

export default WorkoutPage;