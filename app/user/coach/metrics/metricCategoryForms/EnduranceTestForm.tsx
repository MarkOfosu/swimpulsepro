import React from 'react';
import { EnduranceTestMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface EnduranceTestFormProps {
  metric: Partial<EnduranceTestMetric>;
  setMetric: <T extends Partial<EnduranceTestMetric>>(metric: T) => void;
}

const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];

const EnduranceTestForm: React.FC<EnduranceTestFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric({ ...metric, [name]: value });
  };

  return (
    <>
      <label className={styles.label}>Distance per Rep (m)</label>
      <input
        className={styles.input}
        name="distance"
        type="number"
        value={metric.distance || ''}
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
      <label className={styles.label}>Total Reps</label>
      <input
        className={styles.input}
        name="totalReps"
        type="number"
        value={metric.totalReps || ''}
        onChange={handleInputChange}
        required
      />
      <label className={styles.label}>Target Interval (seconds)</label>
      <input
        className={styles.input}
        name="interval"
        type="number"
        value={metric.interval || ''}
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
        <option value="TOTAL_COMPLETED">Total Completed Reps</option>
        <option value="FASTEST_POSSIBLE_SENDOFF/INTERVAL">Fastest Possible Sendoff/Interval</option>
        <option value="TIME_TO_FATIGUE">Time to Fatigue</option>
      </select>
    </>
  );
};

export default EnduranceTestForm;