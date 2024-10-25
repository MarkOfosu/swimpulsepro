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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const groupedResults = useMemo(() => {
    return results.reduce((acc, result) => {
      const key = `${result.event} (${result.course})`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        date: result.date.toString(), // Store the date as a string
        displayDate: formatDate(result.date.toString()), // Add formatted date for display
        time: parseTimeToSeconds(result.time)
      });
      return acc;
    }, {} as Record<string, { date: string; displayDate: string; time: number }[]>);
  }, [results]);

  const formatYAxis = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(2);
    return `${minutes}:${seconds.padStart(5, '0')}`;
  };

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
            <CustomXAxis 
              dataKey="displayDate" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              domain={domain} 
              reversed={true}
              label={{ value: 'Time', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value: number) => formatYAxis(value)}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return `Date: ${payload[0].payload.displayDate}`;
                }
                return `Date: ${label}`;
              }}
              contentStyle={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '8px 12px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="time" 
              stroke="#05857b" 
              name="Time" 
              dot={{ r: 4, fill: '#05857b' }} 
              activeDot={{ r: 6, fill: '#05857b' }}
            />
            <ReferenceLine 
              y={minTime} 
              label={{ 
                value: "Best Time", 
                position: 'right',
                fill: '#4caf50',
                fontSize: 12 
              }} 
              stroke="#4caf50" 
              strokeDasharray="3 3" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const eventOptions = Object.keys(groupedResults);

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