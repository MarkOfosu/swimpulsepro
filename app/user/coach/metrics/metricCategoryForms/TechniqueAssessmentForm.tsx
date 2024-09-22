import React from 'react';
import { TechniqueAssessmentMetric } from '../../../../lib/types';
import styles from '../../../../styles/MetricCreationForm.module.css';

interface TechniqueAssessmentFormProps {
  metric: Partial<TechniqueAssessmentMetric>;
  setMetric: React.Dispatch<React.SetStateAction<Partial<TechniqueAssessmentMetric>>>;
}

const TechniqueAssessmentForm: React.FC<TechniqueAssessmentFormProps> = ({ metric, setMetric }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetric(prevMetric => ({ ...prevMetric, [name]: name === 'techniqueElements' ? value.split(',') : value }));
  };

  return (
    <>
      <label className={styles.label}>Technique Elements (comma-separated)</label>
      <input
        className={styles.input}
        name="techniqueElements"
        value={metric.techniqueElements?.join(',') || ''}
        onChange={handleInputChange}
        placeholder="e.g., Body position, Arm pull, Kick"
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
        <option value="SCORE">Score (1-5 scale)</option>
        <option value="IMPROVEMENT_PERCENTAGE">Improvement Percentage</option>
      </select>
    </>
  );
};

export default TechniqueAssessmentForm;