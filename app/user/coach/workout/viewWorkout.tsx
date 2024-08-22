// import React, { useState, useEffect } from 'react';
// import { supabase } from '../utils/supabaseClient';

// const ViewWorkouts = () => {
//   const [workouts, setWorkouts] = useState([]);

//   useEffect(() => {
//     const fetchWorkouts = async () => {
//       const { data, error } = await supabase
//         .from('Workouts')
//         .select('id, workout_data, created_at')
//         .eq('coach_id', supabase.auth.user().id);

//       if (error) {
//         console.error(error);
//       } else {
//         setWorkouts(data);
//       }
//     };

//     fetchWorkouts();
//   }, []);

//   return (
//     <div>
//       <h1>Past Workouts</h1>
//       <ul>
//         {workouts.map((workout) => (
//           <li key={workout.id}>
//             <div>
//               <p><strong>Date:</strong> {new Date(workout.created_at).toLocaleDateString()}</p>
//               <p><strong>Focus:</strong> {workout.workout_data.focus}</p>
//               <p><strong>Description:</strong> {workout.workout_data.description}</p>
//             </div>
//             {/* Add options to edit or reuse the workout */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ViewWorkouts;
