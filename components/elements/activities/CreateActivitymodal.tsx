// // app/user/coach/activity/Activities.tsx
// 'use client';
// import React, { useState, useEffect, useCallback } from 'react';
// import { createClient } from '@/utils/supabase/client';
// import { Plus, Calendar, Users, Clock } from 'lucide-react';
// import { SwimGroup, UpcomingActivity } from '@/app/lib/types';
// import { useUser } from '../../../context/UserContext';
// import { Button } from '@/components/elements/Button';
// import Loader from '@/components/elements/Loader';
// import styles from '../../../styles/Activities.module.css';
// import { CreateActivityModal } from '../../../../components/elements/activities/CreateActivitymodal';
// import { DashboardUtils } from '@/app/api/dashboard/dashboardUtils';

// const Activities = () => {
//   const { user } = useUser();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activities, setActivities] = useState<UpcomingActivity[]>([]);
//   const [groups, setGroups] = useState<SwimGroup[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [dashboardUtils, setDashboardUtils] = useState<DashboardUtils | null>(null);
//   const [selectedFilter, setSelectedFilter] = useState('upcoming');

//   useEffect(() => {
//     if (user?.id) {
//       setDashboardUtils(new DashboardUtils(user.id, 'coach'));
//     }
//   }, [user?.id]);

//   const fetchGroups = async () => {
//     if (!user?.id) return;
//     const supabase = createClient();
    
//     const { data, error } = await supabase
//       .from('swim_groups')
//       .select('*')
//       .eq('coach_id', user.id);

//     if (error) {
//       console.error('Error fetching groups:', error);
//       return;
//     }

//     setGroups(data || []);
//   };

//   const fetchActivities = useCallback(async () => {
//     if (!dashboardUtils) return;
//     setLoading(true);

//     try {
//       const response = await dashboardUtils.fetchUpcomingActivities();
//       const activitiesWithTypes = response.data.map((activity: any) => ({
//         ...activity,
//         activity_type: activity.activity_type || 'practice',
//       }));

//       // Filter activities based on selection
//       const now = new Date();
//       const filteredActivities = activitiesWithTypes.filter((activity: UpcomingActivity) => {
//         const activityDate = new Date(activity.start_date);
//         switch (selectedFilter) {
//           case 'upcoming':
//             return activityDate >= now;
//           case 'past':
//             return activityDate < now;
//           default:
//             return true;
//         }
//       });

//       setActivities(filteredActivities);
//     } catch (err) {
//       console.error('Error fetching activities:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [dashboardUtils, selectedFilter]);

//   useEffect(() => {
//     fetchGroups();
//   }, [user]);

//   useEffect(() => {
//     fetchActivities();
//   }, [fetchActivities, selectedFilter]);

//   const handleCreateActivity = async (activityData: Partial<UpcomingActivity>) => {
//     if (!user?.id) return;
    
//     try {
//       const supabase = createClient();
//       const { data, error } = await supabase.rpc('create_activity', {
//         p_activity_data: activityData,
//         p_coach_id: user.id,
//         p_group_ids: activityData.groups?.map(g => g.id)
//       });

//       if (error) throw error;
      
//       fetchActivities();
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error('Error creating activity:', err);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1>Activity Management</h1>
//         <Button onClick={() => setIsModalOpen(true)} className={styles.createButton}>
//           <Plus size={20} />
//           Create Activity
//         </Button>
//       </div>

//       <div className={styles.filterSection}>
//         <div className={styles.filterButtons}>
//           <button
//             className={`${styles.filterButton} ${selectedFilter === 'upcoming' ? styles.active : ''}`}
//             onClick={() => setSelectedFilter('upcoming')}
//           >
//             Upcoming
//           </button>
//           <button
//             className={`${styles.filterButton} ${selectedFilter === 'past' ? styles.active : ''}`}
//             onClick={() => setSelectedFilter('past')}
//           >
//             Past
//           </button>
//           <button
//             className={`${styles.filterButton} ${selectedFilter === 'all' ? styles.active : ''}`}
//             onClick={() => setSelectedFilter('all')}
//           >
//             All
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className={styles.loaderContainer}>
//           <Loader />
//         </div>
//       ) : (
//         <div className={styles.activitiesList}>
//           {activities.length === 0 ? (
//             <div className={styles.emptyState}>
//               <Calendar size={48} />
//               <h3>No Activities Found</h3>
//               <p>Create a new activity to get started</p>
//             </div>
//           ) : (
//             activities.map((activity) => (
//               <div key={activity.id} className={styles.activityCard}>
//                 <div className={styles.activityHeader}>
//                   <div className={styles.activityTitle}>
//                     <h3>{activity.title}</h3>
//                     <span className={styles.activityType}>
//                       {activity.activity_type}
//                     </span>
//                   </div>
//                 </div>

//                 <div className={styles.activityContent}>
//                   <p className={styles.description}>{activity.description}</p>
                  
//                   <div className={styles.details}>
//                     <div className={styles.detailItem}>
//                       <Calendar size={16} />
//                       <span>
//                         {new Date(activity.start_date).toLocaleDateString('en-US', {
//                           weekday: 'long',
//                           month: 'long',
//                           day: 'numeric',
//                         })}
//                       </span>
//                     </div>
//                     <div className={styles.detailItem}>
//                       <Clock size={16} />
//                       <span>
//                         {new Date(activity.start_date).toLocaleTimeString('en-US', {
//                           hour: 'numeric',
//                           minute: '2-digit',
//                         })}
//                       </span>
//                     </div>
//                     <div className={styles.detailItem}>
//                       <Users size={16} />
//                       <span>
//                         {activity.groups?.map(g => g.name).join(', ')}
//                       </span>
//                     </div>
//                   </div>

//                   <div className={styles.responsesSummary}>
//                     {activity.responses?.map((response) => (
//                       <div 
//                         key={response.status}
//                         className={`${styles.responseTag} ${styles[response.status]}`}
//                       >
//                         {response.status}: {response.count}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       <CreateActivityModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleCreateActivity}
//         groups={groups}
//       />
//     </div>
//   );
// };

// export default Activities;