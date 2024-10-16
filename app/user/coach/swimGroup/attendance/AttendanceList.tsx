
'use client';
// AttendanceList.tsx
import React, { useState, useEffect } from 'react';
import  { AttendanceItem } from './AttendanceItem';

import styles from '../../../styles/AttendanceList.module.css';



 interface AttendanceRecord {
    swimmerId: string;
    isPresent: boolean;
    notes: string;
  }
  
 interface Swimmer {
    id: string;
    firstName: string;
    lastName: string;
  }

interface AttendanceListProps {
    swimmers: Swimmer[];
    attendanceRecords: AttendanceRecord[];
    onSubmit: (records: AttendanceRecord[]) => Promise<void>;
  
  }

export const  AttendanceList: React.FC<AttendanceListProps> = ({ swimmers, attendanceRecords, onSubmit }) => {
  const [localAttendance, setLocalAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const initialAttendance = swimmers.map(swimmer => {
      const existingRecord = attendanceRecords.find(record => record.swimmerId === swimmer.id);
      return existingRecord || { swimmerId: swimmer.id, isPresent: false, notes: '' };
    });
    setLocalAttendance(initialAttendance);
  }, [swimmers, attendanceRecords]);
 
  const handleAttendanceChange = (swimmerId: string, isPresent: boolean) => {
    setLocalAttendance(prev =>
      prev.map(record =>
        record.swimmerId === swimmerId ? { ...record, isPresent } : record
      )
    );
  };

  const handleNotesChange = (swimmerId: string, notes: string) => {
    setLocalAttendance(prev =>
      prev.map(record =>
        record.swimmerId === swimmerId ? { ...record, notes } : record
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(localAttendance);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Attendance List</h2>
      {swimmers.map(swimmer => (
        <AttendanceItem
          key={swimmer.id}
          swimmer={swimmer}
          attendanceRecord={localAttendance.find(record => record.swimmerId === swimmer.id) || { swimmerId: swimmer.id, isPresent: false, notes: '' }}
          onAttendanceChange={handleAttendanceChange}
          onNotesChange={handleNotesChange}
        />
      ))}
      <button onClick={handleSubmit} className={styles.submitButton}>
        Save Attendance
      </button>
    </div>
  );
};

