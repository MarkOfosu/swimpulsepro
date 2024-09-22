import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import styles from '../../../styles/MetricCreationForm.module.css';
import TipsSection from './TipsSection';
import { 
  MetricCategory, 
  TimeTrialMetric, 
  DistanceChallengeMetric, 
  TechniqueAssessmentMetric, 
  EnduranceTestMetric, 
  SprintPerformanceMetric, 
  DrillProficiencyMetric, 
  StrengthBenchmarkMetric, 
  RecoveryMetricMetric, 
  RaceAnalysisMetric, 
  ProgressTrackerMetric, 
  BaseFitnessTestMetric, 
  Metric, 
  SwimGroup 
} from '../../../lib/types';

const supabase = createClient();

const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];
const unitOptions = ['time', 'meters', 'yards', 'laps', 'points', 'percent', 'score', 'reps', 'sets', 'count'];

const MetricCreationForm: React.FC = () => {
  const [metric, setMetric] = useState<Partial<Metric>>({
    category: MetricCategory.TimeTrial,
    name: '',
    description: '',
    unit: '',
    group_id: '',
  });
  const [coachGroups, setCoachGroups] = useState<SwimGroup[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchCoachGroups();
  }, []);

  const fetchCoachGroups = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('swim_groups')
        .select('id, name')
        .eq('coach_id', user.id);
      
      if (error) {
        console.error('Error fetching coach groups:', error);
      } else {
        setCoachGroups(data);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({
      ...prevMetric,
      [fieldName]: {
        ...((prevMetric[fieldName as keyof Metric] as unknown) as Record<string, number> || {}),
        [name]: value === '' ? 0 : parseInt(value, 10)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const metricDetails = {
      name: metric.name,
      description: metric.description,
      category: metric.category,
      unit: metric.unit,
      group_id: metric.group_id,
      details: {} as Record<string, any>
    };

    // Add category-specific details
    switch (metric.category) {
      case MetricCategory.TimeTrial:
        metricDetails.details = {
          distance: (metric as TimeTrialMetric).distance,
          stroke: (metric as TimeTrialMetric).stroke,
          calculationMethod: (metric as TimeTrialMetric).calculationMethod
        };
        break;
      case MetricCategory.DistanceChallenge:
        metricDetails.details = {
          timeLimit: (metric as DistanceChallengeMetric).timeLimit,
          stroke: (metric as DistanceChallengeMetric).stroke,
          calculationMethod: (metric as DistanceChallengeMetric).calculationMethod
        };
        break;
      case MetricCategory.TechniqueAssessment:
        metricDetails.details = {
          techniqueElements: (metric as TechniqueAssessmentMetric).techniqueElements,
          calculationMethod: (metric as TechniqueAssessmentMetric).calculationMethod
        };
        break;
      case MetricCategory.EnduranceTest:
        metricDetails.details = {
          distance: (metric as EnduranceTestMetric).distance,
          stroke: (metric as EnduranceTestMetric).stroke,
          totalReps: (metric as EnduranceTestMetric).totalReps,
          interval: (metric as EnduranceTestMetric).interval,
          calculationMethod: (metric as EnduranceTestMetric).calculationMethod
        };
        break;
      case MetricCategory.SprintPerformance:
        metricDetails.details = {
          distance: (metric as SprintPerformanceMetric).distance,
          repetitions: (metric as SprintPerformanceMetric).repetitions,
          calculationMethod: (metric as SprintPerformanceMetric).calculationMethod
        };
        break;
      case MetricCategory.DrillProficiency:
        metricDetails.details = {
          drillName: (metric as DrillProficiencyMetric).drillName,
          focusArea: (metric as DrillProficiencyMetric).focusArea,
          calculationMethod: (metric as DrillProficiencyMetric).calculationMethod
        };
        break;
      case MetricCategory.StrengthBenchmark:
        metricDetails.details = {
          exerciseName: (metric as StrengthBenchmarkMetric).exerciseName,
          equipment: (metric as StrengthBenchmarkMetric).equipment,
          calculationMethod: (metric as StrengthBenchmarkMetric).calculationMethod
        };
        break;
      case MetricCategory.RecoveryMetric:
        metricDetails.details = {
          trainingLoad: (metric as RecoveryMetricMetric).trainingLoad,
          recoveryTime: (metric as RecoveryMetricMetric).recoveryTime,
          calculationMethod: (metric as RecoveryMetricMetric).calculationMethod
        };
        break;
      case MetricCategory.RaceAnalysis:
        metricDetails.details = {
          raceDistance: (metric as RaceAnalysisMetric).raceDistance,
          stroke: (metric as RaceAnalysisMetric).stroke,
          calculationMethod: (metric as RaceAnalysisMetric).calculationMethod
        };
        break;
      case MetricCategory.ProgressTracker:
        metricDetails.details = {
          baselineValue: (metric as ProgressTrackerMetric).baselineValue,
          targetValue: (metric as ProgressTrackerMetric).targetValue,
          timeframe: (metric as ProgressTrackerMetric).timeframe,
          calculationMethod: (metric as ProgressTrackerMetric).calculationMethod
        };
        break;
      case MetricCategory.BaseFitnessTest:
        metricDetails.details = {
          testType: (metric as BaseFitnessTestMetric).testType,
          totalDistance: (metric as BaseFitnessTestMetric).totalDistance,
          totalTime: (metric as BaseFitnessTestMetric).totalTime,
          stroke: (metric as BaseFitnessTestMetric).stroke,
          calculationMethod: (metric as BaseFitnessTestMetric).calculationMethod,
          ...(metric as BaseFitnessTestMetric).testType === 'multi' ? {
            part1Distance: (metric as BaseFitnessTestMetric).part1Distance,
            part1Time: (metric as BaseFitnessTestMetric).part1Time,
            restDuration: (metric as BaseFitnessTestMetric).restDuration,
            part2Distance: (metric as BaseFitnessTestMetric).part2Distance,
            part2Time: (metric as BaseFitnessTestMetric).part2Time
          } : {}
        };
        break;
    }

    try {
      const { data, error } = await supabase
        .from('metrics')
        .insert([metricDetails]);
      
      if (error) throw error;
      console.log('Metric created successfully:', data);
      alert('Metric created successfully!');
      resetForm();
    } catch (error) {
      console.error('Error creating metric:', error);
      alert('Error creating metric. Please try again.');
    }
  };

  const resetForm = () => {
    setMetric({
      category: MetricCategory.TimeTrial,
      name: '',
      description: '',
      unit: '',
      group_id: '',
    });
    setShowPreview(false);
  };

  const renderTimeInput = (fieldName: string, label: string) => {
    const timeValue = metric[fieldName as keyof Metric] as { hours?: number; minutes?: number; seconds?: number } || {};
    return (
      <div>
        <label className={styles.label}>{label}</label>
        <div className={styles.timeInputContainer}>
          <input
            type="number"
            name="hours"
            value={timeValue.hours || 0}
            onChange={(e) => handleTimeChange(e, fieldName)}
            min="0"
            placeholder="HH"
            className={styles.timeInput}
          />
          :
          <input
            type="number"
            name="minutes"
            value={timeValue.minutes || 0}
            onChange={(e) => handleTimeChange(e, fieldName)}
            min="0"
            max="59"
            placeholder="MM"
            className={styles.timeInput}
          />
          :
          <input
            type="number"
            name="seconds"
            value={timeValue.seconds || 0}
            onChange={(e) => handleTimeChange(e, fieldName)}
            min="0"
            max="59"
            placeholder="SS"
            className={styles.timeInput}
          />
        </div>
      </div>
    );
  };

  const renderCategorySpecificFields = () => {
    switch (metric.category) {
      case MetricCategory.TimeTrial:
        return (
          <>
            <label className={styles.label}>Distance</label>
            <input
              className={styles.input}
              name="distance"
              type="number"
              value={(metric as TimeTrialMetric).distance || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={(metric as TimeTrialMetric).stroke || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a stroke</option>
              {strokeOptions.map(stroke => (
                <option key={stroke} value={stroke}>{stroke}</option>
              ))}
            </select>
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as TimeTrialMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="BEST_TIME">Best Time</option>
              <option value="AVERAGE_TIME">Average Time</option>
              <option value="TIME_IMPROVEMENT">Time Improvement</option>
            </select>
          </>
        );
      case MetricCategory.DistanceChallenge:
        return (
          <>
            {renderTimeInput('timeLimit', 'Time Limit')}
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={(metric as DistanceChallengeMetric).stroke || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a stroke</option>
              {strokeOptions.map(stroke => (
                <option key={stroke} value={stroke}>{stroke}</option>
              ))}
            </select>
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as DistanceChallengeMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="TOTAL_DISTANCE">Total Distance</option>
              <option value="DISTANCE_IMPROVEMENT">Distance Improvement</option>
            </select>
          </>
        );
      case MetricCategory.TechniqueAssessment:
        return (
          <>
            <label className={styles.label}>Technique Elements (comma-separated)</label>
            <input
              className={styles.input}
              name="techniqueElements"
              value={(metric as TechniqueAssessmentMetric).techniqueElements?.join(',') || ''}
              onChange={(e) => {
                const elements = e.target.value.split(',').map(elem => elem.trim());
                setMetric(prevMetric => ({ 
                  ...prevMetric, 
                  techniqueElements: elements
                }));
              }}
              placeholder="e.g., Body position, Arm pull, Kick"
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as TechniqueAssessmentMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="SCORE">Score (1-5 scale)</option>
              <option value="IMPROVEMENT_PERCENTAGE">Improvement Percentage</option>
            </select>
          </>
        );
      case MetricCategory.EnduranceTest:
        return (
          <>
            <label className={styles.label}>Distance per Rep </label>
            <input
              className={styles.input}
              name="distance"
              type="number"
              value={(metric as EnduranceTestMetric).distance || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={(metric as EnduranceTestMetric).stroke || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a stroke</option>
              {strokeOptions.map(stroke => (
                <option key={stroke} value={stroke}>{stroke}</option>
              ))}
            </select>
            <label className={styles.label}>Total Reps</label>
            <input
              className={styles.input}
              name="totalReps"
              type="number"
              value={(metric as EnduranceTestMetric).totalReps || ''}
              onChange={handleInputChange}
              required
            />
            {renderTimeInput('interval', 'Target Interval')}
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as EnduranceTestMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="TOTAL_COMPLETED">Total Completed Reps</option>
              <option value="FASTEST_POSSIBLE_SENDOFF">Fastest Possible Sendoff/Interval</option>
              <option value="TIME_TO_FATIGUE">Time to Fatigue</option>
            </select>
          </>
        );
      case MetricCategory.SprintPerformance:
        return (
          <>
            <label className={styles.label}>Distance </label>
            <input
              className={styles.input}
              name="distance"
              type="number"
              value={(metric as SprintPerformanceMetric).distance || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Repetitions</label>
            <input
              className={styles.input}
              name="repetitions"
              type="number"
              value={(metric as SprintPerformanceMetric).repetitions || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as SprintPerformanceMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="PEAK_SPEED">Peak Speed</option>
              <option value="AVERAGE_SPEED">Average Speed</option>
              <option value="REACTION_TIME">Reaction Time</option>
            </select>
          </>
        );
      case MetricCategory.DrillProficiency:
        return (
          <>
            <label className={styles.label}>Drill Name</label>
            <input
              className={styles.input}
              name="drillName"
              value={(metric as DrillProficiencyMetric).drillName || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Focus Area</label>
            <input
              className={styles.input}
              name="focusArea"
              value={(metric as DrillProficiencyMetric).focusArea || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as DrillProficiencyMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="REPETITION_COUNT">Repetition Count</option>
              <option value="QUALITY_SCORE">Quality Score</option>
              <option value="IMPROVEMENT_RATE">Improvement Rate</option>
            </select>
          </>
        );
      case MetricCategory.StrengthBenchmark:
        return (
          <>
            <label className={styles.label}>Exercise Name</label>
            <input
              className={styles.input}
              name="exerciseName"
              value={(metric as StrengthBenchmarkMetric).exerciseName || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Equipment</label>
            <input
              className={styles.input}
              name="equipment"
              value={(metric as StrengthBenchmarkMetric).equipment || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as StrengthBenchmarkMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="MAXIMUM_WEIGHT">Maximum Weight/Resistance</option>
              <option value="REPETITION_COUNT">Repetition Count</option>
              <option value="POWER_OUTPUT">Power Output</option>
            </select>
          </>
        );
      case MetricCategory.RecoveryMetric:
        return (
          <>
            <label className={styles.label}>Training Load (1-10)</label>
            <input
              className={styles.input}
              name="trainingLoad"
              type="number"
              min="1"
              max="10"
              value={(metric as RecoveryMetricMetric).trainingLoad || ''}
              onChange={handleInputChange}
              required
            />
            {renderTimeInput('recoveryTime', 'Recovery Time')}
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as RecoveryMetricMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="HEART_RATE_VARIABILITY">Heart Rate Variability</option>
              <option value="PERCEIVED_EXERTION">Perceived Exertion</option>
              <option value="SLEEP_QUALITY">Sleep Quality</option>
            </select>
          </>
        );
      case MetricCategory.RaceAnalysis:
        return (
          <>
            <label className={styles.label}>Race Distance </label>
            <input
              className={styles.input}
              name="raceDistance"
              type="number"
              value={(metric as RaceAnalysisMetric).raceDistance || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={(metric as RaceAnalysisMetric).stroke || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a stroke</option>
              {strokeOptions.map(stroke => (
                <option key={stroke} value={stroke}>{stroke}</option>
              ))}
            </select>
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as RaceAnalysisMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="SPLIT_TIMES">Split Times</option>
              <option value="TURN_EFFICIENCY">Turn Efficiency</option>
              <option value="STROKE_COUNT">Stroke Count</option>
            </select>
          </>
        );
      case MetricCategory.ProgressTracker:
        return (
          <>
            <label className={styles.label}>Baseline Value</label>
            <input
              className={styles.input}
              name="baselineValue"
              type="number"
              value={(metric as ProgressTrackerMetric).baselineValue || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Target Value</label>
            <input
              className={styles.input}
              name="targetValue"
              type="number"
              value={(metric as ProgressTrackerMetric).targetValue || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Timeframe (days)</label>
            <input
              className={styles.input}
              name="timeframe"
              type="number"
              value={(metric as ProgressTrackerMetric).timeframe || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as ProgressTrackerMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="PERCENTAGE_IMPROVEMENT">Percentage Improvement</option>
              <option value="CONSISTENCY_SCORE">Consistency Score</option>
              <option value="GOAL_ACHIEVEMENT_RATE">Goal Achievement Rate</option>
            </select>
          </>
        );
      case MetricCategory.BaseFitnessTest:
        return (
          <>
            <label className={styles.label}>Test Type</label>
            <select
              className={styles.select}
              name="testType"
              value={(metric as BaseFitnessTestMetric).testType || ''}
              onChange={handleInputChange}
              required
            >
              <option value="single">Single</option>
              <option value="multi">Multi</option>
            </select>
            <label className={styles.label}>Total Distance </label>
            <input
              className={styles.input}
              name="totalDistance"
              type="number"
              value={(metric as BaseFitnessTestMetric).totalDistance || ''}
              onChange={handleInputChange}
              required
            />
            {renderTimeInput('totalTime', 'Total Time')}
            {(metric as BaseFitnessTestMetric).testType === 'multi' && (
              <>
                <label className={styles.label}>Part 1 Distance </label>
                <input
                  className={styles.input}
                  name="part1Distance"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).part1Distance || ''}
                  onChange={handleInputChange}
                  required
                />
                {renderTimeInput('part1Time', 'Part 1 Time')}
                {renderTimeInput('restDuration', 'Rest Duration')}
                <label className={styles.label}>Part 2 Distance</label>
                <input
                  className={styles.input}
                  name="part2Distance"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).part2Distance || ''}
                  onChange={handleInputChange}
                  required
                />
                {renderTimeInput('part2Time', 'Part 2 Time')}
              </>
            )}
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={(metric as BaseFitnessTestMetric).stroke || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a stroke</option>
              {strokeOptions.map(stroke => (
                <option key={stroke} value={stroke}>{stroke}</option>
              ))}
            </select>
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as BaseFitnessTestMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="AVERAGE_PACE">Average Pace</option>
              <option value="TOTAL_TIME">Total Time</option>
              <option value="PACE_COMPARISON">Pace Comparison</option>
            </select>
          </>
        );
      default:
        return null;
    }
  };

  const renderMetricPreview = () => {
    if (!showPreview) return null;
    return (
      <div className={styles.preview}>
        <h3>Metric Preview</h3>
        <p><strong>Name:</strong> {metric.name}</p>
        <p><strong>Category:</strong> {metric.category}</p>
        <p><strong>Description:</strong> {metric.description}</p>
        <p><strong>Unit:</strong> {metric.unit}</p>
        <p><strong>Group:</strong> {coachGroups.find(g => g.id === metric.group_id)?.name}</p>
        {renderCategorySpecificPreview()}
      </div>
    );
  };

  const renderCategorySpecificPreview = () => {
    switch (metric.category) {
      case MetricCategory.TimeTrial:
        return (
          <>
            <p><strong>Distance:</strong> {(metric as TimeTrialMetric).distance}{metric.unit === 'yards' ? ' yd' : ' m'}</p>
            <p><strong>Stroke:</strong> {(metric as TimeTrialMetric).stroke}</p>
            <p><strong>Calculation Method:</strong> {(metric as TimeTrialMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.DistanceChallenge:
        return (
          <>
            <p><strong>Time Limit:</strong> {formatTime((metric as DistanceChallengeMetric).timeLimit)}</p>
            <p><strong>Stroke:</strong> {(metric as DistanceChallengeMetric).stroke}</p>
            <p><strong>Calculation Method:</strong> {(metric as DistanceChallengeMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.TechniqueAssessment:
        return (
          <>
            <p><strong>Technique Elements:</strong> {(metric as TechniqueAssessmentMetric).techniqueElements?.join(', ')}</p>
            <p><strong>Calculation Method:</strong> {(metric as TechniqueAssessmentMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.EnduranceTest:
        return (
          <>
            <p><strong>Distance per Rep:</strong> {(metric as EnduranceTestMetric).distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
            <p><strong>Stroke:</strong> {(metric as EnduranceTestMetric).stroke}</p>
            <p><strong>Total Reps:</strong> {(metric as EnduranceTestMetric).totalReps}</p>
            <p><strong>Target Interval:</strong> {formatTime((metric as EnduranceTestMetric).interval)}</p>
            <p><strong>Calculation Method:</strong> {(metric as EnduranceTestMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.SprintPerformance:
        return (
          <>
            <p><strong>Distance:</strong> {(metric as SprintPerformanceMetric).distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
            <p><strong>Repetitions:</strong> {(metric as SprintPerformanceMetric).repetitions}</p>
            <p><strong>Calculation Method:</strong> {(metric as SprintPerformanceMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.DrillProficiency:
        return (
          <>
            <p><strong>Drill Name:</strong> {(metric as DrillProficiencyMetric).drillName}</p>
            <p><strong>Focus Area:</strong> {(metric as DrillProficiencyMetric).focusArea}</p>
            <p><strong>Calculation Method:</strong> {(metric as DrillProficiencyMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.StrengthBenchmark:
        return (
          <>
            <p><strong>Exercise Name:</strong> {(metric as StrengthBenchmarkMetric).exerciseName}</p>
            <p><strong>Equipment:</strong> {(metric as StrengthBenchmarkMetric).equipment}</p>
            <p><strong>Calculation Method:</strong> {(metric as StrengthBenchmarkMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.RecoveryMetric:
        return (
          <>
            <p><strong>Training Load:</strong> {(metric as RecoveryMetricMetric).trainingLoad}</p>
            <p><strong>Recovery Time:</strong> {formatTime((metric as RecoveryMetricMetric).recoveryTime)}</p>
            <p><strong>Calculation Method:</strong> {(metric as RecoveryMetricMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.RaceAnalysis:
        return (
          <>
            <p><strong>Race Distance:</strong> {(metric as RaceAnalysisMetric).raceDistance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
            <p><strong>Stroke:</strong> {(metric as RaceAnalysisMetric).stroke}</p>
            <p><strong>Calculation Method:</strong> {(metric as RaceAnalysisMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.ProgressTracker:
        return (
          <>
            <p><strong>Baseline Value:</strong> {(metric as ProgressTrackerMetric).baselineValue}</p>
            <p><strong>Target Value:</strong> {(metric as ProgressTrackerMetric).targetValue}</p>
            <p><strong>Timeframe:</strong> {(metric as ProgressTrackerMetric).timeframe} days</p>
            <p><strong>Calculation Method:</strong> {(metric as ProgressTrackerMetric).calculationMethod}</p>
          </>
        );
      case MetricCategory.BaseFitnessTest:
        return (
          <>
            <p><strong>Test Type:</strong> {(metric as BaseFitnessTestMetric).testType}</p>
            <p><strong>Total Distance:</strong> {(metric as BaseFitnessTestMetric).totalDistance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
            <p><strong>Total Time:</strong> {formatTime((metric as BaseFitnessTestMetric).totalTime)}</p>
            <p><strong>Stroke:</strong> {(metric as BaseFitnessTestMetric).stroke}</p>
            <p><strong>Calculation Method:</strong> {(metric as BaseFitnessTestMetric).calculationMethod}</p>
            {(metric as BaseFitnessTestMetric).testType === 'multi' && (
              <>
                <p><strong>Part 1 Distance:</strong> {(metric as BaseFitnessTestMetric).part1Distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
                <p><strong>Part 1 Time:</strong> {formatTime((metric as BaseFitnessTestMetric).part1Time)}</p>
                <p><strong>Rest Duration:</strong> {formatTime((metric as BaseFitnessTestMetric).restDuration)}</p>
                <p><strong>Part 2 Distance:</strong> {(metric as BaseFitnessTestMetric).part2Distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
                <p><strong>Part 2 Time:</strong> {formatTime((metric as BaseFitnessTestMetric).part2Time)}</p>
              </>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const formatTime = (timeObj: any) => {
    if (!timeObj) return '';
    const { hours = 0, minutes = 0, seconds = 0 } = timeObj;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.metricsPage}>
      <h1 className={styles.pageTitle}>Create a New Swim Metric</h1>
      
      <TipsSection />

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Metric Category</label>
        <select
          className={styles.select}
          name="category"
          value={metric.category}
          onChange={handleInputChange}
          required
        >
          {Object.values(MetricCategory).map(category => (
            <option key={category} value={category}>{category.replace(/_/g, ' ')}</option>
          ))}
        </select>

        <label className={styles.label}>Metric Name</label>
        <input
          className={styles.input}
          name="name"
          value={metric.name}
          onChange={handleInputChange}
          placeholder="Metric Name"
          required
        />

        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          name="description"
          value={metric.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />

        <label className={styles.label}>Unit</label>
        <select
          className={styles.select}
          name="unit"
          value={metric.unit}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a unit</option>
          {unitOptions.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>

        <label className={styles.label}>Group</label>
        <select
          className={styles.select}
          name="group_id"
          value={metric.group_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a group</option>
          {coachGroups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>

        {renderCategorySpecificFields()}

        <div className={styles.buttonGroup}>
          <button className={styles.button} type="submit">Create Metric</button>
          <button className={styles.button} type="button" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button className={styles.button} type="button" onClick={resetForm}>Reset Form</button>
        </div>
      </form>

      {renderMetricPreview()}
    </div>
  );
};

export default MetricCreationForm;



// import React, { useState, useEffect } from 'react';
// import { createClient } from '../../../../utils/supabase/client';
// import styles from '../../../styles/MetricCreationForm.module.css';
// import TipsSection from './TipsSection';
// import { 
//   MetricCategory, 
//   TimeTrialMetric, 
//   DistanceChallengeMetric, 
//   TechniqueAssessmentMetric, 
//   EnduranceTestMetric, 
//   SprintPerformanceMetric, 
//   DrillProficiencyMetric, 
//   StrengthBenchmarkMetric, 
//   RecoveryMetricMetric, 
//   RaceAnalysisMetric, 
//   ProgressTrackerMetric, 
//   BaseFitnessTestMetric, 
//   Metric, 
//   SwimGroup 
// } from '../../../lib/types';

// const supabase = createClient();

// const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];
// const unitOptions = ['time', 'meters', 'yards', 'laps', 'points', 'percent', 'score', 'reps', 'sets', 'count'];

// const MetricCreationForm: React.FC = () => {
//   const [metric, setMetric] = useState<Partial<Metric>>({
//     category: MetricCategory.TimeTrial,
//     name: '',
//     description: '',
//     unit: '',
//     group_id: '',
//   });
//   const [coachGroups, setCoachGroups] = useState<SwimGroup[]>([]);
//   const [showPreview, setShowPreview] = useState(false);

//   useEffect(() => {
//     fetchCoachGroups();
//   }, []);

//   const fetchCoachGroups = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (user) {
//       const { data, error } = await supabase
//         .from('swim_groups')
//         .select('id, name')
//         .eq('coach_id', user.id);
      
//       if (error) {
//         console.error('Error fetching coach groups:', error);
//       } else {
//         setCoachGroups(data);
//       }
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
//   };

//   const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
//     const { name, value } = e.target;
//     setMetric(prevMetric => {
//       const fieldValue = prevMetric[fieldName as keyof Metric] as Record<string, number> | undefined;
  
//       return {
//         ...prevMetric,
//         [fieldName]: {
//           ...(fieldValue || {}),
//           [name]: value === '' ? 0 : parseInt(value, 10)
//         }
//       };
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { data, error } = await supabase
//         .from('metrics')
//         .insert([metric]);
      
//       if (error) throw error;
//       console.log('Metric created successfully:', data);
//       alert('Metric created successfully!');
//       resetForm();
//     } catch (error) {
//       console.error('Error creating metric:', error);
//       alert('Error creating metric. Please try again.');
//     }
//   };

//   const resetForm = () => {
//     setMetric({
//       category: MetricCategory.TimeTrial,
//       name: '',
//       description: '',
//       unit: '',
//       group_id: '',
//     });
//     setShowPreview(false);
//   };

//   const renderTimeInput = (fieldName: string, label: string) => {
//     const timeValue = metric[fieldName as keyof Metric] as { hours?: number; minutes?: number; seconds?: number } || {};
//     return (
//       <div>
//         <label className={styles.label}>{label}</label>
//         <div className={styles.timeInputContainer}>
//           <input
//             type="number"
//             name="hours"
//             value={timeValue.hours || 0}
//             onChange={(e) => handleTimeChange(e, fieldName)}
//             min="0"
//             placeholder="HH"
//             className={styles.timeInput}
//           />
//           :
//           <input
//             type="number"
//             name="minutes"
//             value={timeValue.minutes || 0}
//             onChange={(e) => handleTimeChange(e, fieldName)}
//             min="0"
//             max="59"
//             placeholder="MM"
//             className={styles.timeInput}
//           />
//           :
//           <input
//             type="number"
//             name="seconds"
//             value={timeValue.seconds || 0}
//             onChange={(e) => handleTimeChange(e, fieldName)}
//             min="0"
//             max="59"
//             placeholder="SS"
//             className={styles.timeInput}
//           />
//         </div>
//       </div>
//     );
//   };

//   const renderCategorySpecificFields = () => {
//     switch (metric.category) {
//       case MetricCategory.TimeTrial:
//         return (
//           <>
//             <label className={styles.label}>Distance</label>
//             <input
//               className={styles.input}
//               name="distance"
//               type="number"
//               value={(metric as TimeTrialMetric).distance || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Stroke</label>
//             <select
//               className={styles.select}
//               name="stroke"
//               value={(metric as TimeTrialMetric).stroke || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a stroke</option>
//               {strokeOptions.map(stroke => (
//                 <option key={stroke} value={stroke}>{stroke}</option>
//               ))}
//             </select>
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as TimeTrialMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="BEST_TIME">Best Time</option>
//               <option value="AVERAGE_TIME">Average Time</option>
//               <option value="TIME_IMPROVEMENT">Time Improvement</option>
//             </select>
//           </>
//         );
//       case MetricCategory.DistanceChallenge:
//         return (
//           <>
//             {renderTimeInput('timeLimit', 'Time Limit')}
//             <label className={styles.label}>Stroke</label>
//             <select
//               className={styles.select}
//               name="stroke"
//               value={(metric as DistanceChallengeMetric).stroke || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a stroke</option>
//               {strokeOptions.map(stroke => (
//                 <option key={stroke} value={stroke}>{stroke}</option>
//               ))}
//             </select>
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as DistanceChallengeMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="TOTAL_DISTANCE">Total Distance</option>
//               <option value="DISTANCE_IMPROVEMENT">Distance Improvement</option>
//             </select>
//           </>
//         );
//       case MetricCategory.TechniqueAssessment:
//         return (
//           <>
//             <label className={styles.label}>Technique Elements (comma-separated)</label>
//             <input
//               className={styles.input}
//               name="techniqueElements"
//               value={(metric as TechniqueAssessmentMetric).techniqueElements?.join(',') || ''}
//               onChange={(e) => {
//                 const elements = e.target.value.split(',').map(elem => elem.trim());
//                 setMetric(prevMetric => ({ 
//                   ...prevMetric, 
//                   techniqueElements: elements,
//                   resultFields: elements.map(elem => ({ name: elem, type: 'number', min: 1, max: 5 }))
//                 }));
//               }}
//               placeholder="e.g., Body position, Arm pull, Kick"
//               required
//             />
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as TechniqueAssessmentMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="SCORE">Score (1-5 scale)</option>
//               <option value="IMPROVEMENT_PERCENTAGE">Improvement Percentage</option>
//             </select>
//           </>
//         );
//       case MetricCategory.EnduranceTest:
//         return (
//           <>
//             <label className={styles.label}>Distance per Rep </label>
//             <input
//               className={styles.input}
//               name="distance"
//               type="number"
//               value={(metric as EnduranceTestMetric).distance || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Stroke</label>
//             <select
//               className={styles.select}
//               name="stroke"
//               value={(metric as EnduranceTestMetric).stroke || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a stroke</option>
//               {strokeOptions.map(stroke => (
//                 <option key={stroke} value={stroke}>{stroke}</option>
//               ))}
//             </select>
//             <label className={styles.label}>Total Reps</label>
//             <input
//               className={styles.input}
//               name="totalReps"
//               type="number"
//               value={(metric as EnduranceTestMetric).totalReps || ''}
//               onChange={handleInputChange}
//               required
//             />
//             {renderTimeInput('interval', 'Target Interval')}
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as EnduranceTestMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="TOTAL_COMPLETED">Total Completed Reps</option>
//               <option value="FASTEST_POSSIBLE_SENDOFF">Fastest Possible Sendoff/Interval</option>
//               <option value="TIME_TO_FATIGUE">Time to Fatigue</option>
//             </select>
//           </>
//         );
//       case MetricCategory.SprintPerformance:
//         return (
//           <>
//             <label className={styles.label}>Distance </label>
//             <input
//               className={styles.input}
//               name="distance"
//               type="number"
//               value={(metric as SprintPerformanceMetric).distance || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Repetitions</label>
//             <input
//               className={styles.input}
//               name="repetitions"
//               type="number"
//               value={(metric as SprintPerformanceMetric).repetitions || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as SprintPerformanceMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="PEAK_SPEED">Peak Speed</option>
//               <option value="AVERAGE_SPEED">Average Speed</option>
//               <option value="REACTION_TIME">Reaction Time</option>
//             </select>
//           </>
//         );
//       case MetricCategory.DrillProficiency:
//         return (
//           <>
//             <label className={styles.label}>Drill Name</label>
//             <input
//               className={styles.input}
//               name="drillName"
//               value={(metric as DrillProficiencyMetric).drillName || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Focus Area</label>
//             <input
//               className={styles.input}
//               name="focusArea"
//               value={(metric as DrillProficiencyMetric).focusArea || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as DrillProficiencyMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="REPETITION_COUNT">Repetition Count</option>
//               <option value="QUALITY_SCORE">Quality Score</option>
//               <option value="IMPROVEMENT_RATE">Improvement Rate</option>
//             </select>
//           </>
//         );
//       case MetricCategory.StrengthBenchmark:
//         return (
//           <>
//             <label className={styles.label}>Exercise Name</label>
//             <input
//               className={styles.input}
//               name="exerciseName"
//               value={(metric as StrengthBenchmarkMetric).exerciseName || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Equipment</label>
//             <input
//               className={styles.input}
//               name="equipment"
//               value={(metric as StrengthBenchmarkMetric).equipment || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as StrengthBenchmarkMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="MAXIMUM_WEIGHT">Maximum Weight/Resistance</option>
//               <option value="REPETITION_COUNT">Repetition Count</option>
//               <option value="POWER_OUTPUT">Power Output</option>
//             </select>
//           </>
//         );
//       case MetricCategory.RecoveryMetric:
//         return (
//           <>
//             <label className={styles.label}>Training Load (1-10)</label>
//             <input
//               className={styles.input}
//               name="trainingLoad"
//               type="number"
//               min="1"
//               max="10"
//               value={(metric as RecoveryMetricMetric).trainingLoad || ''}
//               onChange={handleInputChange}
//               required
//             />
//             {renderTimeInput('recoveryTime', 'Recovery Time')}
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as RecoveryMetricMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="HEART_RATE_VARIABILITY">Heart Rate Variability</option>
//               <option value="PERCEIVED_EXERTION">Perceived Exertion</option>
//               <option value="SLEEP_QUALITY">Sleep Quality</option>
//             </select>
//           </>
//         );
//       case MetricCategory.RaceAnalysis:
//         return (
//           <>
//             <label className={styles.label}>Race Distance </label>
//             <input
//               className={styles.input}
//               name="raceDistance"
//               type="number"
//               value={(metric as RaceAnalysisMetric).raceDistance || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Stroke</label>
//             <select
//               className={styles.select}
//               name="stroke"
//               value={(metric as RaceAnalysisMetric).stroke || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a stroke</option>
//               {strokeOptions.map(stroke => (
//                 <option key={stroke} value={stroke}>{stroke}</option>
//               ))}
//             </select>
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as RaceAnalysisMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="SPLIT_TIMES">Split Times</option>
//               <option value="TURN_EFFICIENCY">Turn Efficiency</option>
//               <option value="STROKE_COUNT">Stroke Count</option>
//             </select>
//           </>
//         );
//       case MetricCategory.ProgressTracker:
//         return (
//           <>
//             <label className={styles.label}>Baseline Value</label>
//             <input
//               className={styles.input}
//               name="baselineValue"
//               type="number"
//               value={(metric as ProgressTrackerMetric).baselineValue || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Target Value</label>
//             <input
//               className={styles.input}
//               name="targetValue"
//               type="number"
//               value={(metric as ProgressTrackerMetric).targetValue || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Timeframe (days)</label>
//             <input
//               className={styles.input}
//               name="timeframe"
//               type="number"
//               value={(metric as ProgressTrackerMetric).timeframe || ''}
//               onChange={handleInputChange}
//               required
//             />
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as ProgressTrackerMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="PERCENTAGE_IMPROVEMENT">Percentage Improvement</option>
//               <option value="CONSISTENCY_SCORE">Consistency Score</option>
//               <option value="GOAL_ACHIEVEMENT_RATE">Goal Achievement Rate</option>
//             </select>
//           </>
//         );
//       case MetricCategory.BaseFitnessTest:
//         return (
//           <>
//             <label className={styles.label}>Test Type</label>
//             <select
//               className={styles.select}
//               name="testType"
//               value={(metric as BaseFitnessTestMetric).testType || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="single">Single</option>
//               <option value="multi">Multi</option>
//             </select>
//             <label className={styles.label}>Total Distance </label>
//             <input
//               className={styles.input}
//               name="totalDistance"
//               type="number"
//               value={(metric as BaseFitnessTestMetric).totalDistance || ''}
//               onChange={handleInputChange}
//               required
//             />
//             {renderTimeInput('totalTime', 'Total Time')}
//             {(metric as BaseFitnessTestMetric).testType === 'multi' && (
//               <>
//                 <label className={styles.label}>Part 1 Distance </label>
//                 <input
//                   className={styles.input}
//                   name="part1Distance"
//                   type="number"
//                   value={(metric as BaseFitnessTestMetric).part1Distance || ''}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 {renderTimeInput('part1Time', 'Part 1 Time')}
//                 {renderTimeInput('restDuration', 'Rest Duration')}
//                 <label className={styles.label}>Part 2 Distance</label>
//                 <input
//                   className={styles.input}
//                   name="part2Distance"
//                   type="number"
//                   value={(metric as BaseFitnessTestMetric).part2Distance || ''}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 {renderTimeInput('part2Time', 'Part 2 Time')}
//               </>
//             )}
//             <label className={styles.label}>Stroke</label>
//             <select
//               className={styles.select}
//               name="stroke"
//               value={(metric as BaseFitnessTestMetric).stroke || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a stroke</option>
//               {strokeOptions.map(stroke => (
//                 <option key={stroke} value={stroke}>{stroke}</option>
//               ))}
//             </select>
//             <label className={styles.label}>Calculation Method</label>
//             <select
//               className={styles.select}
//               name="calculationMethod"
//               value={(metric as BaseFitnessTestMetric).calculationMethod || ''}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="AVERAGE_PACE">Average Pace</option>
//               <option value="TOTAL_TIME">Total Time</option>
//               <option value="PACE_COMPARISON">Pace Comparison</option>
//             </select>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   // const addResultField = () => {
//   //   setMetric(prevMetric => ({
//   //     ...prevMetric,
//   //     resultFields: [
//   //       ...(prevMetric.resultFields || []),
//   //       { name: '', type: 'number', min: 0, max: 100 }
//   //     ]
//   //   }));
//   // };

//   // const updateResultField = (index: number, field: string, value: string | number) => {
//   //   setMetric(prevMetric => {
//   //     const updatedFields = [...(prevMetric.resultFields || [])];
//   //     updatedFields[index] = { ...updatedFields[index], [field]: value };
//   //     return { ...prevMetric, resultFields: updatedFields };
//   //   });
//   // };

//   // const renderResultFields = () => {
//   //   return (
//   //     <div>
//   //       <h3>Result Fields</h3>
//   //       {metric.resultFields?.map((field, index) => (
//   //         <div key={index} className={styles.resultField}>
//   //           <input
//   //             className={styles.input}
//   //             placeholder="Field Name"
//   //             value={field.name}
//   //             onChange={(e) => updateResultField(index, 'name', e.target.value)}
//   //           />
//   //           <select
//   //             className={styles.select}
//   //             value={field.type}
//   //             onChange={(e) => updateResultField(index, 'type', e.target.value)}
//   //           >
//   //             <option value="number">Number</option>
//   //             <option value="text">Text</option>
//   //           </select>
//   //           {field.type === 'number' && (
//   //             <>
//   //               <input
//   //                 className={styles.input}
//   //                 type="number"
//   //                 placeholder="Min"
//   //                 value={field.min}
//   //                 onChange={(e) => updateResultField(index, 'min', parseInt(e.target.value))}
//   //               />
//   //               <input
//   //                 className={styles.input}
//   //                 type="number"
//   //                 placeholder="Max"
//   //                 value={field.max}
//   //                 onChange={(e) => updateResultField(index, 'max', parseInt(e.target.value))}
//   //               />
//   //             </>
//   //           )}
//   //         </div>
//   //       ))}
//   //       <button type="button" onClick={addResultField} className={styles.button}>
//   //         Add Result Field
//   //       </button>
//   //     </div>
//   //   );
//   // };

//   const renderMetricPreview = () => {
//     if (!showPreview) return null;
//     return (
//       <div className={styles.preview}>
//         <h3>Metric Preview</h3>
//         <p><strong>Name:</strong> {metric.name}</p>
//         <p><strong>Category:</strong> {metric.category}</p>
//         <p><strong>Description:</strong> {metric.description}</p>
//         <p><strong>Unit:</strong> {metric.unit}</p>
//         <p><strong>Group:</strong> {coachGroups.find(g => g.id === metric.group_id)?.name}</p>
//         {renderCategorySpecificPreview()}
//       </div>
//     );
//   };

//   const renderCategorySpecificPreview = () => {
//     switch (metric.category) {
//       case MetricCategory.TimeTrial:
//         return (
//           <>
//             <p><strong>Distance:</strong> {(metric as TimeTrialMetric).distance}{metric.unit === 'yards' ? ' yd' : ' m'}</p>
//             <p><strong>Stroke:</strong> {(metric as TimeTrialMetric).stroke}</p>
//             <p><strong>Calculation Method:</strong> {(metric as TimeTrialMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.DistanceChallenge:
//         return (
//           <>
//             <p><strong>Time Limit:</strong> {formatTime((metric as DistanceChallengeMetric).timeLimit)}</p>
//             <p><strong>Stroke:</strong> {(metric as DistanceChallengeMetric).stroke}</p>
//             <p><strong>Calculation Method:</strong> {(metric as DistanceChallengeMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.TechniqueAssessment:
//         return (
//           <>
//             <p><strong>Technique Elements:</strong> {(metric as TechniqueAssessmentMetric).techniqueElements?.join(', ')}</p>
//             <p><strong>Calculation Method:</strong> {(metric as TechniqueAssessmentMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.EnduranceTest:
//         return (
//           <>
//             <p><strong>Distance per Rep:</strong> {(metric as EnduranceTestMetric).distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
//             <p><strong>Stroke:</strong> {(metric as EnduranceTestMetric).stroke}</p>
//             <p><strong>Total Reps:</strong> {(metric as EnduranceTestMetric).totalReps}</p>
//             <p><strong>Target Interval:</strong> {formatTime((metric as EnduranceTestMetric).interval)}</p>
//             <p><strong>Calculation Method:</strong> {(metric as EnduranceTestMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.SprintPerformance:
//         return (
//           <>
//             <p><strong>Distance:</strong> {(metric as SprintPerformanceMetric).distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
//             <p><strong>Repetitions:</strong> {(metric as SprintPerformanceMetric).repetitions}</p>
//             <p><strong>Calculation Method:</strong> {(metric as SprintPerformanceMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.DrillProficiency:
//         return (
//           <>
//             <p><strong>Drill Name:</strong> {(metric as DrillProficiencyMetric).drillName}</p>
//             <p><strong>Focus Area:</strong> {(metric as DrillProficiencyMetric).focusArea}</p>
//             <p><strong>Calculation Method:</strong> {(metric as DrillProficiencyMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.StrengthBenchmark:
//         return (
//           <>
//             <p><strong>Exercise Name:</strong> {(metric as StrengthBenchmarkMetric).exerciseName}</p>
//             <p><strong>Equipment:</strong> {(metric as StrengthBenchmarkMetric).equipment}</p>
//             <p><strong>Calculation Method:</strong> {(metric as StrengthBenchmarkMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.RecoveryMetric:
//         return (
//           <>
//             <p><strong>Training Load:</strong> {(metric as RecoveryMetricMetric).trainingLoad}</p>
//             <p><strong>Recovery Time:</strong> {formatTime((metric as RecoveryMetricMetric).recoveryTime)}</p>
//             <p><strong>Calculation Method:</strong> {(metric as RecoveryMetricMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.RaceAnalysis:
//         return (
//           <>
//             <p><strong>Race Distance:</strong> {(metric as RaceAnalysisMetric).raceDistance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
//             <p><strong>Stroke:</strong> {(metric as RaceAnalysisMetric).stroke}</p>
//             <p><strong>Calculation Method:</strong> {(metric as RaceAnalysisMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.ProgressTracker:
//         return (
//           <>
//             <p><strong>Baseline Value:</strong> {(metric as ProgressTrackerMetric).baselineValue}</p>
//             <p><strong>Target Value:</strong> {(metric as ProgressTrackerMetric).targetValue}</p>
//             <p><strong>Timeframe:</strong> {(metric as ProgressTrackerMetric).timeframe} days</p>
//             <p><strong>Calculation Method:</strong> {(metric as ProgressTrackerMetric).calculationMethod}</p>
//           </>
//         );
//       case MetricCategory.BaseFitnessTest:
//         return (
//           <>
//             <p><strong>Test Type:</strong> {(metric as BaseFitnessTestMetric).testType}</p>
//             <p><strong>Total Distance:</strong> {(metric as BaseFitnessTestMetric).totalDistance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
//             <p><strong>Total Time:</strong> {formatTime((metric as BaseFitnessTestMetric).totalTime)}</p>
//             <p><strong>Stroke:</strong> {(metric as BaseFitnessTestMetric).stroke}</p>
//             <p><strong>Calculation Method:</strong> {(metric as BaseFitnessTestMetric).calculationMethod}</p>
//             {(metric as BaseFitnessTestMetric).testType === 'multi' && (
//               <>
//                 <p><strong>Part 1 Distance:</strong> {(metric as BaseFitnessTestMetric).part1Distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
//                 <p><strong>Part 1 Time:</strong> {formatTime((metric as BaseFitnessTestMetric).part1Time)}</p>
//                 <p><strong>Rest Duration:</strong> {formatTime((metric as BaseFitnessTestMetric).restDuration)}</p>
//                 <p><strong>Part 2 Distance:</strong> {(metric as BaseFitnessTestMetric).part2Distance} {metric.unit === 'yards' ? 'yd' : 'm'}</p>
//                 <p><strong>Part 2 Time:</strong> {formatTime((metric as BaseFitnessTestMetric).part2Time)}</p>
//               </>
//             )}
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   const formatTime = (timeObj: any) => {
//     if (!timeObj) return '';
//     const { hours = 0, minutes = 0, seconds = 0 } = timeObj;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className={styles.metricsPage}>
//       <h1 className={styles.pageTitle}>Create a New Swim Metric</h1>
      
//       <TipsSection />

//       <form className={styles.form} onSubmit={handleSubmit}>
//         <label className={styles.label}>Metric Category</label>
//         <select
//           className={styles.select}
//           name="category"
//           value={metric.category}
//           onChange={handleInputChange}
//           required
//         >
//           {Object.values(MetricCategory).map(category => (
//             <option key={category} value={category}>{category.replace(/_/g, ' ')}</option>
//           ))}
//         </select>

//         <label className={styles.label}>Metric Name</label>
//         <input
//           className={styles.input}
//           name="name"
//           value={metric.name}
//           onChange={handleInputChange}
//           placeholder="Metric Name"
//           required
//         />

//         <label className={styles.label}>Description</label>
//         <textarea
//           className={styles.textarea}
//           name="description"
//           value={metric.description}
//           onChange={handleInputChange}
//           placeholder="Description"
//           required
//         />

//         <label className={styles.label}>Unit</label>
//         <select
//           className={styles.select}
//           name="unit"
//           value={metric.unit}
//           onChange={handleInputChange}
//           required
//         >
//           <option value="">Select a unit</option>
//           {unitOptions.map(unit => (
//             <option key={unit} value={unit}>{unit}</option>
//           ))}
//         </select>

//         <label className={styles.label}>Group</label>
//         <select
//           className={styles.select}
//           name="group_id"
//           value={metric.group_id}
//           onChange={handleInputChange}
//           required
//         >
//           <option value="">Select a group</option>
//           {coachGroups.map(group => (
//             <option key={group.id} value={group.id}>{group.name}</option>
//           ))}
//         </select>

//         {renderCategorySpecificFields()}

//         <div className={styles.buttonGroup}>
//           <button className={styles.button} type="submit">Create Metric</button>
//           <button className={styles.button} type="button" onClick={() => setShowPreview(!showPreview)}>
//             {showPreview ? 'Hide Preview' : 'Show Preview'}
//           </button>
//           <button className={styles.button} type="button" onClick={resetForm}>Reset Form</button>
//         </div>
//       </form>

//       {renderMetricPreview()}
//     </div>
//   );
// };

// export default MetricCreationForm;

