import { SupabaseClient } from '@supabase/supabase-js';
import { WorkoutData, SwimWorkout, AITrainingData } from '@app/lib/types';

export const fetchGroups = async (supabase: SupabaseClient, coachId: string) => {
  const { data, error } = await supabase
    .from('swim_groups')
    .select('*')
    .eq('coach_id', coachId);

  if (error) {
    console.error('Error fetching swim groups:', error);
    return [];
  }
  return data || [];
};

export const fetchWorkouts = async (supabase: SupabaseClient, coachId: string) => {
  const { data, error } = await supabase
    .from('workouts')
    .select('id, workout_data, created_at, coach_id, group_id')
    .eq('coach_id', coachId);
  
  if (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
  return data || [];
};

export const saveWorkout = async (supabase: SupabaseClient, coachId: string, groupId: string, workoutData: SwimWorkout) => {
  const { data, error } = await supabase
    .from('workouts')
    .insert<WorkoutData>([
      {
        coach_id: coachId,
        group_id: groupId,
        workout_data: workoutData,
      },
    ]);

  if (error) {
    console.error('Error saving workout:', error);
    return null;
  }

  const trainingData: SwimWorkout[] = [workoutData];

  await supabase
    .from('ai_training_data')
    .insert<AITrainingData>([{ id: '', group_id: groupId, training_data: trainingData, created_at: new Date().toISOString() }]);

  return data ? data[0] : null;
};