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

export interface WorkoutData {
  id: string;
  coach_id: string;
  group_id: string;
  workout_data: SwimWorkout;
  created_at: string;
}

export interface SwimGroup {
  id: string;
  name: string;
  coach_id: string;
  group_code?: string;  // Made optional as it might not always be required
}

// Additional types for better type safety
export interface WorkoutSearchParams {
  groupId?: string;
  date?: string;
  focus?: string;
  page: number;
  itemsPerPage: number;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

// Initial state for a new workout
export const initialWorkoutState: SwimWorkout = {
  focus: '',
  warmup: [''],
  preset: [''],
  main_set: [''],
  cooldown: [''],
  // Optional fields are not included 
};


export interface Notification {
  message: string;
  type: 'success' | 'error';
}

export interface AITrainingData {
  id: string;
  group_id: string;
  training_data: SwimWorkout[];
  created_at: string;
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
  group_id: string;
  details: Record<string, any>; 
  unit?: string; 
}

export interface TimeTrialMetric extends BaseMetric {
  details: {
    distance: number;
    stroke: string;
    calculationMethod: 'BEST_TIME' | 'AVERAGE_TIME' | 'TIME_IMPROVEMENT' | 'TARGET_TIME';
    unit: string;
    targetTimeType?: 'MANUAL' | 'RELATIVE';
    targetTime?: { hours: number; minutes: number; seconds: number };
    relativeTime?: number;
  };
}

export interface DistanceChallengeMetric extends BaseMetric {
  details: {
    timeLimit: { hours: number; minutes: number; seconds: number };
    stroke: string;
    calculationMethod: 'TOTAL_DISTANCE' | 'DISTANCE_IMPROVEMENT';
    unit: string;
  };
}

export interface TechniqueAssessmentMetric extends BaseMetric {
  details: {
    techniqueElements: string[];
    calculationMethod: 'SCORE' | 'IMPROVEMENT_PERCENTAGE';
  };
}


export interface EnduranceTestMetric extends BaseMetric {
  details: {
    distance: number;
    stroke: string;
    totalReps: number;
    interval: {
      hours: number;
      minutes: number;
      seconds: number;
    };
    calculationMethod: 'TARGET_TIME' | 'TOTAL_COMPLETED' | 'FASTEST_POSSIBLE_SENDOFF' | 'TIME_TO_FATIGUE';
    unit: string;
    targetTimeType?: 'MANUAL' | 'RELATIVE';
    targetTime?: {
      hours: number;
      minutes: number;
      seconds: number;
    };
    targetIntervalType?: 'MANUAL' | 'RELATIVE'; 
    relativeInterval?: number; // Added property for relative interval
  };
}


export interface SprintPerformanceMetric extends BaseMetric {
  details: {
    distance: number;
    repetitions: number;
    calculationMethod: 'PEAK_SPEED' | 'AVERAGE_SPEED' | 'REACTION_TIME' | 'TARGET_TIME';
    unit: string;
    targetTimeType?: 'MANUAL' | 'RELATIVE';
    targetTime?: { hours: number; minutes: number; seconds: number };
    relativeTime?: number;
  };
}

export interface DrillProficiencyMetric extends BaseMetric {
  details: {
    drillName: string;
    focusArea: string;
    calculationMethod: 'REPETITION_COUNT' | 'QUALITY_SCORE' | 'IMPROVEMENT_RATE';
  };
}

export interface StrengthBenchmarkMetric extends BaseMetric {
  details: {
    exerciseName: string;
    equipment: string;
    calculationMethod: 'MAXIMUM_WEIGHT' | 'REPETITION_COUNT' | 'POWER_OUTPUT';
    unit: string;
  };
}

export interface RecoveryMetricMetric extends BaseMetric {
  details: {
    trainingLoad: number;
    recoveryTime: { hours: number; minutes: number; seconds: number };
    calculationMethod: 'HEART_RATE_VARIABILITY' | 'PERCEIVED_EXERTION' | 'SLEEP_QUALITY';
  };
}

export interface RaceAnalysisMetric extends BaseMetric {
  details: {
    raceDistance: number;
    stroke: string;
    calculationMethod: 'SPLIT_TIMES' | 'TURN_EFFICIENCY' | 'STROKE_COUNT';
    unit: string;
  };
}

export interface ProgressTrackerMetric extends BaseMetric {
  details: {
    baselineValue: number;
    targetValue: number;
    timeframe: number;
    calculationMethod: 'PERCENTAGE_IMPROVEMENT' | 'CONSISTENCY_SCORE' | 'GOAL_ACHIEVEMENT_RATE';
    unit: string;
  };
}

export interface BaseFitnessTestMetric extends BaseMetric {
  details: {
    testType: 'single' | 'multi';
    totalDistance: number;
    totalTime?: { hours: number; minutes: number; seconds: number };
    part1Distance?: number;
    part1Time?: { hours: number; minutes: number; seconds: number };
    restDuration?: { hours: number; minutes: number; seconds: number };
    part2Distance?: number;
    part2Time?: { hours: number; minutes: number; seconds: number };
    stroke: string;
    calculationMethod: 'AVERAGE_PACE' | 'TOTAL_TIME' | 'PACE_COMPARISON' | 'TARGET_TIME';
    unit: string;
    targetTimeType?: 'MANUAL' | 'RELATIVE';
    targetTime?: { hours: number; minutes: number; seconds: number };
    relativeTime?: number;
  };
}

export type Metric = TimeTrialMetric | DistanceChallengeMetric | TechniqueAssessmentMetric | EnduranceTestMetric |
                     SprintPerformanceMetric | DrillProficiencyMetric | StrengthBenchmarkMetric | RecoveryMetricMetric |
                      RaceAnalysisMetric | ProgressTrackerMetric | BaseFitnessTestMetric;


export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  group_id?: string;
  group_name?: string;
  coach_first_name?: string;
  coach_last_name?: string;
}

// interfaces/index.ts

export interface SwimMeet {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  course: 'SCY' | 'SCM' | 'LCM';
}

export interface DashboardMetrics {
  totalSwimmers: number;
  totalGroups: number;
  activeSwimmers: number;
  totalBadgesAwarded: number;
  attendanceRate: number;
}

export interface SwimEvent {
  id: string;
  name: string;
  course: string;
}

export interface SwimResult {
  id: string;
  swimmer_id: string;
  meet_name: string;
  event: string;
  time: string;
  date: Date;
  course: string;
  is_personal_best: boolean;
  best_time?: string;
}

export interface Swimmer {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  ageGroup: string;
}

export interface SwimStandard {
  id: string;
  age_group: string;
  gender: string;
  event: string;
  course: string;
  b_standard: string;  // Interval will be returned as a string
  bb_standard: string;
  a_standard: string;
  aa_standard: string;
  aaa_standard: string;
  aaaa_standard: string;
  created_at: string;
  updated_at: string;
}


export type ActivityType = 
  | 'practice'
  | 'meet'
  | 'event'
  | 'time_trial'
  | 'clinic'
  | 'social';

export type ActivitySkillLevel = 
  | 'all'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'B'
  | 'BB'
  | 'A'
  | 'AA'
  | 'AAA'
  | 'AAAA';

export type ActivityResponseStatus = 'attending' | 'interested' | 'not_attending';



// Response Interfaces
export interface ActivityResponse {
  id?: string;
  activity_id: string;
  swimmer_id: string;
  status: ActivityResponseStatus;
  count?: number;
  additional_info?: string;
  created_at?: string;
  updated_at?: string;
}

// Additional Details Interfaces
export interface ActivityAdditionalDetails {
  equipment_needed: string | null;
  preparation_notes: string | null;
  capacity_limit: string | null;
  skill_level: ActivitySkillLevel;
  virtual_link: string | null;
  minimum_standard: string | null;
  recommended_standard: string | null;
}

// Form specific interface for additional details
export interface ActivityFormAdditionalDetails {
  equipment_needed: string;
  preparation_notes: string;
  capacity_limit: string;
  skill_level: ActivitySkillLevel;
  virtual_link: string;
  minimum_standard: string;
  recommended_standard: string;
}

// Form Data Interface
export interface ActivityFormData {
  title: string;
  description: string;
  activity_type: ActivityType;
  start_date: string;
  end_date: string | null;
  location: string;
  groups: SwimGroup[];
  additional_details: ActivityFormAdditionalDetails;
}

// Complete Activity Interface
// export interface UpcomingActivity {
//   id: string;
//   title: string;
//   description: string;
//   activity_type: ActivityType;
//   start_date: string;
//   end_date: string | null;
//   location: string;
//   groups: SwimGroup[];
//   responses?: ActivityResponse[];
//   additional_details: ActivityAdditionalDetails;
//   coach_id?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// Validation Interface
export interface ActivityValidationError {
  title?: string;
  description?: string;
  activity_type?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  groups?: string;
  additional_details?: {
    equipment_needed?: string;
    preparation_notes?: string;
    capacity_limit?: string;
    skill_level?: string;
    virtual_link?: string;
    minimum_standard?: string;
    recommended_standard?: string;
  };
}

// Feed Item Interface
export interface ActivityFeedItem {
  id: string;
  swimmer_id?: string;
  group_id: string;
  coach_id: string;
  activity_type: 'achievement' | 'swim_result' | 'badge_earned' | 'attendance';
  title: string;
  description: string;
  reference_id: string;
  reference_table: string;
  created_at: string;
  swimmer: {
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

// Conversion Utilities
export const convertFormDataToActivity = (
  formData: ActivityFormData
): Partial<UpcomingActivity> => {
  return {
    ...formData,
    additional_details: {
      equipment_needed: formData.additional_details.equipment_needed || null,
      preparation_notes: formData.additional_details.preparation_notes || null,
      capacity_limit: formData.additional_details.capacity_limit || null,
      skill_level: formData.additional_details.skill_level,
      virtual_link: formData.additional_details.virtual_link || null,
      minimum_standard: formData.additional_details.minimum_standard || null,
      recommended_standard: formData.additional_details.recommended_standard || null,
    }
  };
};

// types/activities.ts
export interface ActivityFormData {
  title: string;
  description: string;
  activity_type: ActivityType;
  start_date: string;
  end_date: string | null;
  location: string;
  groups: SwimGroup[];
  additional_details: {
    equipment_needed: string;
    preparation_notes: string;
    capacity_limit: string;
    skill_level: ActivitySkillLevel;
    virtual_link: string;
    minimum_standard: string;
    recommended_standard: string;
  };
}

export interface UpcomingActivity {
  id: string;
  title: string;
  description: string;
  activity_type: ActivityType;
  start_date: string;
  end_date: string | null;
  location: string;
  groups: SwimGroup[];
  responses?: ActivityResponse[];
  additional_details: {
    equipment_needed: string | null;
    preparation_notes: string | null;
    capacity_limit: string | null;
    skill_level: ActivitySkillLevel;
    virtual_link: string | null;
    minimum_standard: string | null;
    recommended_standard: string | null;
  };
  coach_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SwimmerActivitiesListProps {
  activities: UpcomingActivity[];
  onRespond: (
    activityId: string, 
    status: ActivityResponseStatus,
    additionalInfo?: string
  ) => Promise<void>;
  isLoading?: boolean;
  currentResponse?: {
    activityId: string;
    status: ActivityResponseStatus;
  }[];
}

export interface ActivityResponse {
  activity_id: string;
  status: ActivityResponseStatus;
}



export interface ActivityResponseDetails {
  swimmer_id: string;
  first_name: string;
  last_name: string;
  response_status: ActivityResponseStatus;
  additional_info?: string;
  status_updated_at: string;
}

export interface ActivityResponseSummary {
  summary: {
    total_responses: number;
    status_counts: {
      attending?: number;
      interested?: number;
      not_attending?: number;
    };
    attending_swimmers: Array<{
      id?: string;  // Only for coaches
      name: string;
    }>;
  };
  user_response?: {
    status: ActivityResponseStatus;
    additional_info?: string;
    updated_at: string;
  };
}

export interface ActivityResponse {
  activity_id: string;
  swimmer_id: string;
  response_status: ActivityResponseStatus;
  additional_info?: string;
  status_updated_at: string;
}

export interface ActivityResponsesProps {
  activityId: string;
  showDetailedView?: boolean;
  onResponseUpdate?: () => void;
}

export interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: ActivityResponseStatus, additionalInfo?: string) => Promise<void>;
  activity: UpcomingActivity;
  initialStatus?: ActivityResponseStatus;
  initialInfo?: string;
}

export interface ResponseSummaryProps {
  summary: ActivityResponseSummary;
  isCoach: boolean;
}

export interface DetailedResponsesProps {
  responses: ActivityResponseDetails[];
  onResponseUpdate?: () => void;
}


export type SettingsSection = 'profile' | 'account' | 'preferences' | 'delete' | null;

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: 'coach' | 'swimmer';
}

export interface SettingsProps {
  onClose: () => void;
  onSave?: () => void;
  isLoading?: boolean;
}

export type AccountStatus = 'active' | 'deleted' | 'recovered';

export interface SoftDeleteFields {
  deleted_at: Date | null;
  status: AccountStatus;
  is_active: boolean;
  recovery_token: string | null;  // Used for account recovery
  deletion_reason?: string;       // Optional field for deletion reason
}

export interface DeleteAccountResult {
  success: boolean;
  error: string | null;
  recoveryToken?: string;
}