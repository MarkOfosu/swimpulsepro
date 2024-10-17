
// components/elements/swimResults/SwimmerResultsHistory.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { SwimResult } from '../../../app/lib/types';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/SwimmerResultsHistory.module.css';

interface SwimmerResultsHistoryProps {
  swimmerId: string;
}

export const SwimmerResultsHistory: React.FC<SwimmerResultsHistoryProps> = ({ swimmerId }) => {
  const [results, setResults] = useState<SwimResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('swim_results')
        .select('*')
        .eq('swimmer_id', swimmerId)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching results:', error);
      } else {
        setResults(data || []);
      }
    };

    fetchResults();
  }, [swimmerId]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Meet</th>
          <th>Event</th>
          <th>Time</th>
          <th>Personal Best</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr key={result.id}>
            <td>{new Date(result.date).toLocaleDateString()}</td>
            <td>{result.meet_name}</td>
            <td>{`${result.event} (${result.course})`}</td>
            <td>{result.time}</td>
            <td>{result.is_personal_best ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
