import React from 'react';
import styles from '../styles/AchievementCard.module.css';
import { Card, CardContent } from './Card';

interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ icon, title, description }) => {
  return (
    <Card className={styles.achievementCard}>
      <CardContent>
        <div className={styles.achievementIcon}>{icon}</div>
        <h3 className={styles.achievementTitle}>{title}</h3>
        <p className={styles.achievementDescription}>{description}</p>
      </CardContent>
    </Card>
  );
};