"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Trophy, Target, Heart, Activity } from 'lucide-react';
import styles from '../../../styles/SwimmerProfile.module.css';
import SwimPageLayout from '../SwimPageLayout';

interface Swimmer {
  id: string;
  name: string;
  age: number;
  email: string;
  photo: string;
  swimGroup: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  achievements: Achievement[];
  goals: Goal[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  time: string;
}

interface Goal {
  id: number;
  name: string;
  progress: number;
}

interface PerformanceData {
  date: string;
  time: number;
}

interface GamifiedSwimmerInterfaceProps {
  swimmerId: string;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.label}>{`Date: ${label}`}</p>
        <p className={styles.data}>{`Time: ${formatTime(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const SwimmerProfilePage: React.FC<GamifiedSwimmerInterfaceProps> = ({ swimmerId }) => {
  const [swimmer, setSwimmer] = React.useState<Swimmer | null>(null);
  const [performanceData, setPerformanceData] = React.useState<PerformanceData[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      // Simulated API call - replace with actual data fetching
      const swimmerData: Swimmer = {
        id: swimmerId,
        name: "Alex Johnson",
        age: 16,
        email: "alex.johnson@example.com",
        photo: "/api/placeholder/100/100",
        swimGroup: "Advanced Juniors",
        level: 7,
        xp: 3500,
        nextLevelXp: 5000,
        achievements: [
          { id: 1, title: "Sonic Splash", description: "50m Freestyle Personal Best", icon: "🏅", time: "00:23:45" },
          { id: 2, title: "Aqua Lungs", description: "2000m Non-Stop Swim", icon: "🏊", time: "00:28:30" },
          { id: 3, title: "Flipper Fury", description: "100m Butterfly Record", icon: "🐬", time: "00:54:20" },
          { id: 4, title: "Tsunami Tamer", description: "Open Water 5K Completion", icon: "🌊", time: "01:05:00" },
          { id: 5, title: "Torpedo Triumph", description: "4x100m Relay Victory", icon: "💨", time: "03:45:15" },
        ],
        goals: [
          { id: 1, name: "Break the Sound Barrier (in water)", progress: 75 },
          { id: 2, name: "Breathe like a fish for 20 sessions", progress: 60 },
          { id: 3, name: "Master the dolphin kick", progress: 40 },
          { id: 4, name: "Qualify for the Aquaman Olympics", progress: 25 },
        ],
      };

      setSwimmer(swimmerData);

      // Simulated performance data
      const performanceMetrics: PerformanceData[] = [
        { date: '2024-01-01', time: 3665 }, // 1:01:05
        { date: '2024-02-01', time: 3600 }, // 1:00:00
        { date: '2024-03-01', time: 3540 }, // 59:00
        { date: '2024-04-01', time: 3480 }, // 58:00
        { date: '2024-05-01', time: 3420 }, // 57:00
      ];

      setPerformanceData(performanceMetrics);
    };

    fetchData();
  }, [swimmerId]);

  if (!swimmer) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <SwimPageLayout>
      <div className={styles.pageWrapper}>
      <div className={styles.container}>
      <div className={styles.heading}>
        <Avatar className={styles.avatar}>
          <AvatarImage src={swimmer.photo} alt={swimmer.name} />
          <AvatarFallback>{swimmer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className={styles.profileInfo}>
          <div className={styles.profileHeader}>
            <h1 className={styles.profileName}>{swimmer.name}</h1>
            <span className={styles.levelBadge}>Level {swimmer.level}</span>
          </div>
          <p className={styles.swimGroup}>{swimmer.swimGroup}</p>
          <div className={styles.profileStats}>
            <div className={styles.xpContainer}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width: `${(swimmer.xp / swimmer.nextLevelXp) * 100}%` }}
                ></div>
              </div>
              <span className={styles.xpInfo}>{swimmer.xp}/{swimmer.nextLevelXp} XP</span>
            </div>
          </div>
        </div>
      </div>

          <div className={styles.tabsWrapper}>
            <Tabs defaultValue="performance">
              <TabsList className={styles.tabsList}>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="performance">
                <Card className={styles.card}>
                  <CardHeader>
                    <h2 className={styles.sectionTitle}>Performance Metrics</h2>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="date" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" tickFormatter={(value) => formatTime(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="time" stroke="#4299e1" strokeWidth={2} dot={{ fill: '#4299e1', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals">
                <Card className={`${styles.card} ${styles.goalCard}`}>
                  <CardHeader>
                    <h2 className={styles.sectionTitle}>Current Goals</h2>
                  </CardHeader>
                  <CardContent>
                    {swimmer.goals.map(goal => (
                      <div key={goal.id} className={styles.goal}>
                        <div className={styles.goalInfo}>
                          <span>{goal.name}</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className={styles.goalProgress} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                  <Card className={styles.card}>
                    <CardHeader>
                      <h2 className={styles.sectionTitle}>Achievements</h2>
                    </CardHeader>
                    <CardContent>
                      <div className={styles.achievementsGrid}>
                        {swimmer.achievements.map(achievement => (
                          <div key={achievement.id} className={styles.achievementCard}>
                            <div className={styles.achievementIcon}>{achievement.icon}</div>
                            <div className={styles.achievementInfo}>
                              <h3 className={styles.achievementTitle}>{achievement.title}</h3>
                              <p className={styles.achievementDescription}>{achievement.description}</p>
                              <p className={styles.achievementTime}>{achievement.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className={styles.statsGrid}>
            <Card className={`${styles.card} ${styles.statCard} ${styles.statCardPerformer}`}>
              <CardContent>
                <Trophy className={styles.statIcon} />
                <span className={styles.statLabel}>Top Performer</span>
              </CardContent>
            </Card>
            <Card className={`${styles.card} ${styles.statCard} ${styles.statCardCrusher}`}>
              <CardContent>
                <Target className={styles.statIcon} />
                <span className={styles.statLabel}>Goal Crusher</span>
              </CardContent>
            </Card>
            <Card className={`${styles.card} ${styles.statCard} ${styles.statCardSpirit}`}>
              <CardContent>
                <Heart className={styles.statIcon} />
                <span className={styles.statLabel}>Team Spirit</span>
              </CardContent>
            </Card>
            <Card className={`${styles.card} ${styles.statCard} ${styles.statCardEffort}`}>
              <CardContent>
                <Activity className={styles.statIcon} />
                <span className={styles.statLabel}>Consistent Effort</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SwimPageLayout>
  );
};

export default SwimmerProfilePage;