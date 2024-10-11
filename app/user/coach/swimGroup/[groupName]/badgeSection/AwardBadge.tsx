// AwardBadge.tsx
import React, { useState, useEffect } from 'react';
import { getBadgesForSwimGroup, getSwimmersInGroup, awardBadgeToSwimmer } from '../../../../../../app/api/badgeApi';
import styles from './AwardBadge.module.css';

interface AwardBadgeProps {
  swimGroupId: string;
  coachId: string;
}

const AwardBadge: React.FC<AwardBadgeProps> = ({ swimGroupId, coachId }) => {
  interface Badge {
    id: any;
    name: any;
    description: any;
    icon: any;
  }

  const [badges, setBadges] = useState<Badge[]>([]);
  interface Swimmer {
    id: any;
    name: any;
  }
  
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [selectedSwimmer, setSelectedSwimmer] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const badgesData: Badge[] = (await getBadgesForSwimGroup(swimGroupId)).flatMap(group => group.badges);
      setBadges(badgesData);
      const swimmersData = await getSwimmersInGroup(swimGroupId);
      setSwimmers(swimmersData);
    };
    fetchData();
  }, [swimGroupId]);

  const handleAwardBadge = async () => {
    if (selectedBadge && selectedSwimmer) {
      try {
        await awardBadgeToSwimmer(selectedSwimmer, selectedBadge, coachId);
        alert('Badge awarded successfully!');
        setSelectedBadge('');
        setSelectedSwimmer('');
      } catch (error) {
        console.error('Error awarding badge:', error);
        alert('Failed to award badge. Please try again.');
      }
    }
  };

  return (
    <div className={styles.awardBadgeContainer}>
      <h2>Award Badge</h2>
      <select
        value={selectedBadge}
        onChange={(e) => setSelectedBadge(e.target.value)}
        className={styles.select}
      >
        <option value="">Select a badge</option>
        {badges.map((badge) => (
          <option key={badge.id} value={badge.id}>{badge.name}</option>
        ))}
      </select>
      <select
        value={selectedSwimmer}
        onChange={(e) => setSelectedSwimmer(e.target.value)}
        className={styles.select}
      >
        <option value="">Select a swimmer</option>
        {swimmers.map((swimmer) => (
          <option key={swimmer.id} value={swimmer.id}>{swimmer.name}</option>
        ))}
      </select>
      <button onClick={handleAwardBadge} className={styles.awardButton}>Award Badge</button>
    </div>
  );
};

export default AwardBadge;