"use client";
import React, { useState } from 'react';

const CreateMetricForm = () => {
  const [metricType, setMetricType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxReps, setMaxReps] = useState('');
  const [goalTime, setGoalTime] = useState('');

  const handleMetricTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMetricType(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to submit the metric to the backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Metric Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Metric Type:
        <select value={metricType} onChange={handleMetricTypeChange}>
          <option value="reps">Reps</option>
          <option value="completion_status">Completion Status</option>
          <option value="goal_time">Goal Time</option>
        </select>
      </label>
      {metricType === 'reps' && (
        <label>
          Max Reps:
          <input type="number" value={maxReps} onChange={(e) => setMaxReps(e.target.value)} />
        </label>
      )}
      {metricType === 'goal_time' && (
        <label>
          Goal Time:
          <input type="time" step="1" value={goalTime} onChange={(e) => setGoalTime(e.target.value)} />
        </label>
      )}
      <button type="submit">Create Metric</button>
    </form>
  );
};

export default CreateMetricForm;
