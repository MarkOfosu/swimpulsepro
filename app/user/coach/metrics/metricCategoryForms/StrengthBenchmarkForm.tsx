import React from 'react';
import { StrengthBenchmarkMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface StrengthBenchmarkFormProps {
  metric: Partial<StrengthBenchmarkMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<StrengthBenchmarkMetric>>>;
}

const StrengthBenchmarkForm: React.FC<StrengthBenchmarkFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  return (
    <>
      <label className={styles.label}>Exercise Name</label>
      <input
        className={styles.input}
        name="exerciseName"
        value={metric.exerciseName || ''}
        onChange={handleInputChange}
        required
      />
      <label className={styles.label}>Equipment</label>
      <input
        className={styles.input}
        name="equipment"
        value={metric.equipment || ''}
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
        <option value="MAXIMUM_WEIGHT">Maximum Weight/Resistance</option>
        <option value="REPETITION_COUNT">Repetition Count</option>
        <option value="POWER_OUTPUT">Power Output</option>
      </select>
    </>
  );
};

export default StrengthBenchmarkForm;