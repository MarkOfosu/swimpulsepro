'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Plus, Calendar, Users, Clock, Pencil, Trash2 } from 'lucide-react';
import { ActivityFormData, ActivityType, SwimGroup, UpcomingActivity } from '@/app/lib/types';
import { useUser } from '../../../context/UserContext';
import { Button } from '@/components/elements/Button';
import Loader from '@/components/elements/Loader';
import styles from '../../../styles/Activities.module.css';
import { CreateActivityModal } from './CreateActivityModal';
import { DashboardUtils } from '@/app/api/dashboard/dashboardUtils';
import { toast } from 'react-hot-toast';

const Activities = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<UpcomingActivity[]>([]);
  const [groups, setGroups] = useState<SwimGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('upcoming');
  const [activityToEdit, setActivityToEdit] = useState<UpcomingActivity | null>(null);

  useEffect(() => {
    if (user?.id) {
      setDashboardUtils(new DashboardUtils(user.id, 'coach'));
    }
  }, [user?.id]);

  // Fetch coach's groups
  const fetchGroups = async () => {
    if (!user?.id) return;
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('swim_groups')
        .select('id, name, description')
        .eq('coach_id', user.id);

      if (error) throw error;
      setGroups(data || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      toast.error('Failed to load groups');
    }
  };

  // Fetch activities with proper null handling

  const fetchActivities = useCallback(async () => {
    if (!dashboardUtils) return;
    setLoading(true);
  
    try {
      const response = await dashboardUtils.fetchUpcomingActivities();
      const activitiesWithTypes = response.data.map((activity: any) => {
        // Keep the original additional_details
        const additional_details = {
          equipment_needed: activity.additional_details?.equipment_needed || '',
          preparation_notes: activity.additional_details?.preparation_notes || '',
          capacity_limit: activity.additional_details?.capacity_limit || '',
          skill_level: activity.additional_details?.skill_level || 'all',
          virtual_link: activity.additional_details?.virtual_link || '',
          minimum_standard: activity.additional_details?.minimum_standard || '',
          recommended_standard: activity.additional_details?.recommended_standard || ''
        };
  
        return {
          ...activity,
          activity_type: activity.activity_type || 'practice',
          additional_details,
          // Groups are already properly structured from the join
          groups: activity.groups || [],
          responses: activity.responses || []
        };
      });
  
      // Filter activities based on selection
      const now = new Date();
      const filteredActivities = activitiesWithTypes.filter((activity: UpcomingActivity) => {
        const activityDate = new Date(activity.start_date);
        switch (selectedFilter) {
          case 'upcoming':
            return activityDate >= now;
          case 'past':
            return activityDate < now;
          default:
            return true;
        }
      });
  
      setActivities(filteredActivities);
    } catch (err) {
      console.error('Error fetching activities:', err);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [dashboardUtils, selectedFilter]);
  
  // Add a debug effect to monitor the activity data
  useEffect(() => {
    console.log('Current activities:', activities);
  }, [activities]);

  // Format activity data for database
  const formatActivityData = (data: ActivityFormData): any => {
    return {
      title: data.title,
      description: data.description,
      activity_type: data.activity_type,
      start_date: new Date(data.start_date).toISOString(),
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      location: data.location,
      additional_details: {
        equipment_needed: data.additional_details.equipment_needed || null,
        preparation_notes: data.additional_details.preparation_notes || null,
        capacity_limit: data.additional_details.capacity_limit || null,
        skill_level: data.additional_details.skill_level || 'all',
        virtual_link: data.additional_details.virtual_link || null,
        minimum_standard: data.additional_details.minimum_standard || null,
        recommended_standard: data.additional_details.recommended_standard || null
      }
    };
  };

  // Convert database data to form format
  const convertToFormData = (activity: UpcomingActivity | null): ActivityFormData | undefined => {
    if (!activity) return undefined;

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return !isNaN(date.getTime()) ? date.toISOString().slice(0, 16) : '';
    };

    // Ensure additional details have proper default values
    const {
      equipment_needed = '',
      preparation_notes = '',
      capacity_limit = '',
      skill_level = 'all',
      virtual_link = '',
      minimum_standard = '',
      recommended_standard = ''
    } = activity.additional_details || {};

    return {
      title: activity.title,
      description: activity.description || '',
      activity_type: activity.activity_type,
      start_date: formatDate(activity.start_date),
      end_date: activity.end_date ? formatDate(activity.end_date) : null,
      location: activity.location,
      groups: activity.groups || [],
      additional_details: {
        equipment_needed: equipment_needed || '',
        preparation_notes: preparation_notes || '',
        capacity_limit: capacity_limit?.toString() || '',
        skill_level,
        virtual_link: virtual_link || '',
        minimum_standard: minimum_standard || '',
        recommended_standard : recommended_standard || ''
      }
    };
  };

  const handleCreateActivity = async (activityData: ActivityFormData) => {
    if (!user?.id) return;
    
    try {
      const formattedData = formatActivityData(activityData);
      const supabase = createClient();
      
      const { error } = await supabase.rpc('create_activity', {
        p_activity_data: formattedData,
        p_coach_id: user.id,
        p_group_ids: activityData.groups.map(g => g.id)
      });

      if (error) throw error;
      
      await fetchActivities();
      setIsModalOpen(false);
      toast.success('Activity created successfully');
    } catch (err) {
      console.error('Error creating activity:', err);
      toast.error('Failed to create activity');
    }
  };

  const handleEditActivity = async (activityData: ActivityFormData) => {
    if (!user?.id || !activityToEdit?.id) return;
    
    try {
      // Format the activity data
      const formattedData = {
        title: activityData.title,
        description: activityData.description,
        activity_type: activityData.activity_type,
        start_date: new Date(activityData.start_date).toISOString(),
        end_date: activityData.end_date ? new Date(activityData.end_date).toISOString() : null,
        location: activityData.location,
        additional_details: {
          equipment_needed: activityData.additional_details.equipment_needed || null,
          preparation_notes: activityData.additional_details.preparation_notes || null,
          capacity_limit: activityData.additional_details.capacity_limit || null,
          skill_level: activityData.additional_details.skill_level,
          virtual_link: activityData.additional_details.virtual_link || null,
          minimum_standard: activityData.additional_details.minimum_standard || null,
          recommended_standard: activityData.additional_details.recommended_standard || null
        }
      };
  
      const supabase = createClient();
      
      // Call the update_activity function with the correct parameter order
      const { error } = await supabase.rpc('update_activity', {
        p_activity_id: activityToEdit.id,
        p_coach_id: user.id,
        p_activity_data: formattedData,
        p_group_ids: activityData.groups.map(g => g.id)
      });
  
      if (error) throw error;
      
      await fetchActivities();
      setIsModalOpen(false);
      setActivityToEdit(null);
      toast.success('Activity updated successfully');
    } catch (err) {
      console.error('Error updating activity:', err);
      toast.error('Failed to update activity');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!user?.id) return;
    
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        const supabase = createClient();
        const { error } = await supabase.rpc('delete_activity', {
          p_activity_id: activityId,
          p_coach_id: user.id
        });

        if (error) throw error;
        
        await fetchActivities();
        toast.success('Activity deleted successfully');
      } catch (err) {
        console.error('Error deleting activity:', err);
        toast.error('Failed to delete activity');
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, selectedFilter]);

  // Groups display component with proper error handling
  const GroupsList: React.FC<{ groups: SwimGroup[] }> = ({ groups }) => {
    if (!Array.isArray(groups) || groups.length === 0) {
      return <span className={styles.noGroups}>No groups assigned</span>;
    }
  
    return (
      <span>
        {groups.map(group => group.name).join(', ')}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Activity Management</h1>
        <Button 
          onClick={() => {
            setActivityToEdit(null);
            setIsModalOpen(true);
          }} 
          className={styles.createButton}
        >
          <Plus size={20} />
          Create Activity
        </Button>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${selectedFilter === 'upcoming' ? styles.active : ''}`}
            onClick={() => setSelectedFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`${styles.filterButton} ${selectedFilter === 'past' ? styles.active : ''}`}
            onClick={() => setSelectedFilter('past')}
          >
            Past
          </button>
          <button
            className={`${styles.filterButton} ${selectedFilter === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <div className={styles.activitiesList}>
          {activities.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar size={48} />
              <h3>No Activities Found</h3>
              <p>Create a new activity to get started</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className={styles.activityCard}>
                <div className={styles.activityHeader}>
                  <div className={styles.activityTitle}>
                    <h3>{activity.title}</h3>
                    <span className={styles.activityType}>
                      {activity.activity_type}
                    </span>
                  </div>
                  <div className={styles.activityActions}>
                    <button
                      onClick={() => {
                        setActivityToEdit(activity);
                        setIsModalOpen(true);
                      }}
                      className={styles.editButton}
                      title="Edit Activity"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className={styles.deleteButton}
                      title="Delete Activity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.activityContent}>
                  <p className={styles.description}>{activity.description}</p>
                  
                  <div className={styles.details}>
                    <div className={styles.detailItem}>
                      <Calendar size={16} />
                      <span>
                        {new Date(activity.start_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <Clock size={16} />
                      <span>
                        {new Date(activity.start_date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <Users size={16} />
                      <GroupsList groups={activity.groups || []} />
                    </div>
                  </div>

                  <div className={styles.responsesSummary}>
                    {activity.responses?.map((response) => (
                      <div 
                        key={response.status}
                        className={`${styles.responseTag} ${styles[response.status]}`}
                      >
                        {response.status}: {response.count}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <CreateActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActivityToEdit(null);
        }}
        onSubmit={activityToEdit ? handleEditActivity : handleCreateActivity}
        groups={groups}
        initialData={convertToFormData(activityToEdit)}
      />
    </div>
  );
};

export default Activities;