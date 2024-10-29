import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@components/elements/Card";
import { Progress } from "@components/elements/Progress";
import { Button } from "@components/elements/Button";
import { Input } from "@components/elements/Input";
import { Select } from "@components/elements/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/elements/Tabs";
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
} from '../../../../api/goalFunctions';
import { getSwimEventsForSwimmer } from '../../../../api/swimUtils';
import { SwimEvent } from '../../../../lib/types';
import AchievementCard from './AchievementCard';
import { formatTimeInput, isValidTimeFormat } from '../../../../../utils/time';
import styles from '../../../../styles/Goals.module.css';
import { ProgressUpdate } from './ProgressUpdate';
import { Celebration, MOTIVATIONAL_MESSAGES } from './Celebration';


interface GoalProps {
  swimmerId: string;
}

interface FeedbackState {
  type: 'success' | 'error' | 'info' | null;
  message: string | null;
  isLoading: boolean;
}

interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void;
}

const LoadingSpinner = () => (
  <div className={styles.spinnerWrapper}>
    <svg
      className="animate-spin h-5 w-5 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

const FeedbackMessage = ({ feedback }: { feedback: FeedbackState }) => {
  if (!feedback.message) return null;

  const feedbackClass = {
    success: styles.feedbackSuccess,
    error: styles.feedbackError,
    info: styles.feedbackInfo,
    null: ''
  }[feedback.type || 'null'];

  return (
    <div className={`${styles.feedback} ${feedbackClass}`}>
      {feedback.isLoading && <LoadingSpinner />}
      <span>{feedback.message}</span>
    </div>
  );
};

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      onChange(value);
    };

    return (
      <Input
        {...props}
        pattern="^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)(\.\d{1,2})?$"
        onChange={handleChange}
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: null,
    isLoading: false
  });
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
  const [events, setEvents] = useState<SwimEvent[]>([]);

  // Refs
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setFeedback(prev => ({ ...prev, isLoading: true }));
        const fetchedEvents = await getSwimEventsForSwimmer(swimmerId);
        setEvents(fetchedEvents);
      } catch (error) {
        setFeedback({
          type: 'error',
          message: 'Failed to load events. Please try again.',
          isLoading: false
        });
      } finally {
        setFeedback(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchEvents();
  }, [swimmerId]);

 
  const loadData = async () => {
    try {
      setFeedback(prev => ({ ...prev, isLoading: true }));
      const [goalsData, achievementsData, goalTypesData] = await Promise.all([
        fetchSwimmerGoals(swimmerId),
        fetchSwimmerAchievements(swimmerId),
        fetchGoalTypes()
      ]);
      setGoals(goalsData);
      setAchievements(achievementsData);
      setGoalTypes(goalTypesData);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to load data. Please try again.',
        isLoading: false
      });
    } finally {
      setFeedback(prev => ({ ...prev, isLoading: false }));
    }
  };

  const validateForm = (): boolean => {
    setFeedback({ type: null, message: null, isLoading: false });
    
    if (!newGoal.goalTypeId) {
      setFeedback({
        type: 'error',
        message: 'Please select a goal type',
        isLoading: false
      });
      goalTypeRef.current?.focus();
      return false;
    }

    const selectedGoalType = goalTypes.find(gt => gt.id === newGoal.goalTypeId);
    if (!selectedGoalType) {
      setFeedback({
        type: 'error',
        message: 'Invalid goal type selected',
        isLoading: false
      });
      goalTypeRef.current?.focus();
      return false;
    }

    if (selectedGoalType.name.toLowerCase() === 'time improvement') {
      if (!newGoal.event) {
        setFeedback({
          type: 'error',
          message: 'Please select an event',
          isLoading: false
        });
        eventRef.current?.focus();
        return false;
      }
      if (!newGoal.initialTime) {
        setFeedback({
          type: 'error',
          message: 'Please enter an initial time',
          isLoading: false
        });
        initialTimeRef.current?.focus();
        return false;
      }
      if (!isValidTimeFormat(newGoal.initialTime)) {
        setFeedback({
          type: 'error',
          message: 'Initial time is in incorrect format and cannot be zero. Please use HH:MM:SS.ss',
          isLoading: false
        });
        initialTimeRef.current?.focus();
        return false;
      }
      if (!newGoal.targetTime) {
        setFeedback({
          type: 'error',
          message: 'Please enter a target time',
          isLoading: false
        });
        targetTimeRef.current?.focus();
        return false;
      }
      if (!isValidTimeFormat(newGoal.targetTime)) {
        setFeedback({
          type: 'error',
          message: 'Target time is in incorrect format and cannot be zero. Please use HH:MM:SS.ss',
          isLoading: false
        });
        targetTimeRef.current?.focus();
        return false;
      }
    } else {
      if (!newGoal.targetValue || newGoal.targetValue <= 0) {
        setFeedback({
          type: 'error',
          message: 'Please enter a valid target value',
          isLoading: false
        });
        targetValueRef.current?.focus();
        return false;
      }
    }

    if (!newGoal.startDate) {
      setFeedback({
        type: 'error',
        message: 'Please select a start date',
        isLoading: false
      });
      startDateRef.current?.focus();
      return false;
    }

    if (!newGoal.endDate) {
      setFeedback({
        type: 'error',
        message: 'Please select an end date',
        isLoading: false
      });
      endDateRef.current?.focus();
      return false;
    }

    if (new Date(newGoal.startDate) >= new Date(newGoal.endDate)) {
      setFeedback({
        type: 'error',
        message: 'End date must be after start date',
        isLoading: false
      });
      endDateRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSetGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab("new");
      return;
    }

    try {
      setFeedback({
        type: 'info',
        message: 'Creating your goal...',
        isLoading: true
      });

      await setSwimmerGoal(swimmerId, newGoal);
      
      setFeedback({
        type: 'success',
        message: 'Goal created successfully!',
        isLoading: false
      });

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

      // Clear success message after a delay
      setTimeout(() => {
        setFeedback({ type: null, message: null, isLoading: false });
      }, 3000);

    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to set new goal. Please try again.',
        isLoading: false
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, newValue: string | number) => {
    setFeedback({ type: null, message: null, isLoading: false });
    
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) {
        throw new Error('Goal not found');
      }
  
      // Add validation for empty input
      if (!newValue || newValue === '') {
        setFeedback({
          type: 'error',
          message: 'Please enter a value before updating progress',
          isLoading: false
        });
        return;
      }
  
      if (goal.status === 'completed' || goal.status === 'expired') {
        throw new Error('Cannot update a completed or expired goal');
      }
  
      if (goal.goal_type.name.toLowerCase() === 'time improvement') {
        if (!isValidTimeFormat(newValue.toString())) {
          setFeedback({
            type: 'error',
            message: 'Invalid time format. Please use HH:MM:SS.ss',
            isLoading: false
          });
          return;
        }
      } else {
        // For non-time goals, validate number input
        if (isNaN(Number(newValue)) || Number(newValue) <= 0) {
          setFeedback({
            type: 'error',
            message: 'Please enter a valid number greater than 0',
            isLoading: false
          });
          return;
        }
      }
  
      setFeedback({
        type: 'info',
        message: 'Updating progress...',
        isLoading: true
      });
  
      const result = await updateGoalProgress(
        goalId,
        newValue,
        new Date().toISOString().split('T')[0],
        'Progress update'
      );
  
      // Show motivational message for progress
      setProgressMessage(
        MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
      );
  
      // Clear message after 3 seconds
      setTimeout(() => setProgressMessage(null), 3000);
  
      // Check if there's a new achievement and show celebration
      if (result.newAchievement) {
        // Make sure the celebration appears after a slight delay
        setTimeout(() => {
          setCurrentAchievement(result.newAchievement);
          setShowCelebration(true);
        }, 500);
      }
        
      setCurrentTimes(prev => ({ ...prev, [goalId]: '' }));
      await loadData();
  
      setFeedback({
        type: 'success',
        message: 'Progress updated successfully!',
        isLoading: false
      });
  
      // Clear success message after a delay
      setTimeout(() => {
        setFeedback({ type: null, message: null, isLoading: false });
      }, 3000);
  
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update progress. Please try again.',
        isLoading: false
      });
    }
  };

  const getEventName = (eventId: string | number): string => {
    const event = events.find(e => e.id === eventId);
    return event ? `${event.name} (${event.course})` : eventId.toString();
  };

  const renderGoalInputs = () => {
    const selectedGoalType = goalTypes.find(gt => gt.id === newGoal.goalTypeId);
    
    if (!selectedGoalType) return null;

    switch (selectedGoalType.name.toLowerCase()) {
      case 'time improvement':
        return (
          <>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Swimming Event <span className={styles.required}>*</span>
              </label>
              <Select
                ref={eventRef}
                value={newGoal.event || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setNewGoal({ ...newGoal, event: e.target.value })}
              >
                <option value="">Select Your Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {`${event.name} (${event.course})`}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Your Current Time <span className={styles.required}>*</span>
              </label>
              <TimeInput
                ref={initialTimeRef}
                value={newGoal.initialTime || ''}
                onChange={(value) => setNewGoal({ ...newGoal, initialTime: value })}
                onBlur={() => {
                  const formattedTime = formatTimeInput(newGoal.initialTime || '');
                  setNewGoal({ ...newGoal, initialTime: formattedTime });
                }}
                placeholder="Format: HH:MM:SS.ss"
              />
              <span className={styles.inputHint}>Example: 00:01:25.81</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Your Goal Time <span className={styles.required}>*</span>
              </label>
              <TimeInput
                ref={targetTimeRef}
                value={newGoal.targetTime || ''}
                onChange={(value) => setNewGoal({ ...newGoal, targetTime: value })}
                onBlur={() => {
                  const formattedTime = formatTimeInput(newGoal.targetTime || '');
                  setNewGoal({ ...newGoal, targetTime: formattedTime });
                }}
                placeholder="Format: HH:MM:SS.ss"
              />
              <span className={styles.inputHint}>Example: 00:01:20.50</span>
            </div>
          </>
        );

      case 'distance goal':
        return (
          <>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Target Distance <span className={styles.required}>*</span>
              </label>
              <Input
                ref={targetValueRef}
                type="number"
                placeholder='Enter your distance goal'
                value={newGoal.targetValue || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || undefined })}
                min="0"
                step="0.01"
              />
               <span className={styles.inputHint}>Total distance over a period of time</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Distance Unit <span className={styles.required}>*</span>
              </label>
              <Select
                value={newGoal.unit || 'meters'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  setNewGoal({ ...newGoal, unit: e.target.value })}
              >
                <option value="meters">Meters</option>
                <option value="yards">Yards</option>
              </Select>
            </div>
          </>
        );

      default:
        return (
          <div className={styles.formGroup}>
            <label className={styles.inputLabel}>
              Target Sessions <span className={styles.required}>*</span>
            </label>
            <Input
              ref={targetValueRef}
              type="number"
              placeholder='Enter number of sessions'
              value={newGoal.targetValue || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) || undefined })}
              min="0"
              step="1"
            />
          </div>
        );
    }
  };

  const renderGoalProgress = (goal: SwimmerGoal) => {
    const isInactive = goal.status === 'completed' || goal.status === 'expired';
    
    if (goal.goal_type.name.toLowerCase() === 'time improvement') {
      const eventName = getEventName(goal.event ?? '');
      return (
        <>
          <p className={styles.targetText}>Event: {eventName}</p>
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
              placeholder="Your Time (HH:MM:SS.ss)"
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
            <p className={styles.goalStatus}>Status: {goal.status.split('_').join(' ')}</p>
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
      return <p className={styles.emptyStateMessage}>You have not unlocked any achievements yet. Keep swimming!</p>;
    }
    return (
      <div className={styles.achievementsGrid}>
        {achievements.map(achievement => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement}
            swimmerId={swimmerId}
          />
        ))}
      </div>
    );
  };
  return (
    <div className={styles.goalsWrapper}>
      {/* Loading Overlay */}
      {feedback.isLoading && (
        <div className={styles.loadingOverlay}>
          <LoadingSpinner />
        </div>
      )}
  
      {/* Celebration Overlay */}
      {showCelebration && currentAchievement && (
        <Celebration
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          achievement={currentAchievement}
        />
      )}
  
      <div className={styles.tabsContainer}>
        <Tabs defaultValue="current" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="current">Current Goals</TabsTrigger>
            <TabsTrigger value="completed">Completed Goals</TabsTrigger>
            <TabsTrigger value="new">Create New Goal</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          <div className={styles.contentContainer}>
            {/* General Feedback */}
            <FeedbackMessage feedback={feedback} />
            
            {/* Progress Update Message */}
            {progressMessage && (
              <ProgressUpdate message={progressMessage} />
            )}
  
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
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Goal Type <span className={styles.required}>*</span>
                      </label>
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
                    </div>
  
                    {renderGoalInputs()}
  
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        Start Date <span className={styles.required}>*</span>
                      </label>
                      <Input
                        ref={startDateRef}
                        type="date"
                        value={newGoal.startDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setNewGoal({ ...newGoal, startDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
  
                    <div className={styles.formGroup}>
                      <label className={styles.inputLabel}>
                        End Date <span className={styles.required}>*</span>
                      </label>
                      <Input
                        ref={endDateRef}
                        type="date"
                        value={newGoal.endDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setNewGoal({ ...newGoal, endDate: e.target.value })}
                        min={newGoal.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
  
                    <Button 
                      type="submit"
                      disabled={feedback.isLoading}
                    >
                      {feedback.isLoading ? 'Setting Goal...' : 'Set New Goal'}
                    </Button>
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
}

export default Goal;