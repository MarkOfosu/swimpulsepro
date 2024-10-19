// components/elements/swimResults/ProgressChart.tsx
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SwimResult } from '../../../app/lib/types';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/ProgressChart.module.css';

interface ProgressChartProps {
  swimmerId: string;
}

const CustomXAxis = ({ allowDuplicatedCategory = false, ...props }) => {
  return <XAxis allowDuplicatedCategory={allowDuplicatedCategory} {...props} />;
};

export const ProgressChart: React.FC<ProgressChartProps> = ({ swimmerId }) => {
  const [results, setResults] = useState<SwimResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('swim_results')
          .select('*')
          .eq('swimmer_id', swimmerId)
          .order('date', { ascending: true });
        
        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to fetch results. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [swimmerId]);

  const parseTimeToSeconds = (time: string): number => {
    const parts = time.split(':');
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts.map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      const [minutes, seconds] = parts.map(Number);
      return minutes * 60 + seconds;
    } else {
      return Number(time);
    }
  };

  const groupedResults = useMemo(() => {
    return results.reduce((acc, result) => {
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
  }, [results]);

  const formatYAxis = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);
    return `${minutes}:${remainingSeconds.padStart(5, '0')}`;
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  const eventOptions = Object.keys(groupedResults);

  const renderChart = () => {
    if (!selectedEvent) return null;

    const data = groupedResults[selectedEvent];
    const minTime = Math.min(...data.map(d => d.time));
    const maxTime = Math.max(...data.map(d => d.time));
    const range = maxTime - minTime;
    const domain = [minTime - range * 0.1, maxTime + range * 0.1];

    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.subtitle}>{selectedEvent}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <CustomXAxis dataKey="date" />
            <YAxis 
              tickFormatter={formatYAxis} 
              domain={domain} 
              reversed={true}
              label={{ value: 'Time', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => formatYAxis(value)}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line type="monotone" dataKey="time" stroke="#8884d8" name="Time" dot={{ r: 4 }} />
            <ReferenceLine y={minTime} label="Best Time" stroke="green" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Progress Over Time</h2>
      <select 
        className={styles.eventSelector}
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">Select an event</option>
        {eventOptions.map((event) => (
          <option key={event} value={event}>{event}</option>
        ))}
      </select>
      {renderChart()}
    </div>
  );
};

export default ProgressChart;