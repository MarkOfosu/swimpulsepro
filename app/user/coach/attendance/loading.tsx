// attendance/loading.tsx
'use client';
import React from 'react';
import styles from '../../../styles/AttendanceRecorderLoading.module.css';

const AttendanceRecorderLoading = () => {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.headerSkeleton}>
        <div className={styles.titleSkeleton} />
        <div className={styles.coachInfoSkeleton} />
        <div className={styles.teamInfoSkeleton} />
      </div>

      {/* Group Selector */}
      <div className={styles.groupSelectorSkeleton}>
        <div className={styles.selectorLabelSkeleton} />
        <div className={styles.dropdownSkeleton} />
      </div>

      {/* Tabs */}
      <div className={styles.tabsSkeleton}>
        <div className={styles.tabButtonSkeleton} />
        <div className={styles.tabButtonSkeleton} />
      </div>

      {/* Date Selector */}
      <div className={styles.dateSelectorSkeleton}>
        <div className={styles.dateInputSkeleton} />
      </div>

      {/* Attendance List */}
      <div className={styles.attendanceListSkeleton}>
        {/* Header Row */}
        <div className={styles.listHeaderSkeleton}>
          <div className={styles.nameColumnSkeleton} />
          <div className={styles.statusColumnSkeleton} />
          <div className={styles.notesColumnSkeleton} />
        </div>

        {/* Attendee Rows */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className={styles.attendeeRowSkeleton}>
            <div className={styles.attendeeNameSkeleton} />
            <div className={styles.attendeeStatusSkeleton} />
            <div className={styles.attendeeNotesSkeleton} />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className={styles.submitButtonSkeleton} />
    </div>
  );
};

export default AttendanceRecorderLoading;