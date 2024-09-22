import React from 'react';
import { SprintPerformanceMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface SprintPerformanceFormProps {
  metric: Partial<SprintPerformanceMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<SprintPerformanceMetric>>>;
}

const SprintPerformanceForm: React.FC<SprintPerformanceFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  return (
    <>
      <label className={styles.label}>Distance (m)</label>
      <input
        className={styles.input}
        name="distance"
        type="number"
        value={metric.distance || ''}
        onChange={handleInputChange}
        required
      />
      <label className={styles.label}>Repetitions</label>
      <input
        className={styles.input}
        name="repetitions"
        type="number"
        value={metric.repetitions || ''}
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
        <option value="PEAK_SPEED">Peak Speed</option>
        <option value="AVERAGE_SPEED">Average Speed</option>
        <option value="REACTION_TIME">Reaction Time</option>
      </select>
    </>
  );
};

export default SprintPerformanceForm;