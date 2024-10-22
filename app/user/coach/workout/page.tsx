"use client"

import React, { useState, useEffect } from 'react';
import { createClient } from '@utils/supabase/client';
import CoachPageLayout from "../CoachPageLayout";
import { WorkoutData, SwimWorkout, SwimGroup } from '@app/lib/types';
import styles from '../../../styles/WorkoutPage.module.css';
import ViewWorkouts from './ViewWorkouts';
import ManualWorkout from './ManualWorkout';
import AIWorkout from './AIWorkout';
import WorkoutPageSkeleton from './loading';

const WorkoutPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [groups, setGroups] = useState<SwimGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [viewMode, setViewMode] = useState<'view' | 'manual' | 'ai'>('view');
  const [coachId, setCoachId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        console.error('No session found, redirecting to login...');
        return;
      }

      setCoachId(session.user.id);

      await Promise.all([
        fetchGroups(session.user.id),
        fetchWorkouts(session.user.id)
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchGroups = async (coachId: string) => {
    const { data, error } = await supabase
      .from('swim_groups')
      .select('id, name, group_code')
      .eq('coach_id', coachId);

    if (error) {
      console.error('Error fetching swim groups:', error);
    } else {
      setGroups(data || []);
    }
  };

  const fetchWorkouts = async (coachId: string) => {
    const { data, error } = await supabase
      .from('workouts')
      .select('id, workout_data, created_at, coach_id, group_id')
      .eq('coach_id', coachId);
    
    if (error) {
      console.error('Error fetching workouts:', error);
    } else {
      setWorkouts(data || []);
    }
  };

  const handleSaveWorkout = async (workout: SwimWorkout, groupId: string) => {
    if (!coachId) {
      console.error('No coach ID found');
      return;
    }

    // Save to workouts table
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        coach_id: coachId,
        group_id: groupId,
        workout_data: workout,
      })
      .select();

    if (workoutError) {
      console.error('Error saving workout:', workoutError);
      return;
    }

    // Save to ai_training_data table
    const { error: aiTrainingError } = await supabase
      .from('ai_training_data')
      .insert({
        group_id: groupId,
        training_data: [workout],
      });

    if (aiTrainingError) {
      console.error('Error saving to AI training data:', aiTrainingError);
    }

    if (workoutData) {
      setWorkouts([...workouts, workoutData[0]]);
    }

    alert('Workout saved successfully!');
  };


  if (isLoading) {
    return <WorkoutPageSkeleton />;
  }

  return (
    <CoachPageLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Workouts</h1>

        <div className={styles.buttonGroup}>
          <button onClick={() => setViewMode('view')} className={styles.optionButton}>View Past Workouts</button>
          <button onClick={() => setViewMode('manual')} className={styles.optionButton}>Write Manual Workout</button>
          <button onClick={() => setViewMode('ai')} className={styles.optionButton}>Generate AI Workout</button>
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