import React, { useState } from 'react';
import {InputResultsFormProps} from '../../../app/utils/types';

const InputResultsForm: React.FC<InputResultsFormProps> = ({ metric }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const calculateScore = (): number => {
    let score = 0;

    if (metric.type === 'Test Set') {
      if (metric.maxReps) {
        const maxReps = metric.maxReps;
        score = (parseInt(inputValue, 10) / maxReps) * 100;
      } else {
        score = inputValue === 'completed' ? 100 : inputValue === 'partial' ? 50 : 10;
      }
    } else if (metric.type === 'Goal Time') {
      const goalTime = metric.goalTime || "00:00";
      score = inputValue <= goalTime ? 100 : 0;
    }

    return score;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const computedScore = calculateScore();

    // Send the computed score to the backend
    fetch('/api/save-result', {
      method: 'POST',
      body: JSON.stringify({
        metricId: metric.id,
        swimmerId: metric.swimmerId,
        computedScore: computedScore,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {metric.name}:
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </label>
      <button type="submit">Submit Result</button>
    </form>
  );
};

export default InputResultsForm;
