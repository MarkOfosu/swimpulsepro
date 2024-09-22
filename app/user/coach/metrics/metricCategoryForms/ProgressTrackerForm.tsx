import React from 'react';
import { ProgressTrackerMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface ProgressTrackerFormProps {
  metric: Partial<ProgressTrackerMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<ProgressTrackerMetric>>>;
}

const ProgressTrackerForm: React.FC<ProgressTrackerFormProps> = ({ metric, setMetric }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
    };
  
    return (
      <>
        <label className={styles.label}>Baseline Value</label>
        <input
          className={styles.input}
          name="baselineValue"
          type="number"
          value={metric.baselineValue || ''}
          onChange={handleInputChange}
          required
        />
        <label className={styles.label}>Target Value</label>
        <input
          className={styles.input}
          name="targetValue"
          type="number"
          value={metric.targetValue || ''}
          onChange={handleInputChange}
          required
        />
        <label className={styles.label}>Timeframe (days)</label>
        <input
          className={styles.input}
          name="timeframe"
          type="number"
          value={metric.timeframe || ''}
          onChange={handleInputChange}
          required
        />
        <label className={styles.label}>Calculation Method</label>
        <select
          className={styles.select}
          name="calculationMethod"
          value={metric.calculationMethod || ''}
          onChange={handleInputChange}
          required
        >
          <option value="PERCENTAGE_IMPROVEMENT">Percentage Improvement</option>
          <option value="CONSISTENCY_SCORE">Consistency Score</option>
          <option value="GOAL_ACHIEVEMENT_RATE">Goal Achievement Rate</option>
        </select>
      </>
    );
  };
  
  export default ProgressTrackerForm;