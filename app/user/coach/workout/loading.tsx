import React from 'react';
import styles from '../../../styles/WorkoutPageSkeleton.module.css';

const WorkoutPageSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      {/* Title skeleton */}
      <div className={styles.skeletonTitle} />
      
      {/* Navigation buttons skeleton */}
      <div className={styles.skeletonButtonGroup}>
        {[1, 2, 3].map((btn) => (
          <div 
            key={btn} 
            className={styles.skeletonButton}
            style={{ width: '120px', height: '40px' }}
          />
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className={styles.skeletonContent}>
        {/* Group selector skeleton */}
        <div className={styles.skeletonSelect} />
        
        {/* Workout items skeleton */}
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className={styles.skeletonWorkoutItem}>
            <div className={styles.skeletonLine} style={{ width: '80%' }} />
            <div className={styles.skeletonLine} style={{ width: '60%' }} />
            <div className={styles.skeletonLine} style={{ width: '70%' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPageSkeleton;