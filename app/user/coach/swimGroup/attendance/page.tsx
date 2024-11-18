'use client';

import React, { useState } from 'react';
import CoachPageLayout from "../../CoachPageLayout";
import AttendanceRecorder from "./AttendanceRecorder";
import AttendanceInsights from "./AttendanceInsights";
import styles from '../../../../styles/AttendancePage.module.css';

const AttendancePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'recorder' | 'insights'>('recorder');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  return (
    <CoachPageLayout>
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Attendance Management</h1>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${activeView === 'recorder' ? styles.active : ''}`}
              onClick={() => setActiveView('recorder')}
            >
              Record Attendance
            </button>
            <button
              className={`${styles.viewButton} ${activeView === 'insights' ? styles.active : ''}`}
              onClick={() => setActiveView('insights')}
            >
              View Insights
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {activeView === 'recorder' ? (
            <AttendanceRecorder onGroupSelect={handleGroupSelect} />
          ) : (
            selectedGroupId ? (
              <AttendanceInsights groupId={selectedGroupId} />
            ) : (
              <div className={styles.noSelection}>
                Please select a group first
              </div>
            )
          )}
        </div>
      </div>
    </CoachPageLayout>
  );
};

export default AttendancePage;