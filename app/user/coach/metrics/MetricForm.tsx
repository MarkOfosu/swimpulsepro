import React from 'react';
import { 
  Metric, 
  MetricCategory, 
  SwimGroup,
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
import TimeTrialForm from './metricCategoryForms/TimeTrialForm';
import EnduranceTestForm from './metricCategoryForms/EnduranceTestForm';
import DistanceChallengeForm from './metricCategoryForms/DistanceChallengeForm';
import TechniqueAssessmentForm from './metricCategoryForms/TechniqueAssessmentForm';
import SprintPerformanceForm from './metricCategoryForms/SprintPerformanceForm';
import DrillProficiencyForm from './metricCategoryForms/DrillProficiencyForm';
import StrengthBenchmarkForm from './metricCategoryForms/StrengthBenchmarkForm';
import RecoveryMetricForm from './metricCategoryForms/RecoveryMetricForm';
import RaceAnalysisForm from './metricCategoryForms/RaceAnalysisForm';
import ProgressTrackerForm from './metricCategoryForms/ProgressTrackerForm';
import BaseFitnessTestForm from './metricCategoryForms/BaseFitnessTestForm';

interface MetricFormProps {
  metric: Partial<Metric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<Metric>>>;
  timeValue: { hours: number; minutes: number; seconds: number };
  setTimeValue: React.Dispatch<React.SetStateAction<{ hours: number; minutes: number; seconds: number }>>;
  coachGroups: SwimGroup[];
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onReset: () => void;
}

const unitOptions = ['time', 'meters', 'yards', 'laps', 'points', 'percent', 'score', 'reps', 'sets', 'count'];

const MetricForm: React.FC<MetricFormProps> = ({
  metric,
  setMetric,
  timeValue,
  setTimeValue,
  coachGroups,
  onSubmit,
  onReset
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTimeValue(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleMetricUpdate = <T extends Partial<Metric>>(updatedMetric: T) => {
    setMetric(prevMetric => ({ ...prevMetric, ...updatedMetric }));
  };

  const renderCategorySpecificFields = () => {
    switch (metric.category) {
      case MetricCategory.TimeTrial:
        return <TimeTrialForm 
          metric={metric as Partial<TimeTrialMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.EnduranceTest:
        return <EnduranceTestForm 
          metric={metric as Partial<EnduranceTestMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.DistanceChallenge:
        return <DistanceChallengeForm 
          metric={metric as Partial<DistanceChallengeMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.TechniqueAssessment:
        return <TechniqueAssessmentForm 
          metric={metric as Partial<TechniqueAssessmentMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.SprintPerformance:
        return <SprintPerformanceForm 
          metric={metric as Partial<SprintPerformanceMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.DrillProficiency:
        return <DrillProficiencyForm 
          metric={metric as Partial<DrillProficiencyMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.StrengthBenchmark:
        return <StrengthBenchmarkForm 
          metric={metric as Partial<StrengthBenchmarkMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.RecoveryMetric:
        return <RecoveryMetricForm 
          metric={metric as Partial<RecoveryMetricMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.RaceAnalysis:
        return <RaceAnalysisForm 
          metric={metric as Partial<RaceAnalysisMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.ProgressTracker:
        return <ProgressTrackerForm 
          metric={metric as Partial<ProgressTrackerMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      case MetricCategory.BaseFitnessTest:
        return <BaseFitnessTestForm 
          metric={metric as Partial<BaseFitnessTestMetric>} 
          setMetric={(updatedMetric) => handleMetricUpdate(updatedMetric as Partial<Metric>)}
        />;
      default:
        return null;
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
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

      {metric.unit === 'time' && (
        <div className={styles.timeInputContainer}>
          <input
            type="number"
            name="hours"
            value={timeValue.hours}
            onChange={handleTimeChange}
            min="0"
            placeholder="HH"
            className={styles.timeInput}
          />
          :
          <input
            type="number"
            name="minutes"
            value={timeValue.minutes}
            onChange={handleTimeChange}
            min="0"
            max="59"
            placeholder="MM"
            className={styles.timeInput}
          />
          :
          <input
            type="number"
            name="seconds"
            value={timeValue.seconds}
            onChange={handleTimeChange}
            min="0"
            max="59"
            placeholder="SS"
            className={styles.timeInput}
          />
        </div>
      )}

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
        <button className={styles.button} type="button" onClick={onReset}>Reset Form</button>
      </div>
    </form>
  );
};

export default MetricForm;