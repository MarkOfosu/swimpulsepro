
// // components/UserProfile.tsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import { createClient } from '@/utils/supabase/client';
// import { FaUser } from 'react-icons/fa';
// import styles from '../styles/UserProfile.module.css';

// export const UserProfile = () => {
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const [userImage, setUserImage] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const supabase = createClient();

//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser();

//       if (error) {
//         console.error('Error fetching user:', error);
//         return;
//       }

//       if (user) {
//         setUserEmail(user?.email || null);
//         setUserImage(user.user_metadata?.avatar_url || null); 
//       }
//     };

//     fetchUserData();
//   }, []);
  
//   return (
//     {userEmail}
//     // <div className={styles.userProfile}>
//     //     {userImage ? (
//     //         <Image
//     //         src={userImage}
//     //         alt="User Image"
//     //         width={40}
//     //         height={40}
//     //         className={styles.profileImage}
//     //         />
//     //     ) : (
//     //         <FaUser className={styles.defaultProfileIcon} />
//     //     )}
//     //     {userEmail?.split('@')[0]}
//     // </div>

//   );
// };

// // export default UserProfile;
