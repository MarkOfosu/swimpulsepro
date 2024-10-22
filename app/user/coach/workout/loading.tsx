import React from 'react';
import styles from '../../../styles/WorkoutPageSkeleton.module.css';

const WorkoutPageSkeleton = () => {
  return (
    <div className={styles.container}>
      {/* Title skeleton */}
      <div className={styles.titleSkeleton} />
      
      {/* Button group skeleton */}
      <div className={styles.buttonGroup}>
        {[1, 2, 3].map((btn) => (
          <div key={btn} className={styles.buttonSkeleton} />
        ))}
      </div>
      
      {/* Content box skeleton */}
      <div className={styles.contentBox}>
        {/* Group selector skeleton */}
        <div className={styles.selectSkeleton} />
        
        {/* Content rows skeleton */}
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className={styles.rowSkeleton}>
            <div className={styles.rowContent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPageSkeleton;