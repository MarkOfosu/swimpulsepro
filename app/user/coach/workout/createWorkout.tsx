// import { useState, useEffect } from 'react';
// import { supabase } from '../utils/supabaseClient';

// const CreateWorkout = () => {
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState('');
//   const [inputText, setInputText] = useState('');
//   const [workoutData, setWorkoutData] = useState(null);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       const { data, error } = await supabase
//         .from('SwimGroups')
//         .select('*')
//         .eq('coach_id', supabase.auth.user().id);

//       if (error) {
//         console.error(error);
//       } else {
//         setGroups(data);
//       }
//     };

//     fetchGroups();
//   }, []);

//   const handleGenerateAIWorkout = async () => {
//     try {
//       const response = await fetch('/api/generateWorkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ inputText }),
//       });
//       const data = await response.json();
//       setWorkoutData(data);
//     } catch (error) {
//       console.error('Failed to generate workout:', error);
//     }
//   };

//   const handleSaveWorkout = async () => {
//     if (workoutData) {
//       const { data, error } = await supabase
//         .from('Workouts')
//         .insert([
//           {
//             coach_id: supabase.auth.user().id,
//             group_id: selectedGroup,
//             workout_data: workoutData,
//           },
//         ]);

//       if (error) {
//         console.error(error);
//       } else {
//         // Update the training data in Supabase
//         const trainingData = generateTrainingDataFormat(inputText, workoutData);

//         await supabase
//           .from('AITrainingData')
//           .insert([{ training_data: trainingData }]);
//       }
//     }
//   };

//   const generateTrainingDataFormat = (userInput, workoutData) => {
//     return `Example_user: ${userInput}\n\nExample_system: ${JSON.stringify(workoutData, null, 2)}\n`;
//   };

//   return (
//     <div>
//       <h1>Create New Workout</h1>
//       <div>
//         <label>Select Swim Group:</label>
//         <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
//           {groups.map((group) => (
//             <option key={group.id} value={group.id}>
//               {group.group_name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label>Workout Request:</label>
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//         />
//       </div>
//       <button onClick={handleGenerateAIWorkout}>Generate AI Workout</button>
//       {workoutData && (
//         <div>
//           <h2>Generated Workout</h2>
//           <pre>{JSON.stringify(workoutData, null, 2)}</pre>
//         </div>
//       )}
//       <button onClick={handleSaveWorkout}>Save Workout</button>
//     </div>
//   );
// };

// export default CreateWorkout;
