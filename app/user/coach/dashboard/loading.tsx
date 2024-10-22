'use client'
import React from 'react';
import CoachPageLayout from '../CoachPageLayout';
import styles from '../../../styles/LoadingDashboard.module.css';
import Loader from '@components/elements/Loader';

const DashboardLoading = () => {
  return (
    <CoachPageLayout>
      <div className={styles.dashboardContainer}>
        {/* <section className={styles.welcomeSection}>
          <h1 className={styles.skeletonText}>Welcome, Coach!</h1>
          <p className={styles.skeletonText}>Loading team information...</p>
        </section> */}

        <section className={styles.swimGroups}>
          <h2>Your Swim Groups</h2>
          <div className={styles.skeletonList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonItem}></div>
            ))}
          </div>
        </section>

        <section className={styles.recentActivities}>
          <h2>Recent Activities</h2>
          <Loader messages={["Loading recent activities...", "Fetching team updates..."]} />
        </section>

        <section className={styles.upcomingEvents}>
          <h2>Upcoming Events</h2>
          <div className={styles.calendarView}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeletonEvent}>
                <div className={styles.skeletonText}></div>
                <div className={styles.skeletonText}></div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.skeletonButton}></div>
          <div className={styles.skeletonButton}></div>
        </section>
      </div>
    </CoachPageLayout>
  );
};

export default DashboardLoading;