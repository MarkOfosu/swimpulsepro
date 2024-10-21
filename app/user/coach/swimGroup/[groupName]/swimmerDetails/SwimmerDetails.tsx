'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from '../../../../../styles/SwimmerDetails.module.css';

interface SwimmerDetailsProps {
  swimmerId: string;
}

interface Swimmer {
  id: string;
  first_name: string;
  last_name: string;
  age_group: string;
  gender: string;
}

interface SwimStandard {
  event: string;
  course: string;
  best_time: string;
  achieved_standard: string;
  b_standard: string;
  bb_standard: string;
  a_standard: string;
  aa_standard: string;
  aaa_standard: string;
  aaaa_standard: string;
}

const SwimmerDetails: React.FC<SwimmerDetailsProps> = ({ swimmerId }) => {
  const [swimmer, setSwimmer] = useState<Swimmer | null>(null);
  const [standards, setStandards] = useState<SwimStandard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchSwimmerDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch swimmer details
        const { data: swimmerData, error: swimmerError } = await supabase
          .from('swimmers')
          .select(`
            id,
            profiles (first_name, last_name, gender),
            age_group
          `)
          .eq('id', swimmerId)
          .single();

        if (swimmerError) throw swimmerError;

        setSwimmer({
          id: swimmerData.id,
          first_name: swimmerData.profiles.first_name,
          last_name: swimmerData.profiles.last_name,
          age_group: swimmerData.age_group,
          gender: swimmerData.profiles.gender
        });

        // Fetch swimmer standards
        const { data: standardsData, error: standardsError } = await supabase
          .from('swimmer_standards')
          .select('*')
          .eq('swimmer_id', swimmerId);

        if (standardsError) throw standardsError;

        setStandards(standardsData);

      } catch (error) {
        console.error('Error fetching swimmer details:', error);
        setError('Failed to load swimmer details');
      } finally {
        setLoading(false);
      }
    };

    fetchSwimmerDetails();
  }, [swimmerId, supabase]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!swimmer) return <div className={styles.error}>Swimmer not found</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.swimmerName}>{swimmer.first_name} {swimmer.last_name}</h2>
      <p className={styles.swimmerInfo}>Age Group: {swimmer.age_group} | Gender: {swimmer.gender}</p>
      
      <h3 className={styles.sectionTitle}>Swimming Standards</h3>
      <div className={styles.standardsTable}>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Course</th>
              <th>Best Time</th>
              <th>Current Standard</th>
              <th>B</th>
              <th>BB</th>
              <th>A</th>
              <th>AA</th>
              <th>AAA</th>
              <th>AAAA</th>
            </tr>
          </thead>
          <tbody>
            {standards.map((standard, index) => (
              <tr key={index}>
                <td>{standard.event}</td>
                <td>{standard.course}</td>
                <td>{standard.best_time}</td>
                <td>{standard.achieved_standard}</td>
                <td>{standard.b_standard}</td>
                <td>{standard.bb_standard}</td>
                <td>{standard.a_standard}</td>
                <td>{standard.aa_standard}</td>
                <td>{standard.aaa_standard}</td>
                <td>{standard.aaaa_standard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SwimmerDetails;