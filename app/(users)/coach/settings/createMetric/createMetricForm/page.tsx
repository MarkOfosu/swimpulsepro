import React, { useState } from 'react';
import { PerformanceIndicatorType, MeasurementCriteria, PerformanceIndicator } from '../../../../../lib/types';
import { measurementCriteria } from './MeasurementCriteria';
const CreateMetricForm: React.FC = () => {
  const [selectedIndicator, setSelectedIndicator] = useState<PerformanceIndicatorType | ''>('');
  const [formData, setFormData] = useState<Partial<PerformanceIndicator>>({ criteria: [] });

  const handleIndicatorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const indicatorType = event.target.value as PerformanceIndicatorType;
    setSelectedIndicator(indicatorType);
    setFormData({ ...formData, type: indicatorType, criteria: [] });
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const newCriteria = [...(formData.criteria || [])];
    newCriteria[index] = { ...newCriteria[index], [name]: value };
    setFormData({ ...formData, criteria: newCriteria });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Process form data (e.g., save to database)
    console.log('Submitted Data:', formData);
  };

  return (
    <div>
      <h2>Create New Metric</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Performance Indicator:
          <select value={selectedIndicator} onChange={handleIndicatorChange}>
            <option value="">--Select--</option>
            {Object.keys(measurementCriteria).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </label>
        {selectedIndicator && (
          <div>
            <label>
              Name of {selectedIndicator}:
              <input type="text" name="name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </label>
            <label>
              Description:
              <input type="text" name="description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </label>
            {measurementCriteria[selectedIndicator].map((criteria, index) => (
              <div key={index}>
                <label>
                  {criteria.question}
                  {criteria.type === 'select' ? (
                    <select name={`criteria-${index}`} onChange={(e) => handleInputChange(index, e)}>
                      <option value="">--Select--</option>
                      {criteria.options?.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={criteria.type}
                      name={`criteria-${index}`}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
        <button type="submit">Create Metric</button>
      </form>
    </div>
  );
};

export default CreateMetricForm;
