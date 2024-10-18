// components/elements/swimResults/ProgressChart.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SwimResult } from '../../../app/lib/types';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/ProgressChart.module.css';

interface ProgressChartProps {
  swimmerId: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ swimmerId }) => {
  const [results, setResults] = useState<SwimResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('swim_results')
        .select('*')
        .eq('swimmer_id', swimmerId)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching results:', error);
      } else {
        setResults(data || []);
      }
    };

    fetchResults();
  }, [swimmerId]);

  const parseTimeToSeconds = (time: string): number => {
    // Assuming time is in the format "HH:MM:SS.ss" or "MM:SS.ss"
    const parts = time.split(':');
    if (parts.length === 3) {
      // Format is HH:MM:SS.ss
      const [hours, minutes, seconds] = parts.map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      // Format is MM:SS.ss
      const [minutes, seconds] = parts.map(Number);
      return minutes * 60 + seconds;
    } else {
      // Assuming it's just seconds
      return Number(time);
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    const key = `${result.event} (${result.course})`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      date: new Date(result.date).toLocaleDateString(),
      time: parseTimeToSeconds(result.time)
    });
    return acc;
  }, {} as Record<string, { date: string; time: number }[]>);

  const formatYAxis = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${minutes}:${remainingSeconds.padStart(5, '0')}`;
  };

  return (
    <div className={styles.container}>
      <h2>Progress Over Time</h2>
      {Object.entries(groupedResults).map(([event, data]) => (
        <div key={event} className={styles.chartContainer}>
          <h3>{event}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatYAxis} domain={['auto', 'auto']} reversed={true} />
              <Tooltip 
                formatter={(value: number) => formatYAxis(value)}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="time" stroke="#8884d8" name="Time" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};