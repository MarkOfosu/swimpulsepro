import React from 'react';
import { 
  Metric, 
  SwimGroup, 
  MetricCategory,
  TimeTrialMetric,
  EnduranceTestMetric,
  DistanceChallengeMetric,
  TechniqueAssessmentMetric,
  SprintPerformanceMetric,
  DrillProficiencyMetric,
  StrengthBenchmarkMetric,
  RecoveryMetricMetric,
  RaceAnalysisMetric,
  ProgressTrackerMetric,
  BaseFitnessTestMetric
} from '../../../lib/types';
import styles from '../../../styles/MetricCreationForm.module.css';

interface MetricPreviewProps {
  metric: Partial<Metric>;
  timeValue: { hours: number; minutes: number; seconds: number };
  coachGroups: SwimGroup[];
}

const MetricPreview: React.FC<MetricPreviewProps> = ({ metric, timeValue, coachGroups }) => {
  const renderCategorySpecificPreview = () => {
    switch (metric.category) {
      case MetricCategory.TimeTrial:
        const timeTrialMetric = metric as Partial<TimeTrialMetric>;
        return (
          <>
            <p><strong>Distance:</strong> {timeTrialMetric.distance} m</p>
            <p><strong>Stroke:</strong> {timeTrialMetric.stroke}</p>
            <p><strong>Calculation Method:</strong> {timeTrialMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.EnduranceTest:
        const enduranceTestMetric = metric as Partial<EnduranceTestMetric>;
        return (
          <>
            <p><strong>Distance per Rep:</strong> {enduranceTestMetric.distance} m</p>
            <p><strong>Stroke:</strong> {enduranceTestMetric.stroke}</p>
            <p><strong>Total Reps:</strong> {enduranceTestMetric.totalReps}</p>
            <p><strong>Target Interval:</strong> {enduranceTestMetric.interval} seconds</p>
            <p><strong>Calculation Method:</strong> {enduranceTestMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.DistanceChallenge:
        const distanceChallengeMetric = metric as Partial<DistanceChallengeMetric>;
        return (
          <>
            <p><strong>Time Limit:</strong> {distanceChallengeMetric.timeLimit} seconds</p>
            <p><strong>Stroke:</strong> {distanceChallengeMetric.stroke}</p>
            <p><strong>Calculation Method:</strong> {distanceChallengeMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.TechniqueAssessment:
        const techniqueAssessmentMetric = metric as Partial<TechniqueAssessmentMetric>;
        return (
          <>
            <p><strong>Technique Elements:</strong> {techniqueAssessmentMetric.techniqueElements?.join(', ')}</p>
            <p><strong>Calculation Method:</strong> {techniqueAssessmentMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.SprintPerformance:
        const sprintPerformanceMetric = metric as Partial<SprintPerformanceMetric>;
        return (
          <>
            <p><strong>Distance:</strong> {sprintPerformanceMetric.distance} m</p>
            <p><strong>Repetitions:</strong> {sprintPerformanceMetric.repetitions}</p>
            <p><strong>Calculation Method:</strong> {sprintPerformanceMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.DrillProficiency:
        const drillProficiencyMetric = metric as Partial<DrillProficiencyMetric>;
        return (
          <>
            <p><strong>Drill Name:</strong> {drillProficiencyMetric.drillName}</p>
            <p><strong>Focus Area:</strong> {drillProficiencyMetric.focusArea}</p>
            <p><strong>Calculation Method:</strong> {drillProficiencyMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.StrengthBenchmark:
        const strengthBenchmarkMetric = metric as Partial<StrengthBenchmarkMetric>;
        return (
          <>
            <p><strong>Exercise Name:</strong> {strengthBenchmarkMetric.exerciseName}</p>
            <p><strong>Equipment:</strong> {strengthBenchmarkMetric.equipment}</p>
            <p><strong>Calculation Method:</strong> {strengthBenchmarkMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.RecoveryMetric:
        const recoveryMetricMetric = metric as Partial<RecoveryMetricMetric>;
        return (
          <>
            <p><strong>Training Load:</strong> {recoveryMetricMetric.trainingLoad}</p>
            <p><strong>Recovery Time:</strong> {recoveryMetricMetric.recoveryTime} hours</p>
            <p><strong>Calculation Method:</strong> {recoveryMetricMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.RaceAnalysis:
        const raceAnalysisMetric = metric as Partial<RaceAnalysisMetric>;
        return (
          <>
            <p><strong>Race Distance:</strong> {raceAnalysisMetric.raceDistance} m</p>
            <p><strong>Stroke:</strong> {raceAnalysisMetric.stroke}</p>
            <p><strong>Calculation Method:</strong> {raceAnalysisMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.ProgressTracker:
        const progressTrackerMetric = metric as Partial<ProgressTrackerMetric>;
        return (
          <>
            <p><strong>Baseline Value:</strong> {progressTrackerMetric.baselineValue}</p>
            <p><strong>Target Value:</strong> {progressTrackerMetric.targetValue}</p>
            <p><strong>Timeframe:</strong> {progressTrackerMetric.timeframe} days</p>
            <p><strong>Calculation Method:</strong> {progressTrackerMetric.calculationMethod}</p>
          </>
        );
      case MetricCategory.BaseFitnessTest:
        const baseFitnessTestMetric = metric as Partial<BaseFitnessTestMetric>;
        return (
          <>
            <p><strong>Test Type:</strong> {baseFitnessTestMetric.testType}</p>
            <p><strong>Total Distance:</strong> {baseFitnessTestMetric.totalDistance} m</p>
            <p><strong>Total Time:</strong> {baseFitnessTestMetric.totalTime} seconds</p>
            <p><strong>Stroke:</strong> {baseFitnessTestMetric.stroke}</p>
            <p><strong>Calculation Method:</strong> {baseFitnessTestMetric.calculationMethod}</p>
            {baseFitnessTestMetric.testType === 'multi' && (
              <>
                <p><strong>Part 1 Distance:</strong> {baseFitnessTestMetric.part1Distance} m</p>
                <p><strong>Part 1 Time:</strong> {baseFitnessTestMetric.part1Time} seconds</p>
                <p><strong>Rest Duration:</strong> {baseFitnessTestMetric.restDuration} seconds</p>
                <p><strong>Part 2 Distance:</strong> {baseFitnessTestMetric.part2Distance} m</p>
                <p><strong>Part 2 Time:</strong> {baseFitnessTestMetric.part2Time} seconds</p>
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.preview}>
      <h3>Metric Preview</h3>
      <p><strong>Name:</strong> {metric.name}</p>
      <p><strong>Category:</strong> {metric.category}</p>
      <p><strong>Description:</strong> {metric.description}</p>
      <p><strong>Unit:</strong> {metric.unit}</p>
      {metric.unit === 'time' && (
        <p><strong>Time Value:</strong> {`${timeValue.hours.toString().padStart(2, '0')}:${timeValue.minutes.toString().padStart(2, '0')}:${timeValue.seconds.toString().padStart(2, '0')}`}</p>
      )}
      <p><strong>Group:</strong> {coachGroups.find(g => g.id === metric.group_id)?.name}</p>
      {renderCategorySpecificPreview()}
    </div>
  );
};

export default MetricPreview;