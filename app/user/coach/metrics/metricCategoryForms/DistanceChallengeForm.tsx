import React from 'react';
import { DistanceChallengeMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface DistanceChallengeFormProps {
  metric: Partial<DistanceChallengeMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<DistanceChallengeMetric>>>;
}

const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];

const DistanceChallengeForm: React.FC<DistanceChallengeFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  return (
    <>
      <label className={styles.label}>Time Limit (seconds)</label>
      <input
        className={styles.input}
        name="timeLimit"
        type="number"
        value={metric.timeLimit || ''}
        onChange={handleInputChange}
        required
      />
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
        <option value="TOTAL_DISTANCE">Total Distance</option>
        <option value="DISTANCE_IMPROVEMENT">Distance Improvement</option>
      </select>
    </>
  );
};

export default DistanceChallengeForm;