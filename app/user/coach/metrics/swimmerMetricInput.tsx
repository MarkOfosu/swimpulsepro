import React, { useState, useEffect } from 'react';
import { createClient } from '../../../../utils/supabase/client';


const supabase = createClient();

// Reuse the Metric interface and enums from the previous artifact

// Define MetricType enum
enum MetricType {
  RoundBased = 'round_based',
  TimeBased = 'time_based',
  DistanceBased = 'distance_based',
}

enum CalculationMethod {
  Count = 'count',
  Sum = 'sum',
  Average = 'average',
}

interface Metric {
  id?: string;
  name: string;
  description: string;
  type: MetricType;
  calculationMethod: CalculationMethod;
  unit: string;
  parameters: Record<string, any>;
  group_id: string; // Add group_id
}

interface SwimGroup {
  id: string;
  name: string;
}

interface MetricDataInput {
  metric_id: string;
  swimmer_id: string;
  value: number | string;
  recorded_at: string;
}

const SwimmerMetricInput: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
 

  useEffect(() => {
    fetchSwimmerMetrics();
  }, []);

  const fetchSwimmerMetrics = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: swimmerData, error: swimmerError } = await supabase
        .from('swimmers')
        .select('group_id')
        .eq('id', user.id)
        .single();

      if (swimmerError) {
        console.error('Error fetching swimmer data:', swimmerError);
        return;
      }

      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('group_id', swimmerData.group_id);
    
      if (error) {
        console.error('Error fetching metrics:', error);
      } else {
        setMetrics(data);
      }
    }
  };

  const handleMetricSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = metrics.find(m => m.id === e.target.value);
    setSelectedMetric(selected || null);
    setMetricValues({});
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetricValues(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmitMetricData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetric) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let value: number | string;
    
    switch (selectedMetric.type) {
      case MetricType.RoundBased:
        value = parseInt(metricValues.rounds);
        break;
      case MetricType.TimeBased:
        value = metricValues.time;
        break;
      case MetricType.DistanceBased:
        value = parseFloat(metricValues.distance);
        break;
      default:
        value = '';
    }

    const metricData: MetricDataInput = {
      metric_id: selectedMetric.id!,
      swimmer_id: user.id,
      value: value,
      recorded_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('metric_results')
        .insert([metricData]);
      
      if (error) throw error;
      console.log('Metric data submitted successfully');
      setMetricValues({});
      // Show success message
    } catch (error) {
      console.error('Error submitting metric data:', error);
      // Show error message
    }
  };

  const renderMetricInput = () => {
    if (!selectedMetric) return null;

    switch (selectedMetric.type) {
      case MetricType.RoundBased:
        return (
          <input
            type="number"
            name="rounds"
            value={metricValues.rounds || ''}
            onChange={handleValueChange}
            placeholder="Number of Rounds"
            max={selectedMetric.parameters.maxRounds}
            required
          />
        );
      case MetricType.TimeBased:
        return (
          <input
            type="time"
            name="time"
            value={metricValues.time || ''}
            onChange={handleValueChange}
            step="0.01"
            required
          />
        );
      case MetricType.DistanceBased:
        return (
          <input
            type="number"
            name="distance"
            value={metricValues.distance || ''}
            onChange={handleValueChange}
            step="0.01"
            placeholder="Distance"
            required
          />
        );
      default:
        return null;
    }
  };

  return (
    
    <form onSubmit={handleSubmitMetricData}>
      <h2>Record Swim Metric</h2>
      <select onChange={handleMetricSelect} value={selectedMetric?.id || ''}>
        <option value="">Select a metric</option>
        {metrics.map(metric => (
          <option key={metric.id} value={metric.id}>{metric.name}</option>
        ))}
      </select>

      {selectedMetric && (
        <>
          <h3>{selectedMetric.name}</h3>
          <p>{selectedMetric.description}</p>
          {renderMetricInput()}
          <span>{selectedMetric.unit}</span>
          <button type="submit">Submit</button>
        </>
      )}
    </form>
  );
};

export default SwimmerMetricInput;