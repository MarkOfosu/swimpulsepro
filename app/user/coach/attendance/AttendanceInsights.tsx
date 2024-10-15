import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../../../styles/AttendanceInsights.module.css';

interface SwimmerAttendance {
  id: string;
  firstName: string;
  lastName: string;
  totalSessions: number;
  attendedSessions: number;
  attendancePercentage: number;
}

interface GroupAttendance {
  date: string;
  attendancePercentage: number;
}

const AttendanceInsights: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [swimmerAttendance, setSwimmerAttendance] = useState<SwimmerAttendance[]>([]);
  const [groupAttendance, setGroupAttendance] = useState<GroupAttendance[]>([]);
  const [selectedSwimmer, setSelectedSwimmer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    fetchAttendanceData();
  }, [groupId]);

  const fetchAttendanceData = async () => {
    try {
      // Fetch group name
      const { data: groupData, error: groupError } = await supabase
        .from('swim_groups')
        .select('name')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroupName(groupData.name);

      // Fetch swimmers with their profile information
      const { data: swimmers, error: swimmersError } = await supabase
        .from('swimmers')
        .select(`
          id,
          profiles(first_name, last_name)
        `)
        .eq('group_id', groupId);

      if (swimmersError) throw swimmersError;

      // Fetch attendance records
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('swimmer_id, date, is_present')
        .eq('swim_group_id', groupId);

      if (attendanceError) throw attendanceError;

      const swimmerStats = swimmers.map(swimmer => {
        const swimmerAttendance = attendance.filter(record => record.swimmer_id === swimmer.id);
        const totalSessions = swimmerAttendance.length;
        const attendedSessions = swimmerAttendance.filter(record => record.is_present).length;
        return {
          id: swimmer.id,
          firstName: swimmer.profiles.first_name,
          lastName: swimmer.profiles.last_name,
          totalSessions,
          attendedSessions,
          attendancePercentage: totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0
        };
      });

      setSwimmerAttendance(swimmerStats);

      const groupStats = attendance.reduce<Record<string, { total: number; present: number }>>((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
          acc[date] = { total: 0, present: 0 };
        }
        acc[date].total++;
        if (record.is_present) {
          acc[date].present++;
        }
        return acc;
      }, {});

      const groupAttendanceData = Object.entries(groupStats).map(([date, stats]) => ({
        date,
        attendancePercentage: (stats.present / stats.total) * 100
      }));

      setGroupAttendance(groupAttendanceData);
      setError(null);

    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data. Please try again later.');
    }
  };

  const renderSwimmerChart = () => {
    if (!selectedSwimmer) return null;

    const swimmer = swimmerAttendance.find(s => s.id === selectedSwimmer);
    if (!swimmer) return null;

    const data = [
      { name: 'Attended', value: swimmer.attendedSessions },
      { name: 'Missed', value: swimmer.totalSessions - swimmer.attendedSessions }
    ];

    return (
      <div className={styles.chart}>
        <h3>{`${swimmer.firstName} ${swimmer.lastName}'s Attendance`}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Attendance Insights for {groupName}</h2>
      <div className={styles.statsContainer}>
        <div className={styles.overallStats}>
          <h3>Overall Group Attendance</h3>
          {groupAttendance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendancePercentage" fill="#82ca9d" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No attendance data available for this group.</p>
          )}
        </div>
        <div className={styles.swimmerStats}>
          <h3>Swimmer Attendance</h3>
          {swimmerAttendance.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Sessions</th>
                  <th>Attended</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {swimmerAttendance.map(swimmer => (
                  <tr key={swimmer.id} onClick={() => setSelectedSwimmer(swimmer.id)}>
                    <td>{`${swimmer.firstName} ${swimmer.lastName}`}</td>
                    <td>{swimmer.totalSessions}</td>
                    <td>{swimmer.attendedSessions}</td>
                    <td>{swimmer.attendancePercentage.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No swimmers found in this group.</p>
          )}
        </div>
      </div>
      {renderSwimmerChart()}
    </div>
  );
};

export default AttendanceInsights;