
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={meetName}
        onChange={(e) => setMeetName(e.target.value)}
        placeholder="Meet Name"
        required
        className={styles.input}
      />
      <select 
        value={eventId} 
        onChange={(e) => setEventId(e.target.value)}
        required
        className={styles.select}
      >
        <option value="">Select Event</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {`${event.name} (${event.course})`}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Time (HH:MM:SS.ss)"
        pattern="^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)(\.\d{1,2})?$"
        required
        className={styles.input}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Add Result</button>
    </form>
  );
};