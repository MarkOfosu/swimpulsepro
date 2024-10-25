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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from('swim_results')
          .select('*')
          .eq('swimmer_id', swimmerId)
          .order('date', { ascending: false });
        
        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        setError('Error fetching results. Please try again later.');
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [swimmerId]);

  if (loading) {
    return <div className={styles.loadingState}>Loading results...</div>;
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  if (results.length === 0) {
    return <div className={styles.emptyState}>No results found</div>;
  }

  return (
    <div className={styles.tableContainer}>
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
              <td data-label="Date">{new Date(result.date).toLocaleDateString()}</td>
              <td data-label="Meet">{result.meet_name}</td>
              <td data-label="Event">{`${result.event} (${result.course})`}</td>
              <td data-label="Time">{result.time}</td>
              <td data-label="Personal Best">
                {result.is_personal_best ? (
                  <span className={styles.personalBest}>Yes</span>
                ) : (
                  <span className={styles.notPersonalBest}>No</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};