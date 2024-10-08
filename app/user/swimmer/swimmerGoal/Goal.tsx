import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../../../components/ui/Card'
import { Progress } from "../../../../components/ui/Progress";
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { 
  setSwimmerGoal, 
  updateGoalProgress, 
  fetchSwimmerGoals, 
  fetchSwimmerAchievements, 
  fetchGoalTypes,
  SwimmerGoal,
  Achievement,
  GoalType
} from '../functions/goalFunctions'
import styles from '../../../styles/Goals.module.css'

interface GoalProps {
  swimmerId: string;
}

type NewGoalBase = {
  goalTypeId: string;
  startDate: string;
  endDate: string;
};

type NumericGoal = NewGoalBase & {
  targetValue: number;
};

type TimeImprovementGoal = NewGoalBase & {
  targetTime: string;
  initialTime: string;
  event: string;
};

type NewGoal = NumericGoal | TimeImprovementGoal;

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, onBlur, placeholder }) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
    />
  );
};

const Goal: React.FC<GoalProps> = ({ swimmerId }) => {
  const [goals, setGoals] = useState<SwimmerGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goalTypes, setGoalTypes] = useState<GoalType[]>([]);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    goalTypeId: '',
    targetValue: 0,
    startDate: '',
    endDate: ''
  });
  const [currentTimes, setCurrentTimes] = useState<{ [goalId: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [swimmerId]);

  const loadData = async () => {
    try {
      const [goalsData, achievementsData, goalTypesData] = await Promise.all([
        fetchSwimmerGoals(swimmerId),
        fetchSwimmerAchievements(swimmerId),
        fetchGoalTypes()
      ]);
      setGoals(goalsData);
      setAchievements(achievementsData);
      setGoalTypes(goalTypesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    }
  };

  const formatTimeInput = (input: string): string => {
    const digits = input.replace(/\D/g, '').padStart(6, '0');
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4, 6)}`;
  };

  const parseTimeString = (timeString: string | undefined): number => {
    if (!timeString) return 0;
    const [minutes, seconds, centiseconds] = timeString.split(':').map(Number);
    return (minutes * 60) + seconds + (centiseconds / 100);
  };

  const formatTimeString = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const centiseconds = Math.round((totalSeconds % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await setSwimmerGoal(swimmerId, {
        ...newGoal,
        initialTime: (newGoal as TimeImprovementGoal).initialTime,
      });
      setNewGoal({
        goalTypeId: '',
        targetValue: 0,
        startDate: '',
        endDate: ''
      });
      await loadData();
    } catch (error) {
      console.error('Error setting new goal:', error);
      setError('Failed to set new goal. Please try again.');
    }
  };

  const handleUpdateProgress = async (goalId: string, newValue: string | number, goalTypeId: string) => {
    setError(null);
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) {
        throw new Error('Goal not found');
      }

      if (goal.goal_type.name.toLowerCase() === 'time improvement') {
        if (typeof newValue !== 'string') {
          throw new Error('Invalid time format');
        }
        const currentTimeSeconds = parseTimeString(newValue);
        const targetTimeSeconds = parseTimeString(goal.target_time);
        const initialTimeSeconds = parseTimeString(goal.initial_time);

        if (currentTimeSeconds > initialTimeSeconds) {
          throw new Error('New time cannot be slower than the initial time');
        }

        // Calculate progress
        const totalImprovement = initialTimeSeconds - targetTimeSeconds;
        const currentImprovement = initialTimeSeconds - currentTimeSeconds;
        const progress = Math.min(100, (currentImprovement / totalImprovement) * 100);

        await updateGoalProgress(
          goalId,
          newValue,
          new Date().toISOString().split('T')[0],
          'Progress update',
          progress
        );
        //set fields to empty
        setCurrentTimes(prev => ({ ...prev, [goalId]: '' }));
        
      } else {
        if (typeof newValue !== 'number' || newValue < 0) {
          throw new Error('Invalid numeric value');
        }
        const progress = Math.min(100, (newValue / goal.target_value!) * 100);
        await updateGoalProgress(
          goalId,
          newValue,
          new Date().toISOString().split('T')[0],
          'Progress update',
          progress
        );
      }
      await loadData();
    } catch (error) {
      console.error('Error updating goal progress:', error);
      setError(error instanceof Error ? error.message : 'Failed to update progress. Please try again.');
    }
  };

  const handleImproveTime = (goal: SwimmerGoal) => {
    const currentTime = currentTimes[goal.id];
    if (currentTime) {
      handleUpdateProgress(goal.id, currentTime, goal.goal_type.id);
    } else {
      setError('Please enter a current time');
    }
  };

  const renderGoalInputs = () => {
    const selectedGoalType = goalTypes.find(gt => gt.id === newGoal.goalTypeId);
    
    if (!selectedGoalType) return null;

    switch (selectedGoalType.name.toLowerCase()) {
      case 'time improvement':
        return (
          <>
            <Select
              value={(newGoal as TimeImprovementGoal).event || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setNewGoal({ ...newGoal, event: e.target.value } as TimeImprovementGoal)}
            >
              <option value="">Select Event</option>
              <option value="50m_freestyle">50m Freestyle</option>
              <option value="100m_freestyle">100m Freestyle</option>
              {/* Add more events as needed */}
            </Select>
            <TimeInput
              value={(newGoal as TimeImprovementGoal).initialTime || ''}
              onChange={(value) => setNewGoal({ ...newGoal, initialTime: value } as TimeImprovementGoal)}
              onBlur={() => {
                const formattedTime = formatTimeInput((newGoal as TimeImprovementGoal).initialTime || '');
                setNewGoal({ ...newGoal, initialTime: formattedTime } as TimeImprovementGoal);
              }}
              placeholder="Initial Time (MM:SS:CC)"
            />
            <TimeInput
              value={(newGoal as TimeImprovementGoal).targetTime || ''}
              onChange={(value) => setNewGoal({ ...newGoal, targetTime: value } as TimeImprovementGoal)}
              onBlur={() => {
                const formattedTime = formatTimeInput((newGoal as TimeImprovementGoal).targetTime || '');
                setNewGoal({ ...newGoal, targetTime: formattedTime } as TimeImprovementGoal);
              }}
              placeholder="Target Time (MM:SS:CC)"
            />
          </>
        );
      default:
        return (
          <Input
            type="number"
            placeholder={`Target ${selectedGoalType.measurement_unit}`}
            value={(newGoal as NumericGoal).targetValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || 0 } as NumericGoal)}
          />
        );
    }
  };

  const renderQuickUpdateButton = (goal: SwimmerGoal) => {
    if (typeof goal.target_value === 'number' && goal.target_value > 0) {
      const newValue = goal.target_value * 1.1;
      return (
        <Button 
          onClick={() => handleUpdateProgress(goal.id, newValue, goal.goal_type.id)}
        >
          Quick Update (+10%)
        </Button>
      );
    }
    return null;
  };

  const renderGoalProgress = (goal: SwimmerGoal) => {
    if (goal.goal_type.name.toLowerCase() === 'time improvement') {
      return (
        <>
          <p className={styles.targetText}>Event: {goal.event}</p>
          <p className={styles.targetText}>Initial Time: {goal.initial_time}</p>
          <p className={styles.targetText}>Target Time: {goal.target_time}</p>
          <div className={styles.updateContainer}>
            <TimeInput
              value={currentTimes[goal.id] || ''}
              onChange={(value) => setCurrentTimes(prev => ({ ...prev, [goal.id]: value }))}
              onBlur={() => {
                const formattedTime = formatTimeInput(currentTimes[goal.id] || '');
                setCurrentTimes(prev => ({ ...prev, [goal.id]: formattedTime }));
              }}
              placeholder="Current Time (MM:SS:CC)"
            />
            <Button onClick={() => handleImproveTime(goal)}>
              Update Time
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <p className={styles.targetText}>
            Target: {goal.target_value ?? 'Not set'} {goal.goal_type.measurement_unit}
          </p>
          <div className={styles.updateContainer}>
            <Input
              type="number"
              placeholder="Update Value"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value) && value > 0) {
                  handleUpdateProgress(goal.id, value, goal.goal_type.id);
                }
              }}
            />
            {renderQuickUpdateButton(goal)}
          </div>
        </>
      );
    }
  };

  return (
    <div className={styles.goalsContainer}>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <Card className={styles.card}>
        <CardHeader>Set New Goal</CardHeader>
        <CardContent>
          <form onSubmit={handleSetGoal} className={styles.form}>
            <Select
              value={newGoal.goalTypeId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const selectedGoalType = goalTypes.find(gt => gt.id === e.target.value);
                if (selectedGoalType) {
                  if (selectedGoalType.name.toLowerCase() === 'time improvement') {
                    setNewGoal({ goalTypeId: e.target.value, initialTime: '', targetTime: '', event: '', startDate: '', endDate: '' } as TimeImprovementGoal);
                  } else {
                    setNewGoal({ goalTypeId: e.target.value, targetValue: 0, startDate: '', endDate: '' } as NumericGoal);
                  }
                }
              }}
            >
              <option value="">Select Goal Type</option>
              {goalTypes.map(goalType => (
                <option key={goalType.id} value={goalType.id}>{goalType.name}</option>
              ))}
            </Select>
            {renderGoalInputs()}
            <Input
              type="date"
              placeholder="Start Date"
              value={newGoal.startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewGoal({ ...newGoal, startDate: e.target.value })}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={newGoal.endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewGoal({ ...newGoal, endDate: e.target.value })}
            />
            <Button type="submit">Set New Goal</Button>
          </form>
        </CardContent>
      </Card>

      <Card className={styles.card}>
        <CardHeader>Current Goals</CardHeader>
        <CardContent>
          {goals.map(goal => (
            <div key={goal.id} className={styles.goalItem}>
              <h3 className={styles.goalTitle}>{goal.goal_type.name}</h3>
              <div className={styles.progressContainer}>
                <Progress value={goal.progress} />
                <p className={styles.progressText}>Progress: {goal.progress.toFixed(2)}%</p>
              </div>
              {renderGoalProgress(goal)}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className={styles.card}>
        <CardHeader>Achievements</CardHeader>
        <CardContent>
          {achievements.map(achievement => (
            <div key={achievement.id} className={styles.achievementItem}>
              <h3 className={styles.achievementTitle}>{achievement.title}</h3>
              <p>{achievement.description}</p>
              <p className={styles.achievementDate}>Achieved on: {new Date(achievement.achieved_date).toLocaleDateString()}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Goal;