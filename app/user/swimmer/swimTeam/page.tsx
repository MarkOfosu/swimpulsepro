'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getUserDetails } from '../../../lib/getUserDetails';
import SwimPageLayout from '../SwimPageLayout';
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Loader from '@components/ui/Loader';
import styles from '../../../styles/SwimTeam.module.css';

const SwimTeamPage = () => {
  const [user, setUser] = useState<any>(null);
  const [groupCode, setGroupCode] = useState('');
  const [groupDetails, setGroupDetails] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndGroup = async () => {
      try {
        setLoading(true);
        const userData = await getUserDetails();

        if (!userData) {
          throw new Error('Failed to fetch user details');
        }

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

            setGroupDetails({
              ...groupData,
              coach: coachData
            });
          }
        } else {
 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Submitting group code:', groupCode);

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('swim_groups')
        .select('id, name, description, coach_id, group_code')
        .eq('group_code', groupCode)
        .single();

      console.log('Swim group query result:', JSON.stringify(groupData, null, 2));
      console.log('Swim group query error:', groupError);

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

        setGroupDetails({
          ...groupData,
          coach: coachData
        });
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch group details. Please try again.');
      setGroupDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!groupDetails) {
      setError('No group details available. Please try searching for a group again.');
      return;
    }
  
    if (!user) {
      setError('No user data available. Please try logging in again.');
      return;
    }

  
    if (!user.id) {
      setError('User ID is missing. Please try logging in again.');
      return;
    }
  
    setLoading(true);
  
  
    try {
      const { data: updatedSwimmer, error: updateError } = await supabase
        .from('swimmers')
        .upsert({ id: user.id, group_id: groupDetails.id })
        .select()
        .single();

      if (updateError) throw updateError;

      setUser({
        ...user,
        swimmer: { id: user.id, group_id: groupDetails.id }
      });

      router.push('/user/swimmer/swimTeam');
    } catch (error: any) {
      setError(`Failed to join the group: ${error.message}`);
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
          <Card>
            <CardHeader>Join a Swim Group</CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  placeholder="Enter group code"
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Finding...' : 'Find Group'}
                </button>
              </form>

              {error && <p className={styles.error}>{error}</p>}

              {groupDetails && (
                <div className={styles.groupDetails}>
                  <h2>{groupDetails.name}</h2>
                  <p>{groupDetails.description}</p>
                  <p>Coach: {groupDetails.coach?.first_name} {groupDetails.coach?.last_name}</p>
                  <button onClick={handleJoinGroup} disabled={loading}>
                    {loading ? 'Joining...' : 'Join this group'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={styles.groupInfo}>
            <h2>{groupDetails?.name}</h2>
            <p>{groupDetails?.description}</p>
            <p>Coach: {groupDetails?.coach?.first_name} {groupDetails?.coach?.last_name}</p>
            
            <section className={styles.announcements}>
              <h3>Announcements</h3>
              {/* Add announcements content */}
            </section>

            <section className={styles.challenges}>
              <h3>Challenges</h3>
              {/* Add challenges content */}
            </section>

            <section className={styles.groupChat}>
              <h3>Group Chat</h3>
              {/* Add group chat component */}
            </section>
          </div>
        )}
      </div>
    </SwimPageLayout>
  );
};

export default SwimTeamPage;