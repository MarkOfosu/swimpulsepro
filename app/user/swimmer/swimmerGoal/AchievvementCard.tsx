import React from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Trophy, Target, Zap, Flame, Droplet, Wind, Award, Star, Medal, Crown } from 'lucide-react';
import styles from '../../../styles/AchievementCard.module.css';
import { Achievement } from '../functions/goalFunctions';

interface AchievementCardProps {
  achievement: Achievement;
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

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { icon: Icon, color: iconColor } = getRandomElement(icons);
  const funnyName = getRandomElement(funnyNames);

  return (
    <Card className={styles.achievementCard}>
      <CardContent className={styles.cardContent}>
        <div className={styles.iconWrapper}>
          <Icon className={styles.icon} style={{ color: iconColor }} />
        </div>
        <h2 className={styles.funnyName}>{funnyName}</h2>
        <h3 className={styles.title}>{achievement.title}</h3>
        <p className={styles.description}>{achievement.description}</p>
        <p className={styles.date}>Achieved on: {new Date(achievement.achieved_date).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;