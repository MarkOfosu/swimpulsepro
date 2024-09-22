import React from 'react';
import { RaceAnalysisMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface RaceAnalysisFormProps {
  metric: Partial<RaceAnalysisMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<RaceAnalysisMetric>>>;
}

const strokeOptions = ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley'];

const RaceAnalysisForm: React.FC<RaceAnalysisFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  return (
    <>
      <label className={styles.label}>Race Distance (m)</label>
      <input
        className={styles.input}
        name="raceDistance"
        type="number"
        value={metric.raceDistance || ''}
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
        <option value="SPLIT_TIMES">Split Times</option>
        <option value="TURN_EFFICIENCY">Turn Efficiency</option>
        <option value="STROKE_COUNT">Stroke Count</option>
      </select>
    </>
  );
};

export default RaceAnalysisForm;