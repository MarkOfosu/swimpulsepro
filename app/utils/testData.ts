// utils/testData.js

// Swimmers' Performance Data
export const swimmersPerformanceData = [
  // Group A
  {
    swimmer: 'John Doe',
    date: '2024-07-01',
    metric: 'Time',
    value: 85, // Time in seconds
  },
  {
    swimmer: 'John Doe',
    date: '2024-07-08',
    metric: 'Time',
    value: 82,
  },
  {
    swimmer: 'John Doe',
    date: '2024-07-15',
    metric: 'Time',
    value: 80,
  },
  {
    swimmer: 'Jane Smith',
    date: '2024-07-01',
    metric: 'Time',
    value: 78,
  },
  {
    swimmer: 'Jane Smith',
    date: '2024-07-08',
    metric: 'Time',
    value: 77,
  },
  {
    swimmer: 'Jane Smith',
    date: '2024-07-15',
    metric: 'Time',
    value: 75,
  },
  // Group B
  {
    swimmer: 'Michael Brown',
    date: '2024-07-01',
    metric: 'Time',
    value: 88,
  },
  {
    swimmer: 'Michael Brown',
    date: '2024-07-08',
    metric: 'Time',
    value: 86,
  },
  {
    swimmer: 'Michael Brown',
    date: '2024-07-15',
    metric: 'Time',
    value: 84,
  },
  {
    swimmer: 'Emma Wilson',
    date: '2024-07-01',
    metric: 'Time',
    value: 92,
  },
  {
    swimmer: 'Emma Wilson',
    date: '2024-07-08',
    metric: 'Time',
    value: 90,
  },
  {
    swimmer: 'Emma Wilson',
    date: '2024-07-15',
    metric: 'Time',
    value: 89,
  },
];

// Swim Groups Data
export const swimGroupsData = [
  {
    groupName: 'Group A',
    coach: 'Coach Carter',
    members: ['John Doe', 'Jane Smith'],
    performanceMetrics: ['Test Set', 'Benchmark'],
  },
  {
    groupName: 'Group B',
    coach: 'Coach Anderson',
    members: ['Michael Brown', 'Emma Wilson'],
    performanceMetrics: ['Skill Assessment'],
  },
];

// Recent Activities Data
export const recentActivitiesData = [
  {
    activity: 'Freestyle Practice',
    date: '2024-07-10',
    swimmer: 'John Doe',
    outcome: 'Improved time by 5 seconds',
  },
  {
    activity: 'Backstroke Technique',
    date: '2024-07-12',
    swimmer: 'Jane Smith',
    outcome: 'Corrected form',
  },
  {
    activity: 'Freestyle Sprint',
    date: '2024-07-10',
    swimmer: 'Michael Brown',
    outcome: 'Achieved a new personal best',
  },
  {
    activity: 'Butterfly Endurance',
    date: '2024-07-12',
    swimmer: 'Emma Wilson',
    outcome: 'Improved stamina significantly',
  },
];

// Upcoming Events Data
export const upcomingEventsData = [
  {
    eventName: 'Summer Swim Meet',
    date: '2024-08-15',
    location: 'City Pool',
    participants: ['Group A', 'Group B'],
  },
  {
    eventName: 'Sprint Challenge',
    date: '2024-08-20',
    location: 'Outdoor Pool',
    participants: ['John Doe', 'Michael Brown'],
  },
];

// Additional Data (For Analytics Page)
export const groupPerformanceData = [
  {
    group: 'Group A',
    metric: 'Average Time (s)',
    value: 82,
  },
  {
    group: 'Group B',
    metric: 'Average Time (s)',
    value: 77,
  },
];

export const skillAssessmentData = {
  labels: ['Freestyle', 'Backstroke', 'Butterfly', 'Breaststroke'],
  datasets: [
    {
      label: 'John Doe',
      data: [85, 78, 82, 79],
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'Jane Smith',
      data: [90, 83, 85, 88],
      backgroundColor: 'rgba(255,99,132,0.4)',
      borderColor: 'rgba(255,99,132,1)',
    },
    {
      label: 'Michael Brown',
      data: [88, 80, 84, 82],
      backgroundColor: 'rgba(54,162,235,0.4)',
      borderColor: 'rgba(54,162,235,1)',
    },
    {
      label: 'Emma Wilson',
      data: [92, 89, 90, 88],
      backgroundColor: 'rgba(255,205,86,0.4)',
      borderColor: 'rgba(255,205,86,1)',
    },
  ],
};

export const achievementRateData = [
  {
    category: 'Goals Achieved',
    value: 70,
  },
  {
    category: 'Goals Missed',
    value: 30,
  },
];

export const activityTrendsData = [
  {
    date: '2024-07-01',
    activity: 'Freestyle',
    count: 15,
  },
  {
    date: '2024-07-03',
    activity: 'Backstroke',
    count: 12,
  },
  {
    date: '2024-07-05',
    activity: 'Butterfly',
    count: 10,
  },
  {
    date: '2024-07-07',
    activity: 'Breaststroke',
    count: 18,
  },
  {
    date: '2024-07-09',
    activity: 'Freestyle',
    count: 17,
  },
  {
    date: '2024-07-11',
    activity: 'Backstroke',
    count: 14,
  },
];
