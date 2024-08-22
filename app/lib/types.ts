// measurementCriteria.ts
// type PerformanceIndicatorType = 'Test Set' | 'Benchmark' | 'Skill Assessment' | 'Goal Achievement';

export type PerformanceIndicatorType = 'Test Set' | 'Benchmark' | 'Skill Assessment' | 'Goal Achievement';


export interface PerformanceIndicator {
  type: PerformanceIndicatorType;
  name: string;
  description: string;
  criteria: MeasurementCriteria[];
}

export interface MeasurementCriteria {
  question: string;
  type: 'number' | 'text' | 'select';
  options?: string[];
}

// Define the Metric type
type MetricType = 'Test Set' | 'Goal Time' | 'Progress Metric' | 'Performance Benchmark';

interface Metric {
  id: string;
  name: string;
  type: MetricType;
  description?: string;
  maxReps?: number;  // Optional, used for 'Test Set' with 'reps'
  goalTime?: string; // Optional, used for 'Goal Time'
  swimmerId: string;
}

// Define props for the component
export interface InputResultsFormProps {
  metric: Metric;
}


export interface SwimWorkout {
  focus: string;
  warmup: string[];
  preset: string[];
  main_set: string[];
  cooldown: string[];
  distance?: string;
  duration?: string;
  intensity?: string;
  description?: string;
}

export interface AITrainingData {
  id: string;
  group_id: string;
  training_data: SwimWorkout[];
  created_at: string;
}

export interface WorkoutData {
  coach_id: string;
  group_id: string;
  workout_data: SwimWorkout;
  created_at?: string;
}



