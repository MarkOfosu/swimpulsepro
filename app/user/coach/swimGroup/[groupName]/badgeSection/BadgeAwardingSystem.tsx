// BadgeAwardingSystem.tsx
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from '../../../../../styles/BadgeAwardingSystem.module.css';




interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Swimmer {
  id: string;
  name: string;
}

interface SwimmerBadge {
  id: string;
  swimmer_id: string;
  badge_id: string;
  awarded_by: string;
  awarded_at: string;
}

interface BadgeAwardingSystemProps {
  swimGroupId: string;
  coachId: string;
  onBadgeAwarded: (newBadge: SwimmerBadge) => void;
}

const BadgeAwardingSystem: React.FC<BadgeAwardingSystemProps> = ({ swimGroupId, coachId }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const [selectedSwimmer, setSelectedSwimmer] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: badgesData, error: badgesError } = await supabase
        .from('swim_group_badges')
        .select(`
          badges (id, name, description, icon)
        `)
        .eq('swim_group_id', swimGroupId);

      if (badgesError) {
        console.error('Error fetching badges:', badgesError);
        return;
      }

      const { data: swimmersData, error: swimmersError } = await supabase
        .from('swimmers')
        .select('id, name')
        .eq('group_id', swimGroupId);

      if (swimmersError) {
        console.error('Error fetching swimmers:', swimmersError);
        return;
      }

      setBadges(badgesData.flatMap(item => item.badges));
      setSwimmers(swimmersData);
    };

    fetchData();
  }, [swimGroupId, supabase]);

  const handleAwardBadge = async () => {
    if (!selectedBadge || !selectedSwimmer) {
      setMessage({ text: "Please select both a badge and a swimmer.", type: 'error' });
      return;
    }

    const { data, error } = await supabase
      .from('swimmer_badges')
      .insert({
        swimmer_id: selectedSwimmer,
        badge_id: selectedBadge,
        awarded_by: coachId
      });

    if (error) {
      console.error('Error awarding badge:', error);
      setMessage({ text: "Failed to award badge. Please try again.", type: 'error' });
    } else {
      setMessage({ text: "Badge awarded successfully!", type: 'success' });
      setIsOpen(false);
      setSelectedBadge('');
      setSelectedSwimmer('');
    }
  };

  return (
    <div className={styles.badgeAwardingSystem}>
      <button onClick={() => setIsOpen(true)} className={styles.awardBadgeButton}>
        Award Badge
      </button>
      
      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Award Badge to Swimmer</h2>
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
            <button onClick={handleAwardBadge} className={styles.awardButton}>
              Award Badge
            </button>
            <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default BadgeAwardingSystem;