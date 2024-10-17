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

  const groupedResults = results.reduce((acc, result) => {
    const key = result.event;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      date: new Date(result.date).toLocaleDateString(),
      time: parseFloat(result.time)
    });
    return acc;
  }, {} as Record<string, { date: string; time: number }[]>);

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
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="time" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};