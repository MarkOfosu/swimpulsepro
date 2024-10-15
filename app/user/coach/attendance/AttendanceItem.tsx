
  'use client';
  // AttendanceItem.tsx
  import React, { useState } from 'react';
  import styles from '../../../styles/AttendanceItem.module.css';
  
  
 interface Swimmer {
    id: string;
    firstName: string;
    lastName: string;
  }
  
   interface AttendanceRecord {
    swimmerId: string;
    isPresent: boolean;
    notes: string;
  }
  


  interface AttendanceItemProps {
    swimmer: Swimmer;
    attendanceRecord: AttendanceRecord;
    onAttendanceChange: (swimmerId: string, isPresent: boolean) => void;
    onNotesChange: (swimmerId: string, notes: string) => void;
  }
  
  export const AttendanceItem: React.FC<AttendanceItemProps> = ({ swimmer, attendanceRecord, onAttendanceChange, onNotesChange }) => {
    const [showNotes, setShowNotes] = useState(false);
  
    return (
      <div className={styles.container}>
        <div className={styles.attendanceRow}>
          <label className={styles.label}>
            <input
              type="checkbox"
              checked={attendanceRecord.isPresent}
              onChange={(e) => onAttendanceChange(swimmer.id, e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.swimmerName}>{`${swimmer.firstName} ${swimmer.lastName}`}</span>
          </label>
          <button onClick={() => setShowNotes(!showNotes)} className={styles.notesButton}>
            {showNotes ? 'Hide Notes' : 'Add Notes'}
          </button>
        </div>
        {showNotes && (
          <textarea
            value={attendanceRecord.notes}
            onChange={(e) => onNotesChange(swimmer.id, e.target.value)}
            className={styles.notesInput}
            placeholder="Enter notes here..."
          />
        )}
      </div>
    );
  };
  