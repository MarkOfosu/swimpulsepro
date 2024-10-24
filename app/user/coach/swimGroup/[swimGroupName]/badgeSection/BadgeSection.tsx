// // BadgeSection.tsx
// import React, { useMemo } from 'react';
// import { Trophy, Target, Heart, Activity } from 'lucide-react';
// import styles from '../../../../../styles/BadgeSection.module.css';

// interface Badge {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
// }

// interface SwimmerBadge {
//   id: string;
//   swimmer_id: string;
//   badge_id: string;
//   awarded_at: string;
// }

// interface Swimmer {
//   id: string;
//   name: string;
// }

// interface BadgeProps {
//   icon: React.ElementType;
//   label: string;
//   value: string | number;
//   colorClass: string;
// }

// const Badge: React.FC<BadgeProps> = ({ icon: Icon, label, value, colorClass }) => (
//   <div className={`${styles.badge} ${styles[colorClass]}`}>
//     <Icon className={styles.icon} />
//     <span className={styles.label}>{label}</span>
//     <span className={styles.value}>{value}</span>
//   </div>
// );

// interface BadgeSectionProps {
//   badges: Badge[];
//   swimmerBadges: SwimmerBadge[];
//   swimmers: Swimmer[];
// }

// const BadgeSection: React.FC<BadgeSectionProps> = ({ badges, swimmerBadges, swimmers }) => {
//   const stats = useMemo(() => {
//     const topPerformer = swimmers.reduce((top, swimmer) => {
//       const badgeCount = swimmerBadges.filter(sb => sb.swimmer_id === swimmer.id).length;
//       return badgeCount > (top.badgeCount || 0) ? { name: swimmer.name, badgeCount } : top;
//     }, { name: '', badgeCount: 0 });

//     const totalPossibleBadges = badges.length * swimmers.length;
//     const goalAchievement = totalPossibleBadges > 0
//       ? (swimmerBadges.length / totalPossibleBadges) * 100
//       : 0;

//     const teamSpirit = Math.min(10, Math.round(swimmerBadges.length / swimmers.length));

//     const now = new Date();
//     const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
//     const recentBadges = swimmerBadges.filter(sb => new Date(sb.awarded_at) >= oneMonthAgo);
//     const consistency = swimmers.length > 0
//       ? (recentBadges.length / swimmers.length) * 100
//       : 0;

//     return {
//       topPerformer: topPerformer.name || 'N/A',
//       goalAchievement: Math.round(goalAchievement),
//       teamSpirit,
//       consistency: Math.round(consistency),
//     };
//   }, [badges, swimmerBadges, swimmers]);

//   return (
//     <div className={styles.badgeSection}>
//       <Badge icon={Trophy} label="Top Performer" value={stats.topPerformer} colorClass="yellow" />
//       <Badge icon={Target} label="Goal Achievement" value={`${stats.goalAchievement}%`} colorClass="green" />
//       <Badge icon={Heart} label="Team Spirit" value={stats.teamSpirit} colorClass="red" />
//       <Badge icon={Activity} label="Consistency" value={`${stats.consistency}%`} colorClass="blue" />
//     </div>
//   );
// };

// export default BadgeSection;