import React from 'react';
import { TimeTrialMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface TimeTrialFormProps {
  metric: Partial<TimeTrialMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<TimeTrialMetric>>>;
}

const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];

const TimeTrialForm: React.FC<TimeTrialFormProps> = ({ metric, setMetric }) => {
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
        <option value="BEST_TIME">Best Time</option>
        <option value="AVERAGE_TIME">Average Time</option>
        <option value="TIME_IMPROVEMENT">Time Improvement</option>
      </select>
    </>
  );
};

export default TimeTrialForm;