import React from 'react';
import { RecoveryMetricMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface RecoveryMetricFormProps {
  metric: Partial<RecoveryMetricMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<RecoveryMetricMetric>>>;
}

const RecoveryMetricForm: React.FC<RecoveryMetricFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  return (
    <>
      <label className={styles.label}>Training Load (1-10)</label>
      <input
        className={styles.input}
        name="trainingLoad"
        type="number"
        min="1"
        max="10"
        value={metric.trainingLoad || ''}
        onChange={handleInputChange}
        required
      />
      <label className={styles.label}>Recovery Time (hours)</label>
      <input
        className={styles.input}
        name="recoveryTime"
        type="number"
        value={metric.recoveryTime || ''}
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
        <option value="HEART_RATE_VARIABILITY">Heart Rate Variability</option>
        <option value="PERCEIVED_EXERTION">Perceived Exertion</option>
        <option value="SLEEP_QUALITY">Sleep Quality</option>
      </select>
    </>
  );
};

export default RecoveryMetricForm;