'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../../../../styles/AttendanceInsights.module.css';

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
  totalPresent: number;
  totalSwimmers: number;
}

interface AttendanceInsightsProps {
  groupId: string;
}

const AttendanceInsights: React.FC<AttendanceInsightsProps> = ({ groupId }) => {
  const [swimmerAttendance, setSwimmerAttendance] = useState<SwimmerAttendance[]>([]);
  const [groupAttendance, setGroupAttendance] = useState<GroupAttendance[]>([]);
  const [selectedSwimmer, setSelectedSwimmer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState<string>('');
  
  const supabase = createClient();

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch group details
      const { data: groupData, error: groupError } = await supabase
        .from('swim_groups')
        .select('name')
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;
      setGroupName(groupData.name);

      // Fetch swimmers with their profiles
      const { data: swimmers, error: swimmersError } = await supabase
        .from('swimmers')
        .select(`
          id,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('group_id', groupId);

      if (swimmersError) throw swimmersError;

      // Fetch attendance records
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('swim_group_id', groupId)
        .order('date', { ascending: true });

      if (attendanceError) throw attendanceError;

      // Process individual swimmer attendance
      const swimmerStats = swimmers.map((swimmer: any) => {
        const swimmerRecords = attendance.filter(record => record.swimmer_id === swimmer.id);
        const totalSessions = swimmerRecords.length;
        const attendedSessions = swimmerRecords.filter(record => record.is_present).length;

        return {
          id: swimmer.id,
          firstName: swimmer.profiles.first_name,
          lastName: swimmer.profiles.last_name,
          totalSessions,
          attendedSessions,
          attendancePercentage: totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0
        };
      });

      const groupedByDate = attendance.reduce((acc: any, record) => {
        const date = new Date(record.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });

        if (!acc[date]) {
          acc[date] = {
            totalSwimmers: 0,
            totalPresent: 0
          };
        }

        acc[date].totalSwimmers++;
        if (record.is_present) {
          acc[date].totalPresent++;
        }

        return acc;
      }, {});

      const groupStats = Object.entries(groupedByDate).map(([date, stats]: [string, any]) => ({
        date,
        totalPresent: stats.totalPresent,
        totalSwimmers: stats.totalSwimmers,
        attendancePercentage: (stats.totalPresent / stats.totalSwimmers) * 100
      }));

      setSwimmerAttendance(swimmerStats);
      setGroupAttendance(groupStats);

    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [groupId, supabase]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const getAttendanceClass = (percentage: number) => {
    if (percentage >= 80) return styles.highAttendance;
    if (percentage >= 60) return styles.mediumAttendance;
    return styles.lowAttendance;
  };

  const renderGroupChart = () => (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={groupAttendance} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" className={styles.chartGrid} />
          <XAxis 
            dataKey="date" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className={styles.tooltipContent}>
                    <p className={styles.tooltipLabel}>{label}</p>
                    <p className={styles.tooltipData}>
                      Attendance: {data.attendancePercentage.toFixed(1)}%
                      <br />
                      Present: {data.totalPresent}/{data.totalSwimmers}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar 
            dataKey="attendancePercentage" 
            name="Attendance %" 
            radius={[4, 4, 0, 0]}
            fill="#05857b"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderSwimmerChart = () => {
    if (!selectedSwimmer) return null;
  
    const swimmer = swimmerAttendance.find(s => s.id === selectedSwimmer);
    if (!swimmer) return null;
  
    const data = [
      { 
        name: 'Present', 
        value: swimmer.attendedSessions,
        type: 'present'
      },
      { 
        name: 'Absent', 
        value: swimmer.totalSessions - swimmer.attendedSessions,
        type: 'absent'
      }
    ];
  
    const colors = {
      present: '#22C55E', // Green for present
      absent: '#EF4444'   // Red for absent
    };
  
    const CustomBar = (props: any) => {
      const { x, y, width, height, payload } = props;
      const fill = colors[payload.type as keyof typeof colors];
  
      return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />;
    };
  
    return (
      <div className={styles.swimmerChartContainer}>
        <h3>
          <span className={styles.swimmerName}>
            {`${swimmer.firstName} ${swimmer.lastName}`}
          </span>
          <span className={`${styles.percentage} ${getAttendanceClass(swimmer.attendancePercentage)}`}>
            {swimmer.attendancePercentage.toFixed(1)}%
          </span>
        </h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className={styles.chartGrid} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div className={styles.tooltipContent}>
                        <p className={styles.tooltipLabel}>{label}</p>
                        <p className={styles.tooltipData}>
                          {`Sessions: ${dataPoint.value}`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Sessions" 
                shape={<CustomBar />}
                fill="#000000" // This won't be used but is required
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading attendance data...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Attendance Insights for {groupName}</h2>
      <div className={styles.statsContainer}>
        <div className={styles.overallStats}>
          <h3>Overall Group Attendance</h3>
          {groupAttendance.length > 0 ? renderGroupChart() : (
            <p className={styles.noData}>No attendance data available for this group.</p>
          )}
        </div>
        
        <div className={styles.swimmerStats}>
          <h3>Individual Attendance</h3>
          {swimmerAttendance.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Total</th>
                    <th>Present</th>
                    <th>Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {swimmerAttendance
                    .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
                    .map(swimmer => (
                      <tr 
                        key={swimmer.id} 
                        onClick={() => setSelectedSwimmer(swimmer.id)}
                        className={`
                          ${styles.swimmerRow} 
                          ${swimmer.id === selectedSwimmer ? styles.selectedRow : ''}
                        `}
                      >
                        <td data-label="Name">
                          {`${swimmer.firstName} ${swimmer.lastName}`}
                        </td>
                        <td data-label="Total">
                          {swimmer.totalSessions}
                        </td>
                        <td data-label="Present">
                          {swimmer.attendedSessions}
                        </td>
                        <td data-label="Rate">
                          <span className={`${styles.percentage} ${getAttendanceClass(swimmer.attendancePercentage)}`}>
                            {swimmer.attendancePercentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.noData}>No swimmers found in this group.</p>
          )}
        </div>
      </div>
      {renderSwimmerChart()}
    </div>
  );
};

export default AttendanceInsights;