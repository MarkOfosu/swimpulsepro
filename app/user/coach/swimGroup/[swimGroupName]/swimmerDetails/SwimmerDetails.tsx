'use client';

import React, { useState, useEffect } from 'react';
import  Loader  from '@/components/elements/Loader';
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
  const [expandedStandard, setExpandedStandard] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    const fetchSwimmerDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/coach/swimmers/${swimmerId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch swimmer details');
        }

        setSwimmer(data.swimmer);
        setStandards(data.standards);
      } catch (error) {
        console.error('Error fetching swimmer details:', error);
        setError('Failed to load swimmer details');
      } finally {
        setLoading(false);
      }
    };

    if (swimmerId) {
      fetchSwimmerDetails();
    }
  }, [swimmerId]);

  const getStandardClass = (standard: string) => {
    const standardMap: { [key: string]: string } = {
      'B': styles.standardB,
      'BB': styles.standardBB,
      'A': styles.standardA,
      'AA': styles.standardAA,
      'AAA': styles.standardAAA,
      'AAAA': styles.standardAAAA
    };
    return standardMap[standard] || '';
  };

  const toggleStandardExpansion = (index: number) => {
    setExpandedStandard(expandedStandard === index ? null : index);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <span className={styles.loadingIcon}>🏊‍♂️</span>
          Loading swimmer details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
          <button onClick={() => window.location.reload()} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!swimmer) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>🔍</span>
          Swimmer not found
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.swimmerName}>
          {swimmer.first_name} {swimmer.last_name}
        </h2>
        <div className={styles.swimmerInfo}>
          <span className={styles.infoItem}>
            <span className={styles.infoLabel}>Age Group:</span>
            {swimmer.age_group}
          </span>
          <span className={styles.infoItem}>
            <span className={styles.infoLabel}>Gender:</span>
            {swimmer.gender}
          </span>
        </div>
      </div>

      <div className={styles.standardsSection}>
        <h3 className={styles.sectionTitle}>Swimming Standards</h3>
        
        {isMobileView ? (
          // Mobile Card View
          <div className={styles.standardsCards}>
            {standards.map((standard, index) => (
              <div 
                key={index}
                className={`${styles.standardCard} ${expandedStandard === index ? styles.expanded : ''}`}
                onClick={() => toggleStandardExpansion(index)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.mainInfo}>
                    <span className={styles.event}>{standard.event}</span>
                    <span className={styles.course}>{standard.course}</span>
                  </div>
                  <div className={styles.timeInfo}>
                    <span className={styles.bestTime}>{standard.best_time}</span>
                    <span className={`${styles.achievedStandard} ${getStandardClass(standard.achieved_standard)}`}>
                      {standard.achieved_standard}
                    </span>
                  </div>
                </div>
                
                {expandedStandard === index && (
                  <div className={styles.cardDetails}>
                    <div className={styles.standardRow}>
                      <span className={styles.standardLabel}>B:</span>
                      <span className={styles.standardTime}>{standard.b_standard}</span>
                    </div>
                    <div className={styles.standardRow}>
                      <span className={styles.standardLabel}>BB:</span>
                      <span className={styles.standardTime}>{standard.bb_standard}</span>
                    </div>
                    <div className={styles.standardRow}>
                      <span className={styles.standardLabel}>A:</span>
                      <span className={styles.standardTime}>{standard.a_standard}</span>
                    </div>
                    <div className={styles.standardRow}>
                      <span className={styles.standardLabel}>AA:</span>
                      <span className={styles.standardTime}>{standard.aa_standard}</span>
                    </div>
                    <div className={styles.standardRow}>
                      <span className={styles.standardLabel}>AAA:</span>
                      <span className={styles.standardTime}>{standard.aaa_standard}</span>
                    </div>
                    <div className={styles.standardRow}>
                      <span className={styles.standardLabel}>AAAA:</span>
                      <span className={styles.standardTime}>{standard.aaaa_standard}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Desktop Table View
          <div className={styles.standardsTableWrapper}>
            <table className={styles.standardsTable}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Course</th>
                  <th>Best Time</th>
                  <th>Current</th>
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
                    <td className={styles.eventCell}>{standard.event}</td>
                    <td>{standard.course}</td>
                    <td className={styles.bestTimeCell}>{standard.best_time}</td>
                    <td>
                      <span className={`${styles.achievedStandard} ${getStandardClass(standard.achieved_standard)}`}>
                        {standard.achieved_standard}
                      </span>
                    </td>
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
        )}
      </div>
    </div>
  );
};

export default SwimmerDetails;