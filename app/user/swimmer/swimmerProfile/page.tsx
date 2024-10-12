"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import styles from '../../../styles/SwimmerProfile.module.css';
import SwimPageLayout from '../SwimPageLayout';
import SwimmerGoalsContainer from '../swimmerGoal/SwimmerGoalContainer';
import { createClient } from '@/utils/supabase/client';
import BadgeAwarded from '../../../../components/ui/BadgeAwarded';

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

interface SwimmerBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  // color: string;
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

const SwimmerProfilePage: React.FC = () => {
  const [swimmer, setSwimmer] = useState<Swimmer | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [swimmerBadges, setSwimmerBadges] = useState<SwimmerBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSwimmerData = async () => {
      setLoading(true);
      setError(null);
    
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("No authenticated user found");
    
        // Fetch swimmer details
        const { data: swimmerData, error: swimmerError } = await supabase
          .from('swimmers')
          .select('*')
          .eq('id', user.id)
          .single();
    
        if (swimmerError) throw swimmerError;
        setSwimmer(swimmerData);
    
        // Fetch swimmer's badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('swimmer_badges')
          .select(`
            id,
            name,
            badges (
              icon,
              description
            )
          `)
          .eq('swimmer_id', user.id);
    
        if (badgesError) throw badgesError;
    
        setSwimmerBadges(badgesData.map((badge: any) => ({
          id: badge.id,
          name: badge.name,
          icon: badge.badges.icon || '🏅', 
          description: badge.badges.description || '',
        })));
        console.log('Swimmer badges:', badgesData);  // Add this line for debugging

        // Fetch performance data (replace with actual query)
        const performanceMetrics: PerformanceData[] = [
          { date: '2024-01-01', time: 3665 },
          { date: '2024-02-01', time: 3600 },
          { date: '2024-03-01', time: 3540 },
          { date: '2024-04-01', time: 3480 },
          { date: '2024-05-01', time: 3420 },
        ];
        setPerformanceData(performanceMetrics);

       

      } catch (err) {
        console.error('Error fetching swimmer data:', err);
        setError('Failed to load swimmer profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSwimmerData();
  }, [supabase]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!swimmer) {
    return <div className={styles.error}>No swimmer data found.</div>;
  }

  return (
    <SwimPageLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <Avatar className={styles.avatar}>
              <AvatarImage src={swimmer.photo} alt={swimmer.name} />
              <AvatarFallback>{swimmer.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
            </Tabs>
          </div>
        </div>
        
        <SwimmerGoalsContainer />

        <div className={styles.badgesSection}>
            <h1 className={styles.sectionTitle}>Earned Badges</h1>
            <div className={styles.badgesContainer}>
              {swimmerBadges.map(badge => (
                <BadgeAwarded
                  key={badge.id}
                  name={badge.name}
                  icon={badge.icon}
                />
              ))}
            </div>
          </div>
      </div>
    </SwimPageLayout>
  );
};

export default SwimmerProfilePage;