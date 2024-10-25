import React, { useEffect, useState } from 'react';
import { SwimResult, SwimStandard } from '../../../app/lib/types';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/PersonalBestsComparison.module.css';

interface PersonalBestsComparisonProps {
  swimmerId: string;
}

export const PersonalBestsComparison: React.FC<PersonalBestsComparisonProps> = ({ swimmerId }) => {
  const [personalBests, setPersonalBests] = useState<SwimResult[]>([]);
  const [standards, setStandards] = useState<SwimStandard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch all results
      const { data: resultsData, error: resultsError } = await supabase
        .from('swim_results')
        .select('*')
        .eq('swimmer_id', swimmerId);

      if (resultsError) {
        console.error('Error fetching results:', resultsError);
      } else {
        const personalBests = calculatePersonalBests(resultsData);
        setPersonalBests(personalBests);
      }

      // Fetch swimmer details
      const { data: swimmerData, error: swimmerError } = await supabase
        .from('swimmers')
        .select('age_group')
        .eq('id', swimmerId)
        .single();

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('gender')
        .eq('id', swimmerId)
        .single();

      if (swimmerError || profileError) {
        console.error('Error fetching swimmer details:', swimmerError || profileError);
      } else if (swimmerData && profileData) {
        // Fetch standards
        const { data: standardsData, error: standardsError } = await supabase
          .from('swim_standards')
          .select('*')
          .eq('age_group', swimmerData.age_group)
          .eq('gender', profileData.gender);

        if (standardsError) {
          console.error('Error fetching standards:', standardsError);
        } else {
          setStandards(standardsData || []);
        }
      }
    };

    fetchData();
  }, [swimmerId]);

  // Helper function to calculate personal bests
  const calculatePersonalBests = (results: SwimResult[]) => {
    const bests: { [key: string]: SwimResult } = {};
    results.forEach(result => {
      const key = `${result.event}_${result.course}`;
      if (!bests[key] || parseTimeToSeconds(result.time) < parseTimeToSeconds(bests[key].time)) {
        bests[key] = result;
      }
    });
    return Object.values(bests);
  };

  // Helper function to parse time string to seconds
  const parseTimeToSeconds = (time: string): number => {
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
      // Assume it's just seconds
      return Number(time);
    }
  };

  const getAchievedStandard = (result: SwimResult) => {

    // More flexible matching
    const standard = standards.find(s => {
      const eventMatch = s.event.replace(/\s+/g, '').toLowerCase() === result.event.replace(/\s+/g, '').toLowerCase();
      const courseMatch = s.course.toLowerCase() === result.course.toLowerCase();
      return eventMatch && courseMatch;
    });
    
    if (!standard) {
      return 'N/A';
    }

    const resultTime = parseTimeToSeconds(result.time);

    if (resultTime <= parseTimeToSeconds(standard.aaaa_standard)) return 'AAAA';
    if (resultTime <= parseTimeToSeconds(standard.aaa_standard)) return 'AAA';
    if (resultTime <= parseTimeToSeconds(standard.aa_standard)) return 'AA';
    if (resultTime <= parseTimeToSeconds(standard.a_standard)) return 'A';
    if (resultTime <= parseTimeToSeconds(standard.bb_standard)) return 'BB';
    if (resultTime <= parseTimeToSeconds(standard.b_standard)) return 'B';
    return 'Pre-B';
  };
  const getStandardClassName = (standard: string) => {
    const standardMap: { [key: string]: string } = {
      'AAAA': styles.AAAA,
      'AAA': styles.AAA,
      'AA': styles.AA,
      'A': styles.A,
      'BB': styles.BB,
      'B': styles.B,
      'Pre-B': styles.PreB,
      'N/A': styles.NA
    };
    return `${styles.achievedStandard} ${standardMap[standard] || styles.NA}`;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Event</th>
            <th>Personal Best</th>
            <th>Achieved Standard</th>
          </tr>
        </thead>
        <tbody>
          {personalBests.map((pb) => (
            <tr key={pb.id}>
              <td data-label="Event">{`${pb.event} (${pb.course})`}</td>
              <td data-label="Personal Best">{pb.time}</td>
              <td data-label="Achieved Standard">
                <span className={getStandardClassName(getAchievedStandard(pb))}>
                  {getAchievedStandard(pb)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonalBestsComparison;