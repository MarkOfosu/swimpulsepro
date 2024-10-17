import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from "@components/elements/Card";
import Loader from '@components/elements/Loader';
import styles from '../../styles/SwimmerAttendanceInsights.module.css';

interface AttendanceData {
  date: string;
  isPresent: boolean;
}

interface ChartData {
  date: string;
  attendance: number;
}

interface AttendanceStats {
  totalSessions: number;
  attendedSessions: number;
  attendancePercentage: number;
}

const SwimmerAttendanceInsights: React.FC<{ swimmerId: string }> = ({ swimmerId }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchAttendanceData();
  }, [swimmerId]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance')
        .select('date, is_present')
        .eq('swimmer_id', swimmerId)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(record => ({
        date: record.date,
        isPresent: record.is_present
      }));

      setAttendanceData(formattedData);
      processChartData(formattedData);
      calculateAttendanceStats(formattedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data: AttendanceData[]) => {
    const chartData = data.map(record => ({
      date: record.date,
      attendance: record.isPresent ? 1 : 0
    }));
    setChartData(chartData);
  };

  const calculateAttendanceStats = (data: AttendanceData[]) => {
    const totalSessions = data.length;
    const attendedSessions = data.filter(record => record.isPresent).length;
    const attendancePercentage = totalSessions > 0 
      ? (attendedSessions / totalSessions) * 100 
      : 0;

    setAttendanceStats({
      totalSessions,
      attendedSessions,
      attendancePercentage
    });
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <Card className={styles.container}>
      <CardHeader>
        <h2 className={styles.title}>Your Attendance Insights</h2>
      </CardHeader>
      <CardContent>
        {attendanceStats && (
          <div className={styles.stats}>
            <p>Total Sessions: {attendanceStats.totalSessions}</p>
            <p>Attended Sessions: {attendanceStats.attendedSessions}</p>
            <p>Attendance Rate: {attendanceStats.attendancePercentage.toFixed(2)}%</p>
          </div>
        )}
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 1]} ticks={[0, 1]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendance" fill="#82ca9d" name="Attendance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SwimmerAttendanceInsights;