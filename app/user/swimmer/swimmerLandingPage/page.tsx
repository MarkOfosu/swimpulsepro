// // File: app/components/GamifiedSwimmerInterface.tsx

// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Trophy, Target, Heart, Activity } from 'lucide-react';

// interface Swimmer {
//   id: string;
//   name: string;
//   age: number;
//   email: string;
//   photo: string;
//   swimGroup: string;
//   level: number;
//   xp: number;
//   nextLevelXp: number;
//   achievements: Achievement[];
//   goals: Goal[];
// }

// interface Achievement {
//   id: number;
//   name: string;
//   icon: string;
// }

// interface Goal {
//   id: number;
//   name: string;
//   progress: number;
// }

// interface PerformanceData {
//   date: string;
//   time: number;
// }

// interface GamifiedSwimmerInterfaceProps {
//   swimmerId: string;
// }

// const GamifiedSwimmerInterface: React.FC<GamifiedSwimmerInterfaceProps> = ({ swimmerId }) => {
//   const [swimmer, setSwimmer] = React.useState<Swimmer | null>(null);
//   const [performanceData, setPerformanceData] = React.useState<PerformanceData[]>([]);

//   React.useEffect(() => {
//     const fetchData = async () => {
//       // Simulated API call - replace with actual data fetching
//       const swimmerData: Swimmer = {
//         id: swimmerId,
//         name: "Alex Johnson",
//         age: 16,
//         email: "alex.johnson@example.com",
//         photo: "/api/placeholder/100/100",
//         swimGroup: "Advanced Juniors",
//         level: 7,
//         xp: 3500,
//         nextLevelXp: 5000,
//         achievements: [
//           { id: 1, name: "50m Freestyle Personal Best", icon: "🏅" },
//           { id: 2, name: "100 Training Sessions Completed", icon: "🏊" },
//           { id: 3, name: "Team Spirit Award", icon: "🏆" },
//         ],
//         goals: [
//           { id: 1, name: "Improve 100m Butterfly time", progress: 75 },
//           { id: 2, name: "Attend 20 training sessions this month", progress: 60 },
//           { id: 3, name: "Master the flip turn", progress: 40 },
//         ],
//       };

//       setSwimmer(swimmerData);

//       // Simulated performance data
//       const performanceMetrics: PerformanceData[] = [
//         { date: '2024-01-01', time: 62 },
//         { date: '2024-02-01', time: 60 },
//         { date: '2024-03-01', time: 59 },
//         { date: '2024-04-01', time: 58 },
//         { date: '2024-05-01', time: 57 },
//       ];

//       setPerformanceData(performanceMetrics);
//     };

//     fetchData();
//   }, [swimmerId]);

//   if (!swimmer) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <div className="flex items-center mb-6">
//         <Avatar className="h-24 w-24 mr-4">
//           <AvatarImage src={swimmer.photo} alt={swimmer.name} />
//           <AvatarFallback>{swimmer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
//         </Avatar>
//         <div>
//           <h1 className="text-2xl font-bold">{swimmer.name}</h1>
//           <p className="text-gray-500">{swimmer.swimGroup}</p>
//           <div className="flex items-center mt-2">
//             <Badge variant="secondary" className="mr-2">Level {swimmer.level}</Badge>
//             <Progress value={(swimmer.xp / swimmer.nextLevelXp) * 100} className="w-32" />
//             <span className="ml-2 text-sm text-gray-500">{swimmer.xp}/{swimmer.nextLevelXp} XP</span>
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="performance">
//         <TabsList>
//           <TabsTrigger value="performance">Performance</TabsTrigger>
//           <TabsTrigger value="goals">Goals</TabsTrigger>
//           <TabsTrigger value="achievements">Achievements</TabsTrigger>
//         </TabsList>

//         <TabsContent value="performance">
//           <Card>
//             <CardHeader>
//               <h2 className="text-xl font-semibold">Performance Metrics</h2>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={performanceData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="time" stroke="#8884d8" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="goals">
//           <Card>
//             <CardHeader>
//               <h2 className="text-xl font-semibold">Current Goals</h2>
//             </CardHeader>
//             <CardContent>
//               {swimmer.goals.map(goal => (
//                 <div key={goal.id} className="mb-4">
//                   <div className="flex justify-between items-center mb-2">
//                     <span>{goal.name}</span>
//                     <span>{goal.progress}%</span>
//                   </div>
//                   <Progress value={goal.progress} className="w-full" />
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="achievements">
//           <Card>
//             <CardHeader>
//               <h2 className="text-xl font-semibold">Achievements</h2>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {swimmer.achievements.map(achievement => (
//                   <div key={achievement.id} className="flex items-center p-2 bg-gray-100 rounded-lg">
//                     <span className="text-2xl mr-2">{achievement.icon}</span>
//                     <span>{achievement.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-4">
//             <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
//             <span className="text-sm font-semibold">Top Performer</span>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-4">
//             <Target className="h-8 w-8 text-green-500 mb-2" />
//             <span className="text-sm font-semibold">Goal Crusher</span>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-4">
//             <Heart className="h-8 w-8 text-red-500 mb-2" />
//             <span className="text-sm font-semibold">Team Spirit</span>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center p-4">
//             <Activity className="h-8 w-8 text-blue-500 mb-2" />
//             <span className="text-sm font-semibold">Consistent Effort</span>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default GamifiedSwimmerInterface;