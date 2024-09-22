import React from 'react';
import { BaseFitnessTestMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface BaseFitnessTestFormProps {
  metric: Partial<BaseFitnessTestMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<BaseFitnessTestMetric>>>;
}

const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];

const BaseFitnessTestForm: React.FC<BaseFitnessTestFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  return (
    <>
      <label className={styles.label}>Test Type</label>
      <select
        className={styles.select}
        name="testType"
        value={metric.testType || ''}
        onChange={handleInputChange}
        required
      >
        <option value="single">Single</option>
        <option value="multi">Multi</option>
      </select>
      <label className={styles.label}>Total Distance (m)</label>
      <input
        className={styles.input}
        name="totalDistance"
        type="number"
        value={metric.totalDistance || ''}
        onChange={handleInputChange}
        required
      />
      <label className={styles.label}>Total Time (seconds)</label>
      <input
        className={styles.input}
        name="totalTime"
        type="number"
        value={metric.totalTime || ''}
        onChange={handleInputChange}
        required
      />
      {metric.testType === 'multi' && (
        <>
          <label className={styles.label}>Part 1 Distance (m)</label>
          <input
            className={styles.input}
            name="part1Distance"
            type="number"
            value={metric.part1Distance || ''}
            onChange={handleInputChange}
            required
          />
          <label className={styles.label}>Part 1 Time (seconds)</label>
          <input
            className={styles.input}
            name="part1Time"
            type="number"
            value={metric.part1Time || ''}
            onChange={handleInputChange}
            required
          />
          <label className={styles.label}>Rest Duration (seconds)</label>
          <input
            className={styles.input}
            name="restDuration"
            type="number"
            value={metric.restDuration || ''}
            onChange={handleInputChange}
            required
          />
          <label className={styles.label}>Part 2 Distance (m)</label>
          <input
            className={styles.input}
            name="part2Distance"
            type="number"
            value={metric.part2Distance || ''}
            onChange={handleInputChange}
            required
          />
          <label className={styles.label}>Part 2 Time (seconds)</label>
          <input
            className={styles.input}
            name="part2Time"
            type="number"
            value={metric.part2Time || ''}
            onChange={handleInputChange}
            required
          />
        </>
      )}
      <label className={styles.label}>Stroke</label>
      <select
        className={styles.select}
        name="stroke"
        value={metric.stroke || ''}
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
        value={metric.calculationMethod || ''}
        onChange={handleInputChange}
        required
      >
        <option value="AVERAGE_PACE">Average Pace</option>
        <option value="TOTAL_TIME">Total Time</option>
        <option value="PACE_COMPARISON">Pace Comparison</option>
      </select>
    </>
  );
};

export default BaseFitnessTestForm;