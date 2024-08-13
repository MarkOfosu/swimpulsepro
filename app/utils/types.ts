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
