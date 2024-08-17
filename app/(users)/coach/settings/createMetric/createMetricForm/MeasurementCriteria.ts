import { PerformanceIndicatorType, MeasurementCriteria} from '../../../../../lib/types';

export const measurementCriteria: Record<PerformanceIndicatorType, MeasurementCriteria[]> = {
    'Test Set': [
      { question: 'How will you like to measure this?', type: 'select', options: ['Number of successful reps', 'Total distance', 'Time', 'Scale 1-10', 'Heart Rate', 'Perceived Effort'] },
      { question: 'What is the total reps?', type: 'number' },
      { question: 'Describe the test set and aim', type: 'text' },
      { question: 'Specify rest intervals (if any)', type: 'text' },
    ],
    'Benchmark': [
      { question: 'Set the target score for 100% success', type: 'number' },
      { question: 'Describe the benchmark', type: 'text' },
      { question: 'Measurement scale (1-10, A-F, etc.)', type: 'select', options: ['1-5', '1-10', 'A-F', 'Pass/Fail'] },
      { question: 'Set a time limit (if any)', type: 'text' },
    ],
    'Skill Assessment': [
      { question: 'Specify the skills to be assessed', type: 'text' },
      { question: 'Set the rating scale (1-10, etc.)', type: 'select', options: ['1-5', '1-10', 'A-F', 'Novice to Expert'] },
      { question: 'Provide a description for each skill level', type: 'text' },
      { question: 'Include specific drills or exercises', type: 'text' },
    ],
    'Goal Achievement': [
      { question: 'Define the goal to be achieved', type: 'text' },
      { question: 'Set the target date for achievement', type: 'text' },
      { question: 'Specify the criteria for success', type: 'text' },
      { question: 'Include milestones or checkpoints', type: 'text' },
    ],
  };
  