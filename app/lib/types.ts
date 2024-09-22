// app/lib/types.ts

// Performance Indicator types
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

// Swim Workout types
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

// Metric types
export enum MetricCategory {
  TimeTrial = 'TIME_TRIAL',
  DistanceChallenge = 'DISTANCE_CHALLENGE',
  TechniqueAssessment = 'TECHNIQUE_ASSESSMENT',
  EnduranceTest = 'ENDURANCE_TEST',
  SprintPerformance = 'SPRINT_PERFORMANCE',
  DrillProficiency = 'DRILL_PROFICIENCY',
  StrengthBenchmark = 'STRENGTH_BENCHMARK',
  RecoveryMetric = 'RECOVERY_METRIC',
  RaceAnalysis = 'RACE_ANALYSIS',
  ProgressTracker = 'PROGRESS_TRACKER',
  BaseFitnessTest = 'BASE_FITNESS_TEST'
}

export interface BaseMetric {
  id?: string;
  name: string;
  description: string;
  category: MetricCategory;
  unit: string;
  group_id: string;
  timeValue?: number; 
}

export interface TimeTrialMetric extends BaseMetric {
  distance: number;
  stroke: string;
  calculationMethod: 'BEST_TIME' | 'AVERAGE_TIME' | 'TIME_IMPROVEMENT';
}

export interface DistanceChallengeMetric extends BaseMetric {
  distance: any;
  timeLimit: number;
  stroke: string;
  calculationMethod: 'TOTAL_DISTANCE' | 'DISTANCE_IMPROVEMENT';
}

export interface TechniqueAssessmentMetric extends BaseMetric {
  techniqueElements: string[];
  calculationMethod: 'SCORE' | 'IMPROVEMENT_PERCENTAGE';
}

export interface EnduranceTestMetric extends BaseMetric {
  distance: number;
  stroke: string;
  totalReps: number;
  interval: number;
  calculationMethod: 'TOTAL_COMPLETED' | 'FASTEST_POSSIBLE_SENDOFF/INTERVAL' | 'TIME_TO_FATIGUE';
}

export interface SprintPerformanceMetric extends BaseMetric {
  distance: number;
  repetitions: number;
  calculationMethod: 'PEAK_SPEED' | 'AVERAGE_SPEED' | 'REACTION_TIME';
}

export interface DrillProficiencyMetric extends BaseMetric {
  drillName: string;
  focusArea: string;
  calculationMethod: 'REPETITION_COUNT' | 'QUALITY_SCORE' | 'IMPROVEMENT_RATE';
}

export interface StrengthBenchmarkMetric extends BaseMetric {
  exerciseName: string;
  equipment: string;
  calculationMethod: 'MAXIMUM_WEIGHT' | 'REPETITION_COUNT' | 'POWER_OUTPUT';
}

export interface RecoveryMetricMetric extends BaseMetric {
  trainingLoad: number;
  recoveryTime: number;
  calculationMethod: 'HEART_RATE_VARIABILITY' | 'PERCEIVED_EXERTION' | 'SLEEP_QUALITY';
}

export interface RaceAnalysisMetric extends BaseMetric {
  raceDistance: number;
  stroke: string;
  calculationMethod: 'SPLIT_TIMES' | 'TURN_EFFICIENCY' | 'STROKE_COUNT';
}

export interface ProgressTrackerMetric extends BaseMetric {
  baselineValue: number;
  targetValue: number;
  timeframe: number;
  calculationMethod: 'PERCENTAGE_IMPROVEMENT' | 'CONSISTENCY_SCORE' | 'GOAL_ACHIEVEMENT_RATE';
}

export interface BaseFitnessTestMetric extends BaseMetric {
  testType: 'single' | 'multi';
  totalDistance: number;
  totalTime: number;
  part1Distance?: number;
  part1Time?: number;
  restDuration?: number;
  part2Distance?: number;
  part2Time?: number;
  stroke: string;
  calculationMethod: 'AVERAGE_PACE' | 'TOTAL_TIME' | 'PACE_COMPARISON';
}


export type Metric = TimeTrialMetric | DistanceChallengeMetric | TechniqueAssessmentMetric | EnduranceTestMetric |
                     SprintPerformanceMetric | DrillProficiencyMetric | StrengthBenchmarkMetric | RecoveryMetricMetric |
                     RaceAnalysisMetric | ProgressTrackerMetric | BaseFitnessTestMetric;

export interface SwimGroup {
  id: string;
  name: string;
}



// export interface SimpleMetric {
//   id: string;
//   name: string;
//   type: MetricType;
//   description?: string;
//   maxReps?: number;  // Optional, used for 'Test Set' with 'reps'
//   goalTime?: string; // Optional, used for 'Goal Time'
//   swimmerId: string;
// }

// export interface InputResultsFormProps {
//   metric: SimpleMetric;
// }