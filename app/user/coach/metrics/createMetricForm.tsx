import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../utils/supabase/client';
import styles from '../../../styles/MetricCreationForm.module.css';
import TipsSection from './TipsSection';
import { MetricCategory, TimeTrialMetric, DistanceChallengeMetric, TechniqueAssessmentMetric, EnduranceTestMetric, SprintPerformanceMetric, DrillProficiencyMetric, StrengthBenchmarkMetric, RecoveryMetricMetric, RaceAnalysisMetric, ProgressTrackerMetric, BaseFitnessTestMetric, Metric, SwimGroup } from '../../../lib/types';

const supabase = createClient();



const MetricCreationForm: React.FC = () => {
  const [metric, setMetric] = useState<Partial<Metric>>({
    category: MetricCategory.TimeTrial,
    name: '',
    description: '',
    unit: '',
    group_id: '',
  });
  const [coachGroups, setCoachGroups] = useState<SwimGroup[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('metrics')
        .insert([metric]);
      
      if (error) throw error;
      console.log('Metric created successfully:', data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error creating metric:', error);
      // Show error message to user
    }
  };

  const renderCategorySpecificFields = () => {
    switch (metric.category) {
      case MetricCategory.TimeTrial:
        return (
          <>
            <label className={styles.label}>Distance (m)</label>
            <input
              className={styles.input}
              name="distance"
              type="number"
              value={(metric as TimeTrialMetric).distance || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Stroke Style</label>
            <input
              className={styles.input}
              name="strokeStyle"
              value={(metric as TimeTrialMetric).strokeStyle || ''}
              onChange={handleInputChange}
              required
            />
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
            <label className={styles.label}>Time Limit (seconds)</label>
            <input
              className={styles.input}
              name="timeLimit"
              type="number"
              value={(metric as DistanceChallengeMetric).timeLimit || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Stroke Style</label>
            <input
              className={styles.input}
              name="strokeStyle"
              value={(metric as DistanceChallengeMetric).strokeStyle || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as DistanceChallengeMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="TOTAL_DISTANCE">Total Distance</option>
              <option value="AVERAGE_PACE">Average Pace</option>
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
              onChange={handleInputChange}
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
            <label className={styles.label}>Duration (minutes)</label>
            <input
              className={styles.input}
              name="duration"
              type="number"
              value={(metric as EnduranceTestMetric).duration || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Rest Intervals (seconds)</label>
            <input
              className={styles.input}
              name="restIntervals"
              type="number"
              value={(metric as EnduranceTestMetric).restIntervals || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Calculation Method</label>
            <select
              className={styles.select}
              name="calculationMethod"
              value={(metric as EnduranceTestMetric).calculationMethod || ''}
              onChange={handleInputChange}
              required
            >
              <option value="TOTAL_LAPS">Total Laps</option>
              <option value="AVERAGE_PACE">Average Pace</option>
              <option value="TIME_TO_FATIGUE">Time to Fatigue</option>
            </select>
          </>
        );
      case MetricCategory.SprintPerformance:
        return (
          <>
            <label className={styles.label}>Distance (m)</label>
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
            <label className={styles.label}>Recovery Time (hours)</label>
            <input
              className={styles.input}
              name="recoveryTime"
              type="number"
              value={(metric as RecoveryMetricMetric).recoveryTime || ''}
              onChange={handleInputChange}
              required
            />
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
            <label className={styles.label}>Race Distance (m)</label>
            <input
              className={styles.input}
              name="raceDistance"
              type="number"
              value={(metric as RaceAnalysisMetric).raceDistance || ''}
              onChange={handleInputChange}
              required
            />
            <label className={styles.label}>Stroke Style</label>
            <input
              className={styles.input}
              name="strokeStyle"
              value={(metric as RaceAnalysisMetric).strokeStyle || ''}
              onChange={handleInputChange}
              required
            />
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
              value={(metric as BaseFitnessTestMetric).testType || 'single'}
              onChange={handleInputChange}
              required
            >
              <option value="single">Single Distance</option>
              <option value="multi">Multi-Part</option>
            </select>

            {(metric as BaseFitnessTestMetric).testType === 'single' && (
              <>
                <label className={styles.label}>Total Distance (m)</label>
                <input
                  className={styles.input}
                  name="totalDistance"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).totalDistance || ''}
                  onChange={handleInputChange}
                  required
                />
                <label className={styles.label}>Total Time (seconds)</label>
                <input
                  className={styles.input}
                  name="totalTime"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).totalTime || ''}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}

            {(metric as BaseFitnessTestMetric).testType === 'multi' && (
              <>
                <label className={styles.label}>Part 1 Distance (m)</label>
                <input
                  className={styles.input}
                  name="part1Distance"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).part1Distance || ''}
                  onChange={handleInputChange}
                  required
                />
                <label className={styles.label}>Part 1 Time (seconds)</label>
                <input
                  className={styles.input}
                  name="part1Time"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).part1Time || ''}
                  onChange={handleInputChange}
                  required
                />
                <label className={styles.label}>Rest Duration (seconds)</label>
                <input
                  className={styles.input}
                  name="restDuration"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).restDuration || ''}
                  onChange={handleInputChange}
                  required
                />
                <label className={styles.label}>Part 2 Distance (m)</label>
                <input
                  className={styles.input}
                  name="part2Distance"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).part2Distance || ''}
                  onChange={handleInputChange}
                  required
                />
                <label className={styles.label}>Part 2 Time (seconds)</label>
                <input
                  className={styles.input}
                  name="part2Time"
                  type="number"
                  value={(metric as BaseFitnessTestMetric).part2Time || ''}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}

            <label className={styles.label}>Stroke Style</label>
            <input
              className={styles.input}
              name="strokeStyle"
              value={(metric as BaseFitnessTestMetric).strokeStyle || ''}
              onChange={handleInputChange}
              required
            />
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
        <input
          className={styles.input}
          name="unit"
          value={metric.unit}
          onChange={handleInputChange}
          placeholder="Unit (e.g., seconds, meters)"
          required
        />

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

        <button className={styles.button} type="submit">Create Metric</button>
      </form>
    </div>
  );
};

export default MetricCreationForm;