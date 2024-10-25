// components/elements/swimResults/AddSwimResult.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { SwimEvent, SwimResult } from '../../../app/lib/types';
import { getSwimEventsForSwimmer } from '../../../app/lib/swimUtils';
import styles from '../../styles/AddSwimResult.module.css';

interface AddSwimResultProps {
  swimmerId: string;
  onSubmit: (result: Omit<SwimResult, 'id' | 'is_personal_best'>) => void;
}

export const AddSwimResult: React.FC<AddSwimResultProps> = ({ swimmerId, onSubmit }) => {
  const [meetName, setMeetName] = useState('');
  const [eventId, setEventId] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [events, setEvents] = useState<SwimEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getSwimEventsForSwimmer(swimmerId);
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, [swimmerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEvent = events.find(event => event.id === eventId);
    if (!selectedEvent) {
      console.error('Selected event not found');
      return;
    }
    onSubmit({
      swimmer_id: swimmerId,
      meet_name: meetName,
      event: selectedEvent.name,
      time,
      date: new Date(date),
      course: selectedEvent.course,
    });
    // Clear form
    setMeetName('');
    setEventId('');
    setTime('');
    setDate('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoSection}>
        <h2 className={styles.title}>Add New Result</h2>
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <h3>🏆 Track Your Progress</h3>
            <p>Every time counts! Record your race times to track your improvement and celebrate your achievements.</p>
          </div>
          <div className={styles.infoCard}>
            <h3>🎯 Set New Goals</h3>
            <p>Watch your progress charts update and see how close you are to reaching the next standard level!</p>
          </div>
          <div className={styles.infoCard}>
            <h3>💡 Pro Tips</h3>
            <ul>
              <li>Always double-check your times before submitting</li>
              <li>Include all meets, even practice ones</li>
              <li>Add results right after your races</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={meetName}
            onChange={(e) => setMeetName(e.target.value)}
            placeholder="Meet Name (e.g., Summer Championships 2024)"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            required
            className={styles.select}
          >
            <option value="">Select Your Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {`${event.name} (${event.course})`}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Your Time (MM:SS.ss)"
            pattern="^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)(\.\d{1,2})?$"
            required
            className={styles.input}
          />
          <span className={styles.inputHint}>Example: 1:23.45</span>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={styles.input}
          />
          <span className={styles.inputHint}>When did you swim this time?</span>
        </div>

        <button type="submit" className={styles.button}>
          Add Result 🎉
        </button>
      </form>
    </div>
  );
};

