// import React, { useState, useEffect } from 'react';
// import { getBadgesForSwimGroup, getSwimmersInGroup, awardBadgeToSwimmer, getBadgeNameById } from '../../../../../../app/api/badgeApi';
// import styles from './AwardBadge.module.css';
// import { createClient } from '@/utils/supabase/server';

// interface AwardBadgeProps {
//     swimGroupId: string;
//     coachId: string;
//   }
  
//   interface Badge {
//     id: string;
//     name: string;
//     description: string;
//     icon: string;
//   }
  
//   interface Swimmer {
//     id: string;
//     name: string;
//   }
  
//   const AwardBadge: React.FC<AwardBadgeProps> = ({ swimGroupId, coachId }) => {
//     const [badges, setBadges] = useState<Badge[]>([]);
//     const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
//     const [selectedBadge, setSelectedBadge] = useState('');
//     const [selectedSwimmer, setSelectedSwimmer] = useState('');
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const supabase = createClient();
  


  
//     useEffect(() => {
//       const fetchData = async () => {
//         setIsLoading(true);
//         setError(null);
//         try {
//           // Fetch badges
//           const { data: badgesData, error: badgesError } = await supabase
//             .from('swim_group_badges')
//             .select(`
//               id,
//               name,
//               badges (id, name, description, icon)
//             `)
//             .eq('swim_group_id', swimGroupId);
  
//           if (badgesError) throw badgesError;
  
//           const flattenedBadges = badgesData.flatMap(item => 
//             item.badges.map(badge => ({
//               id: badge.id,
//               name: item.name || badge.name || `Unknown Badge ${badge.id}`,
//               description: badge.description,
//               icon: badge.icon
//             }))
//           );
  
//           console.log('Fetched and flattened badges:', flattenedBadges);
  
//           // Fetch swimmers
//           const { data: swimmersData, error: swimmersError } = await supabase
//             .from('swimmers')
//             .select('id, name')
//             .eq('group_id', swimGroupId);
  
//           if (swimmersError) throw swimmersError;
  
//           console.log('Fetched swimmers:', swimmersData);
  
//           setBadges(flattenedBadges);
//           setSwimmers(swimmersData);
//         } catch (err) {
//           console.error('Error fetching data:', err);
//           setError('Failed to fetch data. Please try again.');
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       fetchData();
//     }, [swimGroupId]);
  
//     const handleAwardBadge = async () => {
//       if (selectedBadge && selectedSwimmer) {
//         try {
//           const selectedBadgeObj = badges.find(badge => badge.id === selectedBadge);
//           if (!selectedBadgeObj) {
//             throw new Error('Selected badge not found');
//           }
//           const { name } = selectedBadgeObj;
//           if (!name || name.trim() === '') {
//             throw new Error('Badge name is missing or empty');
//           }
  
//           console.log('Selected badge object:', selectedBadgeObj);
//           console.log('Awarding badge with params:', {
//             swimmer_id: selectedSwimmer,
//             badge_id: selectedBadge,
//             name,
//             awarded_by: coachId,
//             group_id: swimGroupId
//           });
  
//           // Fetch the badge details again to double-check
//           const { data: badgeCheck, error: badgeCheckError } = await supabase
//             .from('badges')
//             .select('name')
//             .eq('id', selectedBadge)
//             .single();
  
//           if (badgeCheckError) {
//             console.error('Error checking badge:', badgeCheckError);
//             throw new Error('Failed to verify badge details');
//           }
  
//           console.log('Badge check result:', badgeCheck);
  
//           const finalName = name || badgeCheck?.name || `Unnamed Badge ${selectedBadge}`;
  
//           const { data, error } = await supabase
//             .from('swimmer_badges')
//             .insert([
//               {
//                 swimmer_id: selectedSwimmer,
//                 badge_id: selectedBadge,
//                 name: finalName,
//                 awarded_by: coachId,
//                 group_id: swimGroupId
//               }
//             ])
//             .select();
  
//           if (error) throw error;
  
//           console.log('Badge awarded successfully:', data);
//           alert('Badge awarded successfully!');
//           setSelectedBadge('');
//           setSelectedSwimmer('');
//         } catch (err) {
//           console.error('Error awarding badge:', err);
//           alert(`Failed to award badge: ${err instanceof Error ? err.message : 'Unknown error'}`);
//         }
//       } else {
//         alert('Please select both a badge and a swimmer.');
//       }
//     };
  
//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;
  
//     return (
//       <div className={styles.awardBadgeContainer}>
//         <h2>Award Badge</h2>
//         <select
//           value={selectedBadge}
//           onChange={(e) => setSelectedBadge(e.target.value)}
//           className={styles.select}
//         >
//           <option value="">Select a badge</option>
//           {badges.map((badge) => (
//             <option key={badge.id} value={badge.id}>{badge.name || `Unnamed Badge ${badge.id}`}</option>
//           ))}
//         </select>
//         <select
//           value={selectedSwimmer}
//           onChange={(e) => setSelectedSwimmer(e.target.value)}
//           className={styles.select}
//         >
//           <option value="">Select a swimmer</option>
//           {swimmers.map((swimmer) => (
//             <option key={swimmer.id} value={swimmer.id}>{swimmer.name}</option>
//           ))}
//         </select>
//         <button onClick={handleAwardBadge} className={styles.awardButton}>Award Badge</button>
//       </div>
//     );
//   };
  
//   export default AwardBadge;
  
  