import { WorkoutData, SwimWorkout } from '@app/lib/types';

export const workoutService = {
  fetchWorkouts: async () => {
    const response = await fetch('/api/workouts');
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return response.json();
  },

  saveWorkout: async (workout: SwimWorkout, groupId: string) => {
    const response = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workout, groupId }),
    });
    if (!response.ok) throw new Error('Failed to save workout');
    return response.json();
  },

  searchWorkouts: async (params: {
    groupId?: string;
    date?: string;
    focus?: string;
    page: number;
    itemsPerPage: number;
  }) => {
    const response = await fetch('/api/workouts/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) throw new Error('Failed to search workouts');
    return response.json();
  }
};