// loading.tsx
'use client';
import React from 'react';
import CoachPageLayout from '../CoachPageLayout';
import styles from '../../../styles/SwimGroupsLoading.module.css';

const SwimGroupsLoading = () => {
  return (
    <CoachPageLayout>
      <div className={styles.pageContainer}>
        <h1 className={styles.pageHeading}>Swim Groups</h1>
        
        <div className={styles.swimGroupsGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.cardSkeleton}>
              <div className={styles.cardTitleSkeleton}></div>
              <div className={styles.cardDescriptionSkeleton}></div>
              <div className={styles.cardCodeSkeleton}></div>
              <div className={styles.cardButtonSkeleton}></div>
            </div>
          ))}
        </div>

        <div className={styles.createGroupSection}>
          <div className={styles.createGroupSkeleton}>
            <div className={styles.createTitleSkeleton}></div>
            <div className={styles.createInputSkeleton}></div>
            <div className={styles.createButtonSkeleton}></div>
          </div>
        </div>
      </div>
    </CoachPageLayout>
  );
};

export default SwimGroupsLoading;