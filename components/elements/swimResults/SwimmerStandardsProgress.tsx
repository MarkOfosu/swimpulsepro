'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SwimResult, SwimStandard, SwimEvent } from '../../../app/lib/types';
import { createClient } from '@/utils/supabase/client';
import { getSwimEventsForSwimmer } from '../../../app/lib/swimUtils';
import styles from '../../styles/SwimmerStandardsProgress.module.css';
import Link from 'next/link';

// Updated props interface to make displayCount optional
interface SwimmerStandardsProgressProps {
  swimmerId: string;
  displayCount?: number; // Optional number of standards to display
}

export const SwimmerStandardsProgress: React.FC<SwimmerStandardsProgressProps> = ({ swimmerId, displayCount }) => {
  const [personalBests, setPersonalBests] = useState<SwimResult[]>([]);
  const [standards, setStandards] = useState<SwimStandard[]>([]);
  const [events, setEvents] = useState<SwimEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const supabase = createClient();

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    // Fetch personal bests from the view
    const { data: personalBestsData, error: personalBestsError } = await supabase
      .from('swimmer_personal_bests')
      .select('*')
      .eq('swimmer_id', swimmerId);

    if (personalBestsError) {
      console.error('Error fetching personal bests:', personalBestsError);
    } else {
      setPersonalBests(personalBestsData || []);
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

      // Fetch available events for the swimmer
      const swimmerEvents = await getSwimEventsForSwimmer(swimmerId);
      setEvents(swimmerEvents);
    }
  }, [swimmerId, supabase]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up real-time listener and fetch initial data
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('swim_results_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'swim_results' }, (payload) => {
        console.log('Change received!', payload);
        fetchData(); // Re-fetch data when changes occur
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [swimmerId, supabase, fetchData]);

  // Helper function to parse time strings to seconds
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

  // Calculate progress data for each event
  const getProgressData = (event: SwimEvent) => {
    const personalBest = personalBests.find(pb => pb.event === event.name && pb.course === event.course);
  
    const standard = standards.find(s => {
      const eventMatch = s.event.replace(/\s+/g, '').toLowerCase() === event.name.replace(/\s+/g, '').toLowerCase();
      const courseMatch = s.course.toLowerCase() === event.course.toLowerCase();
      return eventMatch && courseMatch;
    });
  
    if (!standard) return null;
  
    const standardLevels = ['b', 'bb', 'a', 'aa', 'aaa', 'aaaa'];
  
    const standardTimes = standardLevels.map(level => ({
      level: level.toUpperCase(),
      time: standard[`${level}_standard` as keyof SwimStandard] as string,
      seconds: parseTimeToSeconds(standard[`${level}_standard` as keyof SwimStandard] as string)
    })).sort((a, b) => b.seconds - a.seconds);
  
    if (!personalBest) {
      return {
        currentStandard: 'Pre-B',
        nextStandard: 'B',
        progress: 0,
        personalBestTime: 'N/A',
        personalBestSeconds: Infinity,
        standardTimes,
        progressColor: '#e0e0e0'
      };
    }
  
    const pbTime = personalBest.best_time ? parseTimeToSeconds(personalBest.best_time) : Infinity;
    
    let currentStandard = 'Pre-B';
    let nextStandard = 'B';
    let progress = 0;
    let progressColor = '#e0e0e0';
  
    for (let i = standardTimes.length - 1; i >= 0; i--) {
      if (pbTime <= standardTimes[i].seconds) {
        currentStandard = standardTimes[i].level;
        nextStandard = i > 0 ? standardTimes[i - 1].level : 'Max';
        
        if (i > 0) {
          const prevStandardTime = standardTimes[i - 1].seconds;
          progress = ((standardTimes[i].seconds - pbTime) / (standardTimes[i].seconds - prevStandardTime)) * 100;
        } else {
          progress = 100;
        }
        
        break;
      }
    }
  
    progress = Math.max(0, Math.min(100, progress));
  
    switch (currentStandard) {
      case 'B':
        progressColor = '#4CAF50';
        break;
      case 'BB':
        progressColor = '#8BC34A';
        break;
      case 'A':
        progressColor = '#FFEB3B';
        break;
      case 'AA':
        progressColor = '#FFC107';
        break;
      case 'AAA':
        progressColor = '#FF9800';
        break;
      case 'AAAA':
        progressColor = '#FF5722';
        break;
      default:
        progressColor = '#e0e0e0';
    }
  
    return {
      currentStandard,
      nextStandard,
      progress,
      personalBestTime: personalBest.best_time,
      personalBestSeconds: pbTime,
      standardTimes,
      progressColor
    };
  };

  // Toggle event expansion
  const toggleEventExpansion = (eventKey: string) => {
    setExpandedEvents(prev => 
      prev.includes(eventKey) 
        ? prev.filter(key => key !== eventKey)
        : [...prev, eventKey]
    );
  };

  // Render the progress bar for each event
  const renderProgressBar = (event: SwimEvent, progressData: ReturnType<typeof getProgressData>) => {
    if (!progressData) return null;
    
    const totalStandards = progressData.standardTimes.length;
    const standardWidth = 100 / totalStandards;
  
    let pbPosition = 0;
    
    if (progressData.personalBestTime !== 'N/A') {
      const pbTime = progressData.personalBestSeconds;
      
      for (let i = 0; i < totalStandards; i++) {
        if (pbTime >= progressData.standardTimes[i].seconds) {
          if (i === 0) {
            pbPosition = (pbTime - progressData.standardTimes[i].seconds) / 
              (parseTimeToSeconds(event.name.split(' ')[0]) - progressData.standardTimes[i].seconds) * standardWidth;
          } else {
            const prevStandard = progressData.standardTimes[i - 1];
            const currentStandard = progressData.standardTimes[i];
            
            pbPosition = (i - 1) * standardWidth + 
              ((prevStandard.seconds - pbTime) / (prevStandard.seconds - currentStandard.seconds)) * standardWidth;
          }
          break;
        }
      }
      
      if (pbPosition === 0) {
        pbPosition = 100;
      }
    }
  
    return (
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          {progressData.standardTimes.map((standard, index) => (
            <div 
              key={standard.level} 
              className={styles.standardMarker}
              style={{ left: `${index * standardWidth}%` }}
            >
              <span className={styles.standardLabel}>{standard.level}</span>
              <span className={styles.standardTime}>{standard.time}</span>
            </div>
          ))}
          {progressData.personalBestTime !== 'N/A' && (
            <div 
              className={styles.personalBestMarker}
              style={{ left: `${pbPosition}%` }}
            >
              <span className={styles.personalBestLabel}>PB</span>
              <span className={styles.personalBestTime}>{progressData.personalBestTime}</span>
            </div>
          )}
          <div 
            className={styles.progress} 
            style={{ 
              width: `${pbPosition}%`,
              backgroundColor: progressData.progressColor
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Sort events based on their ranking
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const progressA = getProgressData(a);
      const progressB = getProgressData(b);
      
      if (!progressA || !progressB) return 0;
      
      const rankA = progressA.standardTimes.findIndex(s => s.level === progressA.currentStandard);
      const rankB = progressB.standardTimes.findIndex(s => s.level === progressB.currentStandard);
      
      return sortOrder === 'desc' ? rankB - rankA : rankA - rankB;
    });
  }, [events, sortOrder]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Determine the number of events to display
  const eventsToDisplay = displayCount ? sortedEvents.slice(0, displayCount) : sortedEvents;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Standards Progress</h2>
      <button onClick={toggleSortOrder} className={styles.sortButton}>
        Sort by Ranking: {sortOrder === 'desc' ? 'Highest to Lowest' : 'Lowest to Highest'}
      </button>
      {eventsToDisplay.map((event) => {
        const progressData = getProgressData(event);
        if (!progressData) return null;
        const eventKey = `${event.name}_${event.course}`;
        const isExpanded = expandedEvents.includes(eventKey);
  
        return (
          <div key={eventKey} className={styles.eventProgress}>
            <h3 
              className={styles.eventTitle} 
              onClick={() => toggleEventExpansion(eventKey)}
            >
              {`${event.name} (${event.course})`}
              <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
            </h3>
            {renderProgressBar(event, progressData)}
            <div className={`${styles.eventDetails} ${isExpanded ? styles.expanded : ''}`}>
              <p className={styles.eventInfo}>
                Current Standard: {progressData.currentStandard}
              </p>
              <p className={styles.eventInfo}>
                Next Standard: {progressData.nextStandard}
              </p>
              <p className={styles.eventInfo}>
                Personal Best: {progressData.personalBestTime}
              </p>
              <p className={styles.eventInfo}>
                Progress to Next Standard: {progressData.progress.toFixed(2)}%
              </p>
            </div>
          </div>
        );
      })}
      {/* Show "Show All" button if there are more events to display */}
      {displayCount && sortedEvents.length > displayCount && (
        <Link href={`/user/swimmer/standards`}>
          <button className={styles.showAllButton}>Show All Standards</button>
        </Link>
      )}
    </div>
  );
};

export default SwimmerStandardsProgress;