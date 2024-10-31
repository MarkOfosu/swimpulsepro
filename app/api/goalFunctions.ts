import { ReactNode } from 'react';
import { createClient } from '../../utils/supabase/client'

const supabase = createClient();

export interface GoalType {
  id: string;
  name: string;
  description: string;
}

export interface SwimmerGoal {
  newAchievement: any;
  id: string;
  swimmer_id: string;
  goal_type_id: string;
  target_value?: number;
  initial_time?: string;
  target_time?: string;
  event?: string;
  start_date: string;
  end_date: string;
  status: 'in_progress' | 'completed' | 'expired';
  progress: number;
  goal_type: GoalType;
  unit: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved_date: string;
  event?: string;
  goal_type?: string;
  icon: string;
  time?: string;
  target_value?: number;
  target_time?: string;
  start_date?: string;
  end_date?: string;
  unit: string;
}

export interface NewGoal {
  goalTypeId: string;
  targetValue?: number;
  initialTime?: string;
  targetTime?: string;
  event?: string;
  startDate: string;
  endDate: string;
  unit: string;
}

export interface SetGoalResult {
  id: string;
  goal_type_name: string;
  target_value?: number;
  target_time?: string;
  unit: string;
}

export async function setSwimmerGoal(swimmerId: string, goal: NewGoal): Promise<SetGoalResult> {
  const { data, error } = await supabase.rpc('set_swimmer_goal', {
    p_swimmer_id: swimmerId,
    p_goal_type_id: goal.goalTypeId,
    p_target_value: goal.targetValue || null,
    p_initial_time: goal.initialTime || null,
    p_target_time: goal.targetTime || null,
    p_event: goal.event || null,
    p_start_date: goal.startDate,
    p_end_date: goal.endDate,
    p_unit: goal.unit
  });

  if (error) {
    console.error('Error setting swimmer goal:', error);
    throw error;
  }

  return data as SetGoalResult;
}

export async function updateGoalProgress(
  goalId: string, 
  updateValue: string | number, 
  updateDate: string, 
  notes: string
): Promise<SwimmerGoal> {
  const { data, error } = await supabase.rpc('update_goal_progress', {
    p_goal_id: goalId,
    p_update_value: updateValue.toString(),
    p_update_date: updateDate,
    p_notes: notes
  });

  if (error) {
    console.error('Error updating goal progress:', error);
    throw error;
  }

  return data as SwimmerGoal;
}

export async function fetchSwimmerGoals(swimmerId: string): Promise<SwimmerGoal[]> {
  const { data, error } = await supabase
    .from('swimmer_goals')
    .select(`
      *,goal_type:goal_types(*)
    `)
    .eq('swimmer_id', swimmerId);

  if (error) {
    console.error('Error fetching swimmer goals:', error);
    throw error;
  }

  // Check for expired goals
  const currentDate = new Date();
  const updatedGoals = data.map(goal => {
    if (new Date(goal.end_date) < currentDate && goal.status === 'in_progress') {
      return { ...goal, status: 'expired' };
    }
    return goal;
  });

  return updatedGoals as SwimmerGoal[];
}

export async function fetchSwimmerAchievements(swimmerId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('swimmer_id', swimmerId);

  if (error) {
    console.error('Error fetching swimmer achievements:', error);
    throw error;
  }

  return data as Achievement[];
}

export async function fetchGoalTypes(): Promise<GoalType[]> {
  const { data, error } = await supabase
    .from('goal_types')
    .select('*');

  if (error) {
    console.error('Error fetching goal types:', error);
    throw error;
  }

  return data as GoalType[];
}

export function parseTimeString(timeString: string): number {
  const [minutes, seconds, centiseconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds + centiseconds / 100;
}

export function formatTimeString(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const centiseconds = Math.round((totalSeconds % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
}

export function calculateTimeProgress(initialTime: number, targetTime: number, currentTime: number): number {
  const totalImprovement = initialTime - targetTime;
  const currentImprovement = initialTime - currentTime;
  return Math.min((currentImprovement / totalImprovement) * 100, 100);
}