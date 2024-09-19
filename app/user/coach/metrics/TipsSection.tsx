import React, { useState } from 'react';
import styles from '../../../styles/MetricCreationForm.module.css';

const TipsSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.guideSection}>
      <h3 
        className={`${styles.sectionTitle} ${isExpanded ? styles.expanded : ''}`}
        onClick={toggleExpansion}
      >
        Tips for Creating Effective Metrics
      </h3>
      {isExpanded && (
        <ul>
          <li>Be specific in what you&apos;re measuring.</li>
          <li>Align metrics with training objectives.</li>
          <li>Ensure consistent measurement methods.</li>
          <li>Use appropriate units for each metric.</li>
          <li>Consider swimmers&apos; skill levels when setting benchmarks.</li>
          <li>Balance between performance and technique metrics.</li>
          <li>Regularly review and adjust metrics as needed.</li>
          <li>Include both short-term and long-term progress metrics.</li>
          <li>Ensure metrics are easily understandable for swimmers and parents.</li>
          <li>Use a combination of objective and subjective metrics when appropriate.</li>
        </ul>
      )}
    </div>
  );
};

export default TipsSection;