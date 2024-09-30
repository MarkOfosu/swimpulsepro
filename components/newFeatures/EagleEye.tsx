import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../styles/EagleEye.module.css';

// Type definitions
type Swimmer = {
  id: number;
  name: string;
  pace: number;
  time: number;
  strokeRate: number;
  heartRate: number;
  distance: number;
};

type Standards = {
  pace: number;
  time: number;
  strokeRate: number;
  heartRate: number;
};

type HistoricalData = {
  week: string;
  avgPace: number;
  avgTime: number;
  avgStrokeRate: number;
  avgHeartRate: number;
};

// Mock data
const swimmers: Swimmer[] = [
  { id: 1, name: 'Alice', pace: 80, time: 120, strokeRate: 60, heartRate: 150, distance: 100 },
  { id: 2, name: 'Bob', pace: 78, time: 118, strokeRate: 58, heartRate: 155, distance: 100 },
  { id: 3, name: 'Charlie', pace: 82, time: 122, strokeRate: 62, heartRate: 145, distance: 100 },
  { id: 4, name: 'Diana', pace: 79, time: 119, strokeRate: 59, heartRate: 152, distance: 100 },
];

const historicalData: HistoricalData[] = [
  { week: 'Week 1', avgPace: 82, avgTime: 123, avgStrokeRate: 59, avgHeartRate: 153 },
  { week: 'Week 2', avgPace: 81, avgTime: 122, avgStrokeRate: 60, avgHeartRate: 152 },
  { week: 'Week 3', avgPace: 80, avgTime: 121, avgStrokeRate: 61, avgHeartRate: 151 },
  { week: 'Week 4', avgPace: 79, avgTime: 120, avgStrokeRate: 61, avgHeartRate: 150 },
];

const defaultStandards: Standards = {
  pace: 80,
  time: 120,
  strokeRate: 60,
  heartRate: 150,
};

const EagleEye: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<keyof Standards>('heartRate');
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [standards, setStandards] = useState<Standards>(defaultStandards);

  const getPerformanceClass = (value: number, standard: number): string => {
    return value >= standard ? styles.performanceGood : styles.performanceBad;
  };

  const metricIcons: Record<keyof Standards | 'distance', string> = {
    pace: '🏊',
    time: '⏱️',
    strokeRate: '💪',
    heartRate: '❤️',
    distance: '🏁',
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPace = (seconds: number): string => {
    return `${formatTime(seconds)}/100m`;
  };

  const handleStandardChange = (metric: keyof Standards, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setStandards(prev => ({
        ...prev,
        [metric]: numValue
      }));
    }
  };

  const resetStandards = () => {
    setStandards(defaultStandards);
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Swim Coach Dashboard</h1>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={styles.icon}>🏆</span>
            Quick Filters
          </h2>
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as keyof Standards)}
            className={styles.select}
          >
            <option value="pace">Pace</option>
            <option value="time">Time</option>
            <option value="strokeRate">Stroke Rate</option>
            <option value="heartRate">Heart Rate</option>
          </select>
          <button 
            onClick={() => setShowGoalSetting(!showGoalSetting)} 
            className={styles.button}
          >
            {showGoalSetting ? 'Hide' : 'Show'} Goal Setting
          </button>
          {showGoalSetting && (
            <div className={styles.goalSetting}>
              <h3>Set Goals</h3>
              {Object.entries(standards).map(([metric, value]) => (
                <div key={metric} className={styles.goalItem}>
                  <label htmlFor={metric}>{metric}: </label>
                  <input
                    type="number"
                    id={metric}
                    value={value}
                    onChange={(e) => handleStandardChange(metric as keyof Standards, e.target.value)}
                    className={styles.input}
                  />
                </div>
              ))}
              <button onClick={resetStandards} className={styles.button}>
                Reset to Default
              </button>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <span className={styles.icon}>📈</span>
            Team Performance Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgPace" stroke="#8884d8" name="Avg Pace" />
              <Line type="monotone" dataKey="avgTime" stroke="#82ca9d" name="Avg Time" />
              <Line type="monotone" dataKey="avgStrokeRate" stroke="#ffc658" name="Avg Stroke Rate" />
              <Line type="monotone" dataKey="avgHeartRate" stroke="#ff8042" name="Avg Heart Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span className={styles.icon}>🏊‍♂️</span>
          Real-time Swimmer Stats
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Distance</th>
                <th>Pace</th>
                <th>Time</th>
                <th>Stroke Rate</th>
                <th>Heart Rate</th>
              </tr>
            </thead>
            <tbody>
              {swimmers.map((swimmer) => (
                <tr key={swimmer.id} className={swimmer[selectedMetric] >= standards[selectedMetric] ? styles.highlightRow : ''}>
                  <td>{swimmer.name}</td>
                  <td>
                    <span className={styles.metricIcon}>{metricIcons.distance}</span>
                    {swimmer.distance}m
                  </td>
                  <td className={getPerformanceClass(swimmer.pace, standards.pace)}>
                    <span className={styles.metricIcon}>{metricIcons.pace}</span>
                    {formatPace(swimmer.pace)}
                  </td>
                  <td className={getPerformanceClass(swimmer.time, standards.time)}>
                    <span className={styles.metricIcon}>{metricIcons.time}</span>
                    {formatTime(swimmer.time)}
                  </td>
                  <td className={getPerformanceClass(swimmer.strokeRate, standards.strokeRate)}>
                    <span className={styles.metricIcon}>{metricIcons.strokeRate}</span>
                    {swimmer.strokeRate}
                  </td>
                  <td className={getPerformanceClass(swimmer.heartRate, standards.heartRate)}>
                    <span className={styles.metricIcon}>{metricIcons.heartRate}</span>
                    {swimmer.heartRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EagleEye;