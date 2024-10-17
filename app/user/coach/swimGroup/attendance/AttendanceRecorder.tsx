'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SwimGroupSelector } from './SwimGroupSelector';
import { AttendanceList } from './AttendanceList';
import { getUserDetails, UserData } from '../../../../lib/getUserDetails';
import { useToast } from '../../../../../components/elements/toasts/Toast';
import AttendanceInsights from './AttendanceInsights';
import styles from '../../../../styles/AttendanceRecorder.module.css';

interface SwimGroup {
  id: string;
  name: string;
}

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

interface AttendanceRecorderProps {
  groupId?: string;
}

const AttendanceRecorder: React.FC<AttendanceRecorderProps> = ({ groupId }) => {
  const [swimGroups, setSwimGroups] = useState<SwimGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(groupId || null);
  const [attendanceDate, setAttendanceDate] = useState<string>('');
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'record' | 'insights'>('record');

  const supabase = createClient();
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserDetails();
        if (data && data.role === 'coach') {
          setUserData(data);
        } else {
          setError('User is not a coach or failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user details');
      }
    };

    fetchUserData();
    setCurrentDate();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchSwimGroups();
    }
  }, [userData]);

  useEffect(() => {
    if (selectedGroupId && attendanceDate) {
      fetchSwimmers();
      fetchAttendanceRecords();
    }
  }, [selectedGroupId, attendanceDate]);

  const setCurrentDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset*60*1000));
    setAttendanceDate(localDate.toISOString().split('T')[0]);
  };

  const fetchSwimGroups = async () => {
    if (!userData) return;

    const { data, error } = await supabase
      .from('swim_groups')
      .select('id, name')
      .eq('coach_id', userData.id);

    if (error) {
      console.error('Error fetching swim groups:', error);
      setError('Failed to fetch swim groups');
    } else {
      setSwimGroups(data || []);
      if (!selectedGroupId && data && data.length > 0) {
        setSelectedGroupId(data[0].id);
      }
    }
  };

  interface SwimmerResponse {
    id: string;
    profiles: {
      first_name: string;
      last_name: string;
    };
  }
  
  const fetchSwimmers = async () => {
    if (!selectedGroupId) return;
  
    const { data, error } = await supabase
      .from('swimmers')
      .select(`
        id,
        profiles(first_name, last_name)
      `)
      .eq('group_id', selectedGroupId);
  
    if (error) {
      console.error('Error fetching swimmers:', error);
      setError('Failed to fetch swimmers');
    } else {
      setSwimmers(((data as unknown) as SwimmerResponse[] || []).map(swimmer => ({
        id: swimmer.id,
        firstName: swimmer.profiles.first_name,
        lastName: swimmer.profiles.last_name,
      })));
    }
  };

  const fetchAttendanceRecords = async () => {
    if (!selectedGroupId) return;

    const { data, error } = await supabase
      .from('attendance')
      .select('swimmer_id, is_present, notes')
      .eq('swim_group_id', selectedGroupId)
      .eq('date', attendanceDate);

    if (error) {
      console.error('Error fetching attendance records:', error);
      setError('Failed to fetch attendance records');
    } else {
      setAttendanceRecords((data || []).map(record => ({
        swimmerId: record.swimmer_id,
        isPresent: record.is_present,
        notes: record.notes
      })));
    }
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentDate();
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttendanceDate(event.target.value);
  };

  const handleAttendanceSubmit = async (records: AttendanceRecord[]) => {
    if (!selectedGroupId || !userData) return;

    const { data, error } = await supabase
      .from('attendance')
      .upsert(
        records.map(record => ({
          swim_group_id: selectedGroupId,
          swimmer_id: record.swimmerId,
          coach_id: userData.id,
          date: attendanceDate,
          is_present: record.isPresent,
          notes: record.notes
        })),
        { onConflict: 'swim_group_id, swimmer_id, date' }
      );

    if (error) {
      console.error('Error saving attendance:', error);
      setError('Failed to save attendance');
      showToast('Failed to save attendance', 'error');
    } else {
      console.log('Attendance saved successfully');
      showToast('Attendance saved successfully', 'success');
      fetchAttendanceRecords();
      resetFields();
    }
  };

  const resetFields = () => {
    setCurrentDate();
    setAttendanceRecords([]);
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!userData) {
    return <div className={styles.loading}>Loading user data...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Attendance Management</h1>
      <p>Coach: {userData.first_name} {userData.last_name}</p>
      {userData.team_name && <p>Team: {userData.team_name}, {userData.team_location}</p>}
      {!groupId && (
        <SwimGroupSelector groups={swimGroups} onSelect={handleGroupSelect} />
      )}
      
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'record' ? styles.active : ''}`}
          onClick={() => setActiveTab('record')}
        >
          Record Attendance
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'insights' ? styles.active : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Attendance Insights
        </button>
      </div>

      {activeTab === 'record' && (
        <>
          <div className={styles.dateContainer}>
            <label htmlFor="attendanceDate" className={styles.dateLabel}>Attendance Date:</label>
            <input
              id="attendanceDate"
              type="date"
              value={attendanceDate}
              onChange={handleDateChange}
              className={styles.dateInput}
            />
          </div>
          {selectedGroupId && (
            <AttendanceList
              swimmers={swimmers}
              attendanceRecords={attendanceRecords}
              onSubmit={handleAttendanceSubmit}
            />
          )}
        </>
      )}

      {activeTab === 'insights' && selectedGroupId && (
        <AttendanceInsights groupId={selectedGroupId} />
      )}

      <ToastContainer />
    </div>
  );
};

export default AttendanceRecorder;