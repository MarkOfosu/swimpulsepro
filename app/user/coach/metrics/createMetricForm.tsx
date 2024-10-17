import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import styles from '../../../styles/MetricCreationForm.module.css';
import TipsSection from './TipsSection';
import { 
  MetricCategory, 
  SwimGroup,
  BaseMetric
} from '../../../lib/types';
import { useToast } from '@components/elements/toasts/Toast';

const supabase = createClient();

const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];
const unitOptions = ['time', 'meters', 'yards', 'laps', 'points', 'percent', 'score', 'reps', 'sets', 'count'];

const MetricCreationForm: React.FC = () => {
  const [metric, setMetric] = useState<Partial<BaseMetric>>({
    category: MetricCategory.TimeTrial,
    name: '',
    description: '',
    group_id: '',
    details: {},
  });
  const [coachGroups, setCoachGroups] = useState<SwimGroup[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { showToast, ToastContainer } = useToast();


  useEffect(() => {
    fetchCoachGroups();
  }, []);

  useEffect(() => {
    if (metric.details?.calculationMethod !== 'TARGET_TIME') {
      setMetric(prevMetric => ({
        ...prevMetric,
        details: {
          ...prevMetric.details,
          targetTimeType: undefined,
          targetTime: undefined,
          relativeTime: undefined,
          relativeTimeOperation: undefined
        }
      }));
    }
  }, [metric.details?.calculationMethod]);

  useEffect(() => {
    if (metric.details?.targetTimeType === 'MANUAL') {
      setMetric(prevMetric => ({
        ...prevMetric,
        details: {
          ...prevMetric.details,
          relativeTime: undefined,
          relativeTimeOperation: undefined
        }
      }));
    } else if (metric.details?.targetTimeType === 'RELATIVE') {
      setMetric(prevMetric => ({
        ...prevMetric,
        details: {
          ...prevMetric.details,
          targetTime: undefined
        }
      }));
    }
  }, [metric.details?.targetTimeType]);

  const fetchCoachGroups = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('swim_groups')
        .select('id, name, group_code') 
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
    if (['name', 'description', 'category', 'group_id'].includes(name)) {
      setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
    } else {
      setMetric(prevMetric => ({
        ...prevMetric,
        details: { ...prevMetric.details, [name]: value }
      }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({
      ...prevMetric,
      details: {
        ...prevMetric.details,
        [fieldName]: {
          ...(prevMetric.details?.[fieldName] as Record<string, number> || {}),
          [name]: value === '' ? 0 : parseInt(value, 10)
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const metricData = {
        name: metric.name,
        description: metric.description,
        category: metric.category,
        group_id: metric.group_id,
        details: metric.details
      };
     

      const { data, error } = await supabase
        .from('metrics')
        .insert([metricData]);
      
      if (error) throw error;
      showToast('Metric created successfully!', 'success');
      resetForm();
    } catch (error) {
      console.error('Error creating metric:', error);
      showToast('Error creating metric. Please try again.', 'error');
    }
  };

  const resetForm = () => {
    setMetric({
      category: MetricCategory.TimeTrial,
      name: '',
      description: '',
      group_id: '',
      details: {},
    });
    setShowPreview(false);
  };

  const renderTimeInput = (fieldName: string, label: string) => {
    const timeValue = (metric.details?.[fieldName] as { hours?: number; minutes?: number; seconds?: number }) || {};
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

  const renderRelativeTimeInput = (fieldName: string, label: string) => {
    const operation = (metric.details as any)?.[`${fieldName}Operation`] || '+';
    const value = (metric.details as any)?.[fieldName] || '';
    
    return (
      <>
        <label className={styles.label}>{label}</label>
        <div className={styles.relativeTimeInputContainer}>
          <select
            className={styles.select}
            name={`${fieldName}Operation`}
            value={operation}
            onChange={handleInputChange}
            required
          >
            <option value="+">+</option>
            <option value="-">-</option>
          </select>
          <input
            className={styles.input}
            name={fieldName}
            type="number"
            value={value}
            onChange={handleInputChange}
            placeholder="Seconds relative to base time"
            required
          />
        </div>
      </>
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
              value={metric.details?.distance || ''}
              onChange={handleInputChange}
              placeholder="Enter distance"
              required
            />
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={metric.details?.stroke || ''}
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
              value={metric.details?.calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="BEST_TIME">Best Time</option>
              <option value="AVERAGE_TIME">Average Time</option>
              <option value="TIME_IMPROVEMENT">Time Improvement</option>
              <option value="TARGET_TIME">Target Time</option>
            </select>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <label className={styles.label}>Target Time Type</label>
                <select
                  className={styles.select}
                  name="targetTimeType"
                  value={metric.details?.targetTimeType || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MANUAL">Manual Time</option>
                  <option value="RELATIVE">Relative to Base Time</option>
                </select>
                {metric.details?.targetTimeType === 'MANUAL' && renderTimeInput('targetTime', 'Target Time')}
                {metric.details?.targetTimeType === 'RELATIVE' && renderRelativeTimeInput('relativeTime', 'Relative Time')}
              </>
            )}
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
              value={metric.details?.stroke || ''}
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
              value={metric.details?.calculationMethod || ''}
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
              value={metric.details?.techniqueElements?.join(', ') || ''}
              onChange={(e) => {
                const elements = e.target.value.split(',').map(elem => elem.trim());
                setMetric(prevMetric => ({ 
                  ...prevMetric, 
                  details: {
                    ...prevMetric.details,
                    techniqueElements: elements
                  }
                }));
              }}
              placeholder="e.g., Body position, Arm pull, Kick"
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={metric.details?.calculationMethod || ''}
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
            <label className={styles.label}>Distance per Rep</label>
            <input
              className={styles.input}
              name="distance"
              type="number"
              value={metric.details?.distance || ''}
              onChange={handleInputChange}
              placeholder="Enter distance per rep"
              required
            />
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={metric.details?.stroke || ''}
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
              value={metric.details?.totalReps || ''}
              onChange={handleInputChange}
              placeholder="Enter total reps"
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={metric.details?.calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="TOTAL_COMPLETED">Total Completed Reps</option>
              <option value="FASTEST_POSSIBLE_SENDOFF">Fastest Possible Sendoff/Interval</option>
              <option value="TIME_TO_FATIGUE">Time to Fatigue</option>
              <option value="TARGET_TIME">Target Time</option>
            </select>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <label className={styles.label}>Target Time Type</label>
                <select
                  className={styles.select}
                  name="targetTimeType"
                  value={metric.details?.targetTimeType || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MANUAL">Manual Time</option>
                  <option value="RELATIVE">Relative to Base Time</option>
                </select>
                {metric.details?.targetTimeType === 'MANUAL' && renderTimeInput('targetTime', 'Target Time')}
                {metric.details?.targetTimeType === 'RELATIVE' && renderRelativeTimeInput('relativeTime', 'Relative Time')}
              </>
            )}
            <label className={styles.label}>Target Interval Type</label>
            <select
              className={styles.select}
              name="targetIntervalType"
              value={metric.details?.targetIntervalType || ''}
              onChange={handleInputChange}
              required
            >
              <option value="MANUAL">Manual Interval</option>
              <option value="RELATIVE">Relative to Base Interval</option>
            </select>
            {metric.details?.targetIntervalType === 'MANUAL' && renderTimeInput('interval', 'Target Interval')}
            {metric.details?.targetIntervalType === 'RELATIVE' && renderRelativeTimeInput('relativeInterval', 'Relative Interval')}
          </>
        );
      case MetricCategory.SprintPerformance:
        return (
          <>
            <label className={styles.label}>Distance</label>
            <input
              className={styles.input}
              name="distance"
              type="number"
              value={metric.details?.distance || ''}
              onChange={handleInputChange}
              placeholder="Enter distance"
              required
            />
            <label className={styles.label}>Repetitions</label>
            <input
              className={styles.input}
              name="repetitions"
              type="number"
              value={metric.details?.repetitions || ''}
              onChange={handleInputChange}
              placeholder="Enter number of repetitions"
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={metric.details?.calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="PEAK_SPEED">Peak Speed</option>
              <option value="AVERAGE_SPEED">Average Speed</option>
              <option value="REACTION_TIME">Reaction Time</option>
              <option value="TARGET_TIME">Target Time</option>
              <option value="TOTAL_TIME">Total Time</option>
            </select>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <label className={styles.label}>Target Time Type</label>
                <select
                  className={styles.select}
                  name="targetTimeType"
                  value={metric.details?.targetTimeType || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MANUAL">Manual Time</option>
                  <option value="RELATIVE">Relative to Base Time</option>
                </select>
                {metric.details?.targetTimeType === 'MANUAL' && renderTimeInput('targetTime', 'Target Time')}
                {metric.details?.targetTimeType === 'RELATIVE' && renderRelativeTimeInput('relativeTime', 'Relative Time')}
              </>
            )}
          </>
        );
      case MetricCategory.DrillProficiency:
        return (
          <>
            <label className={styles.label}>Drill Name</label>
            <input
              className={styles.input}
              name="drillName"
              value={metric.details?.drillName || ''}
              onChange={handleInputChange}
              placeholder="Enter drill name"
              required
            />
            <label className={styles.label}>Focus Area</label>
            <input
              className={styles.input}
              name="focusArea"
              value={metric.details?.focusArea || ''}
              onChange={handleInputChange}
              placeholder="Enter focus area"
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={metric.details?.calculationMethod || ''}
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
              value={metric.details?.exerciseName || ''}
              onChange={handleInputChange}
              placeholder="Enter exercise name"
              required
            />
            <label className={styles.label}>Equipment</label>
            <input
              className={styles.input}
              name="equipment"
              value={metric.details?.equipment || ''}
              onChange={handleInputChange}
              placeholder="Enter equipment used"
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={metric.details?.calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="MAXIMUM_WEIGHT">Maximum Weight/Resistance</option>
              <option value="REPETITION_COUNT">Repetition Count</option>
              <option value="POWER_OUTPUT">Power Output</option>
              <option value="DISTANCE">Distance</option>
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
              value={metric.details?.trainingLoad || ''}
              onChange={handleInputChange}
              placeholder="Enter training load (1-10)"
              required
            />
            {renderTimeInput('recoveryTime', 'Recovery Time')}
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={metric.details?.calculationMethod || ''}
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
            <label className={styles.label}>Race Distance</label>
            <input
              className={styles.input}
              name="raceDistance"
              type="number"
              value={metric.details?.raceDistance || ''}
              onChange={handleInputChange}
              placeholder="Enter race distance"
              required
            />
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={metric.details?.stroke || ''}
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
              value={metric.details?.calculationMethod || ''}
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
              value={metric.details?.baselineValue || ''}
              onChange={handleInputChange}
              placeholder="Enter baseline value"
              required
            />
            <label className={styles.label}>Target Value</label>
            <input
              className={styles.input}
              name="targetValue"
              type="number"
              value={metric.details?.targetValue || ''}
              onChange={handleInputChange}
              placeholder="Enter target value"
              required
            />
            <label className={styles.label}>Timeframe (days)</label>
            <input
              className={styles.input}
              name="timeframe"
              type="number"
              value={metric.details?.timeframe || ''}
              onChange={handleInputChange}
              placeholder="Enter timeframe in days"
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={metric.details?.calculationMethod || ''}
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
              value={metric.details?.testType || ''}
              onChange={handleInputChange}
              required
            >
              <option value="single">Single</option>
              <option value="multi">Multi</option>
            </select>
            <label className={styles.label}>Total Distance</label>
            <input
              className={styles.input}
              name="totalDistance"
              type="number"
              value={metric.details?.totalDistance || ''}
              onChange={handleInputChange}
              placeholder="Enter total distance"
              required
            />
            <label className={styles.label}>Stroke</label>
            <select
              className={styles.select}
              name="stroke"
              value={metric.details?.stroke || ''}
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
              value={metric.details?.calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="AVERAGE_PACE">Average Pace</option>
              <option value="TOTAL_TIME">Total Time</option>
              <option value="PACE_COMPARISON">Pace Comparison</option>
              <option value="TARGET_TIME">Target Time</option>
            </select>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <label className={styles.label}>Target Time Type</label>
                <select
                  className={styles.select}
                  name="targetTimeType"
                  value={metric.details?.targetTimeType || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="MANUAL">Manual Time</option>
                  <option value="RELATIVE">Relative to Base Time</option>
                </select>
                {metric.details?.targetTimeType === 'MANUAL' && renderTimeInput('targetTime', 'Target Time')}
                {metric.details?.targetTimeType === 'RELATIVE' && renderRelativeTimeInput('relativeTime', 'Relative Time')}
              </>
            )}
            {metric.details?.testType === 'multi' && (
              <>
                <label className={styles.label}>Part 1 Distance</label>
                <input
                  className={styles.input}
                  name="part1Distance"
                  type="number"
                  value={metric.details?.part1Distance || ''}
                  onChange={handleInputChange}
                  placeholder="Enter distance for part 1"
                  required
                />
                {renderTimeInput('restDuration', 'Rest Duration')}
                <label className={styles.label}>Part 2 Distance</label>
                <input
                  className={styles.input}
                  name="part2Distance"
                  type="number"
                  value={metric.details?.part2Distance || ''}
                  onChange={handleInputChange}
                  placeholder="Enter distance for part 2"
                  required
                />
              </>
            )}
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
        <p><strong>Unit:</strong> {metric.details?.unit}</p>
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
            <p><strong>Distance:</strong> {metric.details?.distance} {metric.details?.unit}</p>
            <p><strong>Stroke:</strong> {metric.details?.stroke}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <p><strong>Target Time Type:</strong> {metric.details?.targetTimeType}</p>
                {metric.details?.targetTimeType === 'MANUAL' && (
                  <p><strong>Target Time:</strong> {formatTime(metric.details?.targetTime)}</p>
                )}
                {metric.details?.targetTimeType === 'RELATIVE' && (
                  <p><strong>Relative Time:</strong> {metric.details?.relativeTimeOperation}{metric.details?.relativeTime} seconds</p>
                )}
              </>
            )}
          </>
        );
      case MetricCategory.DistanceChallenge:
        return (
          <>
            <p><strong>Time Limit:</strong> {formatTime(metric.details?.timeLimit)}</p>
            <p><strong>Stroke:</strong> {metric.details?.stroke}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
          </>
        );
      case MetricCategory.TechniqueAssessment:
        return (
          <>
            <p><strong>Technique Elements:</strong> {metric.details?.techniqueElements?.join(', ')}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
          </>
        );
      case MetricCategory.EnduranceTest:
        return (
          <>
            <p><strong>Distance per Rep:</strong> {metric.details?.distance} {metric.details?.unit}</p>
            <p><strong>Stroke:</strong> {metric.details?.stroke}</p>
            <p><strong>Total Reps:</strong> {metric.details?.totalReps}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <p><strong>Target Time Type:</strong> {metric.details?.targetTimeType}</p>
                {metric.details?.targetTimeType === 'MANUAL' && (
                  <p><strong>Target Time:</strong> {formatTime(metric.details?.targetTime)}</p>
                )}
                {metric.details?.targetTimeType === 'RELATIVE' && (
                  <p><strong>Relative Time:</strong> {metric.details?.relativeTimeOperation}{metric.details?.relativeTime} seconds</p>
                )}
              </>
            )}
            <p><strong>Target Interval Type:</strong> {metric.details?.targetIntervalType}</p>
            {metric.details?.targetIntervalType === 'MANUAL' && (
              <p><strong>Target Interval:</strong> {formatTime(metric.details?.interval)}</p>
            )}
            {metric.details?.targetIntervalType === 'RELATIVE' && (
              <p><strong>Relative Interval:</strong> {metric.details?.relativeIntervalOperation}{metric.details?.relativeInterval} seconds</p>
            )}
          </>
        );
      case MetricCategory.SprintPerformance:
        return (
          <>
            <p><strong>Distance:</strong> {metric.details?.distance} {metric.details?.unit}</p>
            <p><strong>Repetitions:</strong> {metric.details?.repetitions}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <p><strong>Target Time Type:</strong> {metric.details?.targetTimeType}</p>
                {metric.details?.targetTimeType === 'MANUAL' && (
                  <p><strong>Target Time:</strong> {formatTime(metric.details?.targetTime)}</p>
                )}
                {metric.details?.targetTimeType === 'RELATIVE' && (
                  <p><strong>Relative Time:</strong> {metric.details?.relativeTimeOperation}{metric.details?.relativeTime} seconds</p>
                )}
              </>
            )}
          </>
        );
      case MetricCategory.DrillProficiency:
        return (
          <>
            <p><strong>Drill Name:</strong> {metric.details?.drillName}</p>
            <p><strong>Focus Area:</strong> {metric.details?.focusArea}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
          </>
        );
      case MetricCategory.StrengthBenchmark:
        return (
          <>
            <p><strong>Exercise Name:</strong> {metric.details?.exerciseName}</p>
            <p><strong>Equipment:</strong> {metric.details?.equipment}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
          </>
        );
      case MetricCategory.RecoveryMetric:
        return (
          <>
            <p><strong>Training Load:</strong> {metric.details?.trainingLoad}</p>
            <p><strong>Recovery Time:</strong> {formatTime(metric.details?.recoveryTime)}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
          </>
        );
      case MetricCategory.RaceAnalysis:
        return (
          <>
            <p><strong>Race Distance:</strong> {metric.details?.raceDistance} {metric.details?.unit}</p>
            <p><strong>Stroke:</strong> {metric.details?.stroke}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
          </>
        );
      case MetricCategory.ProgressTracker:
        return (
          <>
            <p><strong>Baseline Value:</strong> {metric.details?.baselineValue}</p>
            <p><strong>Target Value:</strong> {metric.details?.targetValue}</p>
            <p><strong>Timeframe:</strong> {metric.details?.timeframe} days</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
          </>
        );
      case MetricCategory.BaseFitnessTest:
        return (
          <>
            <p><strong>Test Type:</strong> {metric.details?.testType}</p>
            <p><strong>Total Distance:</strong> {metric.details?.totalDistance} {metric.details?.unit}</p>
            <p><strong>Stroke:</strong> {metric.details?.stroke}</p>
            <p><strong>Calculation Method:</strong> {metric.details?.calculationMethod}</p>
            {metric.details?.calculationMethod === 'TARGET_TIME' && (
              <>
                <p><strong>Target Time Type:</strong> {metric.details?.targetTimeType}</p>
                {metric.details?.targetTimeType === 'MANUAL' && (
                  <p><strong>Target Time:</strong> {formatTime(metric.details?.targetTime)}</p>
                )}
                {metric.details?.targetTimeType === 'RELATIVE' && (
                  <p><strong>Relative Time:</strong> {metric.details?.relativeTimeOperation}{metric.details?.relativeTime} seconds</p>
                )}
              </>
            )}
            {metric.details?.testType === 'multi' && (
              <>
                <p><strong>Part 1 Distance:</strong> {metric.details?.part1Distance} {metric.details?.unit}</p>
                <p><strong>Rest Duration:</strong> {formatTime(metric.details?.restDuration)}</p>
                <p><strong>Part 2 Distance:</strong> {metric.details?.part2Distance} {metric.details?.unit}</p>
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
          placeholder="Enter metric name"
          required
        />

        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          name="description"
          value={metric.description}
          onChange={handleInputChange}
          placeholder="Enter metric description"
          required
        />

        <label className={styles.label}>Unit</label>
        <select
          className={styles.select}
          name="unit"
          value={metric.details?.unit || ''}
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
      <ToastContainer />
    </div>

  );
};

export default MetricCreationForm;