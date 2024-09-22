import React from 'react';
import { DrillProficiencyMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface DrillProficiencyFormProps {
  metric: Partial<DrillProficiencyMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<DrillProficiencyMetric>>>;
}

const DrillProficiencyForm: React.FC<DrillProficiencyFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: value }));
  };

  return (
    <>
      <label className={styles.label}>Drill Name</label>
      <input
        className={styles.input}
        name="drillName"
        value={metric.drillName || ''}
        onChange={handleInputChange}
        required
      />
      <label className={styles.label}>Focus Area</label>
      <input
        className={styles.input}
        name="focusArea"
        value={metric.focusArea || ''}
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
        <option value="REPETITION_COUNT">Repetition Count</option>
        <option value="QUALITY_SCORE">Quality Score</option>
        <option value="IMPROVEMENT_RATE">Improvement Rate</option>
      </select>
    </>
  );
};

export default DrillProficiencyForm;