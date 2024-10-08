import { createClient } from '../../../../utils/supabase/client'

const supabase = createClient();

export interface GoalType {
  id: string;
  name: string;
  description: string;
  measurement_unit: string;
}

export interface SwimmerGoal {
  initial_time: string | undefined;
  id: string;
  swimmer_id: string;
  goal_type_id: string;
  target_value?: number;
  target_time?: string;
  event?: string;
  start_date: string;
  end_date: string;
  status: 'in_progress' | 'completed';
  progress: number;
  goal_type: GoalType;
}

export interface Achievement {
  id: string;
  swimmer_id: string;
  title: string;
  description: string;
  achieved_date: string;
  icon?: string;
  related_goal_id?: string;
}

export interface NewGoal {
  goalTypeId: string;
  targetValue?: number;
  initialTime?: string;  // Add this line
  targetTime?: string;
  event?: string;
  startDate: string;
  endDate: string;
}

export async function setSwimmerGoal(swimmerId: string, goal: NewGoal): Promise<string> {
  const { data, error } = await supabase.rpc('set_swimmer_goal', {
    p_swimmer_id: swimmerId,
    p_goal_type_id: goal.goalTypeId,
    p_target_value: goal.targetValue || null,
    p_initial_time: goal.initialTime || null,  // Add this line
    p_target_time: goal.targetTime || null,
    p_event: goal.event || null,
    p_start_date: goal.startDate,
    p_end_date: goal.endDate
  });

  if (error) {
    console.error('Error setting swimmer goal:', error);
    throw error;
  }

  return data as string; // This will be the new goal ID
}


export const updateGoalProgress = async (
  goalId: string, updateValue: string | number, updateDate: string, notes: string, progress: number  ) => {
      try {
        const response = await supabase.rpc('update_goal_progress', {
          p_goal_id: goalId,
          p_update_value: updateValue.toString(), // Always send as string
          p_update_date: updateDate,
          p_notes: notes
        });
    
        if (response.error) {
          throw new Error(response.error.message);
        }
    
        return response.data;
      } catch (error) {
        console.error('Error updating goal progress:', error);
        throw error;
      }
  };

export async function fetchSwimmerGoals(swimmerId: string): Promise<SwimmerGoal[]> {
  const { data, error } = await supabase
    .from('swimmer_goals')
    .select(`
      *,
      goal_type:goal_types(*)
    `)
    .eq('swimmer_id', swimmerId);

  if (error) {
    console.error('Error fetching swimmer goals:', error);
    throw error;
  }

  return data as SwimmerGoal[];
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

export function calculateTimeProgress(targetTime: number, currentTime: number): number {
  //  lower time is better
  const improvement = targetTime - currentTime;
  const totalImprovement = targetTime - (targetTime * 0.9); // Assuming 10% improvement is 100% progress
  return Math.min((improvement / totalImprovement) * 100, 100);
}