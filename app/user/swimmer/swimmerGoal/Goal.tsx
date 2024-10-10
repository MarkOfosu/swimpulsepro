import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { 
  setSwimmerGoal, 
  updateGoalProgress, 
  fetchSwimmerGoals, 
  fetchSwimmerAchievements, 
  fetchGoalTypes,
  SwimmerGoal,
  Achievement,
  GoalType,
  NewGoal
} from '../functions/goalFunctions';
import AchievementCard from './AchievvementCard'
import styles from '../../../styles/Goals.module.css';

interface GoalProps {
  swimmerId: string;
}

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder: string;
  disabled?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, onBlur, placeholder, disabled }) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

const Goal: React.FC<GoalProps> = ({ swimmerId }) => {
  const [goals, setGoals] = useState<SwimmerGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goalTypes, setGoalTypes] = useState<GoalType[]>([]);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    goalTypeId: '',
    targetValue: undefined,
    initialTime: '',
    targetTime: '',
    event: '',
    startDate: '',
    endDate: '',
    unit: 'meters'
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

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await setSwimmerGoal(swimmerId, newGoal);
      setNewGoal({
        goalTypeId: '',
        targetValue: undefined,
        initialTime: '',
        targetTime: '',
        event: '',
        startDate: '',
        endDate: '',
        unit: '',
      });
      await loadData();
    } catch (error) {
      console.error('Error setting new goal:', error);
      setError('Failed to set new goal. Please try again.');
    }
  };

  const handleUpdateProgress = async (goalId: string, newValue: string | number) => {
    setError(null);
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) {
        throw new Error('Goal not found');
      }
      if (goal.status === 'completed' || goal.status === 'expired') {
        throw new Error('Cannot update a completed or expired goal');
      }

      await updateGoalProgress(
        goalId,
        newValue,
        new Date().toISOString().split('T')[0],
        'Progress update'
      );
      
      setCurrentTimes(prev => ({ ...prev, [goalId]: '' }));
      await loadData();
    } catch (error) {
      console.error('Error updating goal progress:', error);
      setError(error instanceof Error ? error.message : 'Failed to update progress. Please try again.');
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
              value={newGoal.event || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setNewGoal({ ...newGoal, event: e.target.value })}
            >
              <option value="">Select Event</option>
              <option value="50m_freestyle">50m Freestyle</option>
              <option value="100m_freestyle">100m Freestyle</option>
              {/* Add more events as needed */}
            </Select>
            <TimeInput
              value={newGoal.initialTime || ''}
              onChange={(value) => setNewGoal({ ...newGoal, initialTime: value })}
              onBlur={() => {
                const formattedTime = formatTimeInput(newGoal.initialTime || '');
                setNewGoal({ ...newGoal, initialTime: formattedTime });
              }}
              placeholder="Initial Time (MM:SS:CC)"
            />
            <TimeInput
              value={newGoal.targetTime || ''}
              onChange={(value) => setNewGoal({ ...newGoal, targetTime: value })}
              onBlur={() => {
                const formattedTime = formatTimeInput(newGoal.targetTime || '');
                setNewGoal({ ...newGoal, targetTime: formattedTime });
              }}
              placeholder="Target Time (MM:SS:CC)"
            />
          </>
        );
      case 'distance goal':
        return (
          <>
            <Input
              type="number"
              placeholder='Target Distance'
              value={newGoal.targetValue || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || undefined })}
            />
            <Select
              value={newGoal.unit || 'meters'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                setNewGoal({ ...newGoal, unit: e.target.value })}
            >
              <option value="meters">Meters</option>
              <option value="yards">Yards</option>
            </Select>
          </>
        );
      default:
        return (
          <Input
            type="number"
            placeholder='Target Distance'
            value={newGoal.targetValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || undefined })}
          />
        );
    }
  };

  const renderGoalProgress = (goal: SwimmerGoal) => {
    const isInactive = goal.status === 'completed' || goal.status === 'expired';
    
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
              disabled={isInactive}
            />
            <Button 
              onClick={() => handleUpdateProgress(goal.id, currentTimes[goal.id])}
              disabled={isInactive}
            >
              Update Time
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <p className={styles.targetText}>
            Target: {goal.target_value} {goal.unit }
          </p>
          <div className={styles.updateContainer}>
            <Input
              type="number"
              placeholder="Update Value"
              value={currentTimes[goal.id] || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setCurrentTimes(prev => ({ ...prev, [goal.id]: e.target.value }))}
              disabled={isInactive}
            />
            <Button 
              onClick={() => handleUpdateProgress(goal.id, parseFloat(currentTimes[goal.id]))}
              disabled={isInactive}
            >
              Update Progress
            </Button>
          </div>
        </>
      );
    }
  };

  const renderGoals = (status: 'in_progress' | 'completed' | 'expired') => {
    const filteredGoals = goals.filter(goal => goal.status === status);
    if (filteredGoals.length === 0) {
      return <p className={styles.emptyStateMessage}>You have no {status === 'in_progress' ? 'current' : status} goals.</p>;
    }
    return (
      <>
        {filteredGoals.map(goal => (
          <div key={goal.id} className={`${styles.goalItem} ${(goal.status === 'completed' || goal.status === 'expired') ? styles.inactiveGoal : ''}`}>
            <h3 className={styles.goalTitle}>{goal.goal_type.name}</h3>
            <p className={styles.goalStatus}>Status: {goal.status}</p>
            <div className={styles.progressContainer}>
              <Progress value={goal.progress} />
              <p className={styles.progressText}>Progress: {goal.progress.toFixed(2)}%</p>
            </div>
            {renderGoalProgress(goal)}
          </div>
        ))}
      </>
    );
  };

  const renderAchievements = () => {
    if (achievements.length === 0) {
      return <p className={styles.emptyStateMessage}>You haven't unlocked any achievements yet. Keep swimming!</p>;
    }
    return (
      <div className={styles.achievementsGrid}>
        {achievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.goalsWrapper}>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.tabsContainer}>
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Current Goals</TabsTrigger>
            <TabsTrigger value="completed">Completed Goals</TabsTrigger>
            <TabsTrigger value="new">Create New Goal</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <div className={styles.contentContainer}>
            <TabsContent value="current">
              <Card>
                <h2 className={styles.tabHeader}>Current Goals</h2>
                <CardContent className={styles.cardContent}>
                  {renderGoals('in_progress')}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="completed">
              <Card>
                <h2 className={styles.tabHeader}>Completed Goals</h2>
                <CardContent className={styles.cardContent}>
                  {renderGoals('completed')}
                  {renderGoals('expired')}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="new">
              <Card>
                <h2 className={styles.tabHeader}>Create New Goal</h2>
                <CardContent className={styles.cardContent}>
                  <form onSubmit={handleSetGoal} className={styles.form}>
                    <Select
                      value={newGoal.goalTypeId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedGoalType = goalTypes.find(gt => gt.id === e.target.value);
                        if (selectedGoalType) {
                          if (selectedGoalType.name.toLowerCase() === 'time improvement') {
                            setNewGoal({ ...newGoal, goalTypeId: e.target.value, targetValue: undefined, unit: '' });
                          } else if (selectedGoalType.name.toLowerCase() === 'distance goal') {
                            setNewGoal({ ...newGoal, goalTypeId: e.target.value, initialTime: '', targetTime: '', event: '', unit: 'meters' });
                          } else {
                            setNewGoal({ ...newGoal, goalTypeId: e.target.value, initialTime: '', targetTime: '', event: '', unit: '' });
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
            </TabsContent>
            <TabsContent value="achievements">
              <Card>
                <h2 className={styles.tabHeader}>Achievements</h2>
                <CardContent className={styles.cardContent}>
                  {renderAchievements()}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Goal;