// New components for celebrations and feedback
import { Button } from '@components/elements/Button';
import { useState } from 'react';
import styles from '../../../../styles/Goals.module.css';


 interface Achievement {
    id: string;
    title: string;
    description: string;
    achieved_date: string;
    event?: string;
    goal_type?: string;
    icon: string;
    time?: string;
    target_value?: number;
    target_time?: string;
    start_date?: string;
    end_date?: string;
    unit: string;
  }
  
interface CelebrationProps {
    isOpen: boolean;
    onClose: () => void;
    achievement: Achievement;
  }
  
  export const CELEBRATION_MESSAGES = [
    "🎉 You're crushing it!",
    "⭐ Amazing job!",
    "💪 Keep up the awesome work!",
    "🏊‍♂️ You're making waves!",
    "🌟 You're a swimming star!",
    "🚀 Way to go!",
    "🎯 Right on target!",
    "🏆 You're a champion!",
  ];
  
  export const MOTIVATIONAL_MESSAGES = [
    "Keep pushing! You're getting stronger! 💪",
    "Amazing progress! You're on fire! 🔥",
    "Look at you go! Unstoppable! 🚀",
    "You're getting faster every day! ⚡",
    "One step closer to your goal! 🎯",
    "You're making it happen! 🌟",
  ];
  
 export const Celebration: React.FC<CelebrationProps> = ({ isOpen, onClose, achievement }) => {
    const [confetti, setConfetti] = useState<Array<{ color: string; left: string; delay: string }>>([]);
  
    useEffect(() => {
      if (isOpen) {
        // Create confetti pieces
        const colors = ['#ff595e', '#ff924c', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
        const pieces = Array.from({ length: 50 }, () => ({
          color: colors[Math.floor(Math.random() * colors.length)],
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 3}s`
        }));
        setConfetti(pieces);
  
        // Auto close after 5 seconds
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
      }
    }, [isOpen, onClose]);
  
    if (!isOpen) return null;
  
    return (
      <div className={styles.celebration} onClick={onClose}>
        {confetti.map((piece: { color: string; left: string; delay: string }, i) => (
          <div
            key={i}
            className={styles.confetti}
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay
            }}
          />
        ))}
        <div className={styles.celebrationContent} onClick={e => e.stopPropagation()}>
          <div className={styles.trophy}>🏆</div>
          <h3 className={styles.celebrationTitle}>New Achievement Unlocked!</h3>
          <p className={styles.celebrationMessage}>
            {achievement.title}
          </p>
          <p className={styles.motivationalMessage}>
            {CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]}
          </p>
          <Button onClick={onClose} className="mt-4">Continue Swimming!</Button>
        </div>
      </div>
    );
  };
  
  const ProgressUpdate: React.FC<{ message: string }> = ({ message }) => (
    <div className={styles.progressUpdate}>
      <span className={styles.progressIcon}>🎯</span>
      <span className={styles.motivationalMessage}>
        {message}
      </span>
    </div>
  );

function useEffect(arg0: () => (() => void) | undefined, arg1: (boolean | (() => void))[]) {
    throw new Error('Function not implemented.');
}
