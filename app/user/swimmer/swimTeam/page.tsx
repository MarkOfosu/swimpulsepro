'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getUserDetails, UserData } from '../../../lib/getUserDetails';
import SwimPageLayout from '../SwimPageLayout';
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import Loader from '@components/ui/Loader';
import { Input } from '@/components/ui/Input';
import SwimmerAttendanceInsights from '../SwimmerAttendanceInsights';
import { SupabaseClient } from '@supabase/supabase-js';
import styles from '../../../styles/SwimTeam.module.css';

interface GroupDetails {
  id: string;
  name: string;
  description: string;
  coach_id: string;
  group_code: string;
  coach?: {
    first_name: string;
    last_name: string;
  };
}

const SwimTeamPage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [groupCode, setGroupCode] = useState<string>('');
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'group' | 'attendance'>('group');
  const router = useRouter();
  const supabase: SupabaseClient = createClient();

  useEffect(() => {
    const fetchUserAndGroup = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetails();
        if (!userData) throw new Error('Failed to fetch user details');
        setUser(userData);

        if (userData.swimmer?.group_id) {
          const { data: groupData, error: groupError } = await supabase
            .from('swim_groups')
            .select('id, name, description, coach_id, group_code')
            .eq('id', userData.swimmer.group_id)
            .single();

          if (groupError) throw groupError;

          if (groupData) {
            const { data: coachData, error: coachError } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', groupData.coach_id)
              .single();

            if (coachError) throw coachError;
            setGroupDetails({ ...groupData, coach: coachData });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndGroup();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('swim_groups')
        .select('id, name, description, coach_id, group_code')
        .eq('group_code', groupCode)
        .single();

      if (groupError) {
        if (groupError.code === 'PGRST116') {
          setError('No group found with this code.');
          setGroupDetails(null);
        } else {
          throw groupError;
        }
      } else if (groupData) {
        const { data: coachData, error: coachError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', groupData.coach_id)
          .single();

        if (coachError) throw coachError;
        setGroupDetails({ ...groupData, coach: coachData });
      }
    } catch (error) {
      setError((error as Error).message || 'Failed to fetch group details. Please try again.');
      setGroupDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupDetails || !user || !user.id) {
      setError('Unable to join group. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('swimmers')
        .upsert({ id: user.id, group_id: groupDetails.id })
        .select()
        .single();

      if (updateError) throw updateError;

      setUser({ 
        ...user, 
        swimmer: { 
          ...user.swimmer, 
          group_id: groupDetails.id,
          date_of_birth: user.swimmer?.date_of_birth || ''
        } 
      });
      router.push('/user/swimmer/swimTeam');
    } catch (error) {
      setError(`Failed to join the group: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SwimPageLayout>
        <Loader />
      </SwimPageLayout>
    );
  }

  return (
    <SwimPageLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Swim Team</h1>
        
        {!user?.swimmer?.group_id ? (
          <Card className={styles.card}>
            <CardHeader>
              <h2 className={styles.cardTitle}>Join a Swim Group</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className={styles.form}>
                <Input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  placeholder="Enter group code"
                  required
                  className={styles.input}
                />
                <button type="submit" disabled={loading} className={styles.button}>
                  {loading ? 'Finding...' : 'Find Group'}
                </button>
              </form>

              {error && <p className={styles.error}>{error}</p>}

              {groupDetails && (
                <div className={styles.groupDetails}>
                  <h3 className={styles.groupName}>{groupDetails.name}</h3>
                  <p>{groupDetails.description}</p>
                  <p>Coach: {groupDetails.coach?.first_name} {groupDetails.coach?.last_name}</p>
                  <button onClick={handleJoinGroup} disabled={loading} className={styles.button}>
                    {loading ? 'Joining...' : 'Join this group'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Tabs 
              defaultValue={activeTab} 
              onValueChange={(value: string) => setActiveTab(value as 'group' | 'attendance')}
            >
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="group">Group Info</TabsTrigger>
              <TabsTrigger value="attendance">Your Attendance Record</TabsTrigger>
            </TabsList>
            <TabsContent value="group">
            <Card className={styles.card}>
            <CardHeader>
                <h2 className={styles.cardTitle}>{groupDetails?.name}</h2>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                  <p className={styles.description}>{groupDetails?.description}</p>
                  <p className={styles.coachInfo}>Coach: {groupDetails?.coach?.first_name} {groupDetails?.coach?.last_name}</p>
                  
                  <div className={styles.sections}>
                  <section>
                    <h3 className={styles.sectionTitle}>Announcements</h3>
                    <p className={styles.sectionContent}>No announcements at this time.</p>
                  </section>

                  <section>
                    <h3 className={styles.sectionTitle}>Challenges</h3>
                    <p className={styles.sectionContent}>No active challenges at the moment.</p>
                  </section>

                  <section>
                    <h3 className={styles.sectionTitle}>Group Chat</h3>
                    <p className={styles.sectionContent}>Group chat functionality coming soon!</p>
                  </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attendance">
              {user?.id && <SwimmerAttendanceInsights swimmerId={user.id} />}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </SwimPageLayout>
  );
};

export default SwimTeamPage;