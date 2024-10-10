import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
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
import AchievementCard from './AchievementCard';
import styles from '../../../styles/Goals.module.css';

interface GoalProps {
  swimmerId: string;
}

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ onChange, ...props }, ref) => {
    return (
      <Input
        {...props}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        ref={ref}
      />
    );
  }
);

TimeInput.displayName = 'TimeInput';

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
  const [activeTab, setActiveTab] = useState("current");

  const goalTypeRef = useRef<HTMLSelectElement>(null);
  const eventRef = useRef<HTMLSelectElement>(null);
  const initialTimeRef = useRef<HTMLInputElement>(null);
  const targetTimeRef = useRef<HTMLInputElement>(null);
  const targetValueRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

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

  // const isValidTimeFormat = (time: string): boolean => {
  //   const regex = /^([0-5][0-9]):([0-5][0-9]):([0-9][0-9])$/;
  //   return regex.test(time);
  // };
  const isValidTimeFormat = (time: string): boolean => {
    const regex = /^([0-5][0-9]):([0-5][0-9]):([0-9][0-9])$/;
    if (!regex.test(time)) return false;
  
    // Split the time string into minutes, seconds, and centiseconds
    const [minutes, seconds, centiseconds] = time.split(':').map(Number);
  
    // Check if all are zero
    if (minutes === 0 && seconds === 0 && centiseconds === 0) return false;
  
    return true;
  };
  
  

  const validateForm = (): boolean => {
    setError(null);
    if (!newGoal.goalTypeId) {
      setError('Please select a goal type');
      goalTypeRef.current?.focus();
      return false;
    }

    const selectedGoalType = goalTypes.find(gt => gt.id === newGoal.goalTypeId);
    if (!selectedGoalType) {
      setError('Invalid goal type selected');
      goalTypeRef.current?.focus();
      return false;
    }

    if (selectedGoalType.name.toLowerCase() === 'time improvement') {
      if (!newGoal.event) {
        setError('Please select an event');
        eventRef.current?.focus();
        return false;
      }
      if (!newGoal.initialTime) {
        setError('Please enter an initial time');
        initialTimeRef.current?.focus();
        return false;
      }
      if (!isValidTimeFormat(newGoal.initialTime)) {
        setError('Initial time is in incorrect format and cannot be zero. Please use MM:SS:CC');
        initialTimeRef.current?.focus();
        return false;
      }
      if (!newGoal.targetTime) {
        setError('Please enter a target time');
        targetTimeRef.current?.focus();
        return false;
      }
      if (!isValidTimeFormat(newGoal.targetTime)) {
        setError('Target time is in incorrect format and cannot be zero. Please use MM:SS:CC');
        targetTimeRef.current?.focus();
        return false;
      }
    } else {
      if (!newGoal.targetValue || newGoal.targetValue <= 0) {
        setError('Please enter a valid target value');
        targetValueRef.current?.focus();
        return false;
      }
    }

    if (!newGoal.startDate) {
      setError('Please select a start date');
      startDateRef.current?.focus();
      return false;
    }

    if (!newGoal.endDate) {
      setError('Please select an end date');
      endDateRef.current?.focus();
      return false;
    }

    if (new Date(newGoal.startDate) >= new Date(newGoal.endDate)) {
      setError('End date must be after start date');
      endDateRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setActiveTab("new");
      return;
    }

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
        unit: 'meters'
      });
      await loadData();
      setActiveTab("current");
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

      if (goal.goal_type.name.toLowerCase() === 'time improvement' && !isValidTimeFormat(newValue.toString())) {
        setError('Invalid time format. Please use MM:SS:CC');
        return;
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
              ref={eventRef}
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
              ref={initialTimeRef}
              value={newGoal.initialTime || ''}
              onChange={(value) => setNewGoal({ ...newGoal, initialTime: value })}
              onBlur={() => {
                const formattedTime = formatTimeInput(newGoal.initialTime || '');
                setNewGoal({ ...newGoal, initialTime: formattedTime });
              }}
              placeholder="Initial Time (MM:SS:CC)"
            />
            <TimeInput
              ref={targetTimeRef}
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
              ref={targetValueRef}
              type="number"
              placeholder='Target Distance'
              value={newGoal.targetValue || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || undefined })}
              min="0"
              step="0.01"
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
            ref={targetValueRef}
            type="number"
            placeholder='Target Value'
            value={newGoal.targetValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || undefined })}
            min="0"
            step="1"
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
            Target: {goal.target_value} {goal.unit}
          </p>
          <div className={styles.updateContainer}>
            <Input
              type="number"
              placeholder="Update Value"
              value={currentTimes[goal.id] || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setCurrentTimes(prev => ({ ...prev, [goal.id]: e.target.value }))}
              disabled={isInactive}
              min="0"
              step="0.01"
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
      <div className={styles.tabsContainer}>
        <Tabs defaultValue="current" onValueChange={setActiveTab}>
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
                  {error && <p className={styles.errorMessage}>{error}</p>}
                  <form onSubmit={handleSetGoal} className={styles.form}>
                    <Select
                      ref={goalTypeRef}
                      value={newGoal.goalTypeId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedGoalType = goalTypes.find(gt => gt.id === e.target.value);
                        if (selectedGoalType) {
                          if (selectedGoalType.name.toLowerCase() === 'time improvement') {
                            setNewGoal({ ...newGoal, goalTypeId: e.target.value, targetValue: undefined, unit: '' });
                          } else if (selectedGoalType.name.toLowerCase() === 'distance goal') {
                            setNewGoal({ ...newGoal, goalTypeId: e.target.value, initialTime: '', targetTime: '', event: '', unit: 'meters' });
                          } else {
                            setNewGoal({ ...newGoal, goalTypeId: e.target.value, initialTime: '', targetTime: '', event: '', unit: 'sessions' });
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
                      ref={startDateRef}
                      type="date"
                      placeholder="Start Date"
                      value={newGoal.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewGoal({ ...newGoal, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Input
                      ref={endDateRef}
                      type="date"
                      placeholder="End Date"
                      value={newGoal.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setNewGoal({ ...newGoal, endDate: e.target.value })}
                      min={newGoal.startDate || new Date().toISOString().split('T')[0]}
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