import React, { useRef, useEffect } from 'react';
import styles from '../../../styles/WorkoutPage.module.css';
import { WorkoutData } from '@app/lib/types';
import jsPDF from 'jspdf';

interface WorkoutDetailsProps {
  workout: WorkoutData;
  onClose: () => void;
}

const WorkoutDetailsModal: React.FC<WorkoutDetailsProps> = ({ workout, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const generatePDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;

    doc.setFontSize(20);
    doc.text('Workout Details', 10, yOffset);
    yOffset += 10;

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(workout.created_at || '').toLocaleDateString()}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Focus: ${workout.workout_data.focus || 'N/A'}`, 10, yOffset);
    yOffset += 10;
    doc.text(`Description: ${workout.workout_data.description || 'No description provided'}`, 10, yOffset);
    yOffset += 10;

    const addSection = (title: string, items: string[]) => {
      doc.setFontSize(14);
      doc.text(title, 10, yOffset);
      yOffset += 5;
      doc.setFontSize(12);
      items.forEach(item => {
        doc.text(`• ${item}`, 15, yOffset);
        yOffset += 5;
      });
      yOffset += 5;
    };

    addSection('Warmup:', workout.workout_data.warmup);
    addSection('Preset:', workout.workout_data.preset);
    addSection('Main Set:', workout.workout_data.main_set);
    addSection('Cooldown:', workout.workout_data.cooldown);

    doc.text(`Distance: ${workout.workout_data.distance || 'N/A'}`, 10, yOffset);
    yOffset += 5;
    doc.text(`Duration: ${workout.workout_data.duration || 'N/A'}`, 10, yOffset);
    yOffset += 5;
    doc.text(`Intensity: ${workout.workout_data.intensity || 'N/A'}`, 10, yOffset);

    doc.save(`workout_${workout.id}.pdf`);
  };

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.modalContent}>
        <h2>Workout Details</h2>
        <p><strong>Date:</strong> {new Date(workout.created_at || '').toLocaleDateString()}</p>
        <p><strong>Focus:</strong> {workout.workout_data.focus || 'N/A'}</p>
        <p><strong>Description:</strong> {workout.workout_data.description || 'No description provided'}</p>
        <h3>Warmup:</h3>
        <ul>
          {workout.workout_data.warmup.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h3>Preset:</h3>
        <ul>
          {workout.workout_data.preset.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h3>Main Set:</h3>
        <ul>
          {workout.workout_data.main_set.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h3>Cooldown:</h3>
        <ul>
          {workout.workout_data.cooldown.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p><strong>Distance:</strong> {workout.workout_data.distance || 'N/A'}</p>
        <p><strong>Duration:</strong> {workout.workout_data.duration || 'N/A'}</p>
        <p><strong>Intensity:</strong> {workout.workout_data.intensity || 'N/A'}</p>
        <div className={styles.modalButtons}>
          <button onClick={onClose}>Close</button>
          <button onClick={generatePDF}>Download PDF</button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailsModal;