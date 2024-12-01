import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@components/elements/Card";
import { Trophy, Target, Zap, Flame, Droplet, Wind, Award, Star, Medal, Crown } from 'lucide-react';
import styles from '../../../../styles/AchievementCard.module.css';
import { Achievement } from '../../../../api/goalFunctions';
import { SwimEvent } from '../../../../lib/types';
import { getSwimEventsForSwimmer } from '../../../../api/swimUtils';

interface AchievementCardProps {
  achievement: Achievement;
  swimmerId?: string;
}

const funnyNames = [
  "Wave Whisperer", "Torpedo Triumph", "Aquaman's Apprentice", "Poseidon's Prodigy", 
  "Splash Master", "Chlorine Conqueror", "Fin-tastic Achiever", "Pool Shark", 
  "H2O Hero", "Swim-credible", "Mermaid in Training", "Sonic Splash", 
  "Aqua Lungs", "Flipper Fury", "Tsunami Tamer"
];

const icons = [
  { icon: Trophy, color: '#FFD700' },
  { icon: Target, color: '#FF4500' },
  { icon: Zap, color: '#09dbf6' },
  { icon: Flame, color: '#FF6347' },
  { icon: Droplet, color: '#74c10f' },
  { icon: Wind, color: '#e27209' },
  { icon: Award, color: '#8a066e' },
  { icon: Star, color: '#FFD700' },
  { icon: Medal, color: '#af0808' },
  { icon: Crown, color: '#FFD700' }
];

const getRandomElement = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, swimmerId }) => {
  const [events, setEvents] = useState<SwimEvent[]>([]);
  const { icon: Icon, color: iconColor } = getRandomElement(icons);
  const funnyName = getRandomElement(funnyNames);

  useEffect(() => {
    const fetchEvents = async () => {
      if (swimmerId) {
        const fetchedEvents = await getSwimEventsForSwimmer(swimmerId);
        setEvents(fetchedEvents);
      }
    };

    fetchEvents();
  }, [swimmerId]);

  const getEventName = (eventId: string | number): string => {
    const event = events.find(e => e.id === eventId);
    return event ? `${event.name} (${event.course})` : eventId.toString();
  };

  const renderTargetInfo = () => {
    if (achievement.goal_type === 'Time Improvement' && achievement.target_time) {
      const eventName = achievement.event ? getEventName(achievement.event) : '';
      return (
        <>
          <p className={styles.eventName}>{eventName}</p>
          <p className={styles.targetInfo}>
            <span className={styles.highlightedTime}>{achievement.target_time}</span>
          </p>
        </>
      );
    } else if (achievement.target_value !== undefined) {
      const dateRange = achievement.start_date && achievement.end_date ?
        `${new Date(achievement.start_date).toLocaleDateString()} - ${new Date(achievement.end_date).toLocaleDateString()}` :
        '';
      const value = achievement.goal_type === 'Attendance Goal' 
        ? `${achievement.target_value} sessions`
        : `${achievement.target_value} ${achievement.unit}`;
      return (
        <div className={styles.targetInfo}>
          <p>{value}</p>
          <p className={styles.dateRange}>{dateRange}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={styles.achievementCard}>
      <CardContent className={styles.cardContent}>
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} style={{ color: iconColor }} />
        </div>
        <h2 className={styles.funnyName}>{funnyName}</h2>
        <h3 className={styles.title}>{achievement.title}</h3>
        {renderTargetInfo()}
        <p className={styles.date}>Achieved on: {new Date(achievement.achieved_date).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;