// import { generateSwimWorkout } from '@app/lib/langchainHelper';
// "use server";
// // pages/api/generateWorkout.ts
// import { SwimWorkout } from './../lib/types';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { inputText } = req.body;

//     try {
//       const workout: SwimWorkout = await generateSwimWorkout(inputText);
//       res.status(200).json(workout);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to generate workout.' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }
