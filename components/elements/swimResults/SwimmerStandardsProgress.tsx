import React, { useEffect, useState } from 'react';
import { SwimResult, SwimStandard, SwimEvent } from '../../../app/lib/types';
import { createClient } from '@/utils/supabase/client';
import { getSwimEventsForSwimmer } from '../../../app/lib/swimUtils';
import styles from '../../styles/SwimmerStandardsProgress.module.css';

interface SwimmerStandardsProgressProps {
  swimmerId: string;
}

export const SwimmerStandardsProgress: React.FC<SwimmerStandardsProgressProps> = ({ swimmerId }) => {
  const [personalBests, setPersonalBests] = useState<SwimResult[]>([]);
  const [standards, setStandards] = useState<SwimStandard[]>([]);
  const [events, setEvents] = useState<SwimEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
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
    };

    fetchData();
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
    }));

    if (!personalBest) {
      return {
        currentStandard: 'Pre-B',
        nextStandard: 'B',
        progress: 0,
        personalBestTime: 'N/A',
        standardTimes,
        progressColor: '#e0e0e0'
      };
    }

    const pbTime = personalBest.best_time ? parseTimeToSeconds(personalBest.best_time) : 0;
    let currentStandard = 'Pre-B';
    let nextStandard = 'B';
    let progress = 0;
    let progressColor = '#e0e0e0';

    for (let i = 0; i < standardTimes.length; i++) {
      if (pbTime <= standardTimes[i].seconds) {
        currentStandard = standardTimes[i].level;
        nextStandard = i < standardTimes.length - 1 ? standardTimes[i + 1].level : 'Max';
        
        if (i > 0) {
          const prevStandardTime = standardTimes[i - 1].seconds;
          const currentStandardTime = standardTimes[i].seconds;
          progress = ((prevStandardTime - pbTime) / (prevStandardTime - currentStandardTime)) * 100;
        } else {
          const nextStandardTime = standardTimes[i + 1].seconds;
          progress = ((pbTime - nextStandardTime) / (standardTimes[i].seconds - nextStandardTime)) * 100;
        }
        
        break;
      }
    }

    // Ensure progress is between 0 and 100
    progress = Math.max(0, Math.min(100, progress));

    // Set progress color based on the achieved standard
    switch (currentStandard) {
      case 'B':
        progressColor = '#4CAF50'; // Green
        break;
      case 'BB':
        progressColor = '#8BC34A'; // Light Green
        break;
      case 'A':
        progressColor = '#FFEB3B'; // Yellow
        break;
      case 'AA':
        progressColor = '#FFC107'; // Amber
        break;
      case 'AAA':
        progressColor = '#FF9800'; // Orange
        break;
      case 'AAAA':
        progressColor = '#FF5722'; // Deep Orange
        break;
      default:
        progressColor = '#e0e0e0'; // Grey for Pre-B
    }

    return {
      currentStandard,
      nextStandard,
      progress,
      personalBestTime: personalBest.best_time,
      standardTimes,
      progressColor
    };
  };

  const toggleEventExpansion = (eventKey: string) => {
    setExpandedEvents(prev => 
      prev.includes(eventKey) 
        ? prev.filter(key => key !== eventKey)
        : [...prev, eventKey]
    );
  };
  const renderProgressBar = (event: SwimEvent, progressData: ReturnType<typeof getProgressData>) => {
    if (!progressData) return null;

    return (
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progress} 
            style={{ 
              width: `${progressData.progress}%`,
              backgroundColor: progressData.progressColor
            }}
          ></div>
          {progressData.standardTimes.map((standard, index) => (
            (!isMobile || index % 1 === 0) && (
              <div 
                key={standard.level} 
                className={styles.standardMarker}
                style={{ left: `${(index + 1) * (100 / (progressData.standardTimes.length + 1))}%` }}
              >
                <span className={styles.standardLabel}>{standard.level}</span>
                <span className={styles.standardTime}>{standard.time}</span>
              </div>
            )
          ))}
          {progressData.personalBestTime !== 'N/A' && (
            <div 
              className={styles.personalBestMarker}
              style={{ left: `${progressData.progress}%` }}
            >
              <span className={styles.personalBestLabel}>PB</span>
              <span className={styles.personalBestTime}>{progressData.personalBestTime}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Standards Progress</h2>
      {events.map((event) => {
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
    </div>
  );
}

export default SwimmerStandardsProgress;