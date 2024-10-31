
// components/elements/activities/CreateActivityModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { 
  X, Calendar, MapPin, Users, Info, 
  AlertCircle, Loader2 
} from 'lucide-react';
import { Button } from '@/components/elements/Button';
import { toast } from 'react-hot-toast';
import { 
  ActivityFormData, 
  ActivityType,
  ActivitySkillLevel,
  SwimGroup,
  ActivityValidationError
} from '../../../lib/types';
import styles from '../../../styles/CreateActivityModal.module.css';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: ActivityFormData) => Promise<void>;
  groups: SwimGroup[];
  initialData?: ActivityFormData;
}


const initialFormState: ActivityFormData = {
  title: '',
  description: '',
  activity_type: 'practice',
  start_date: '',
  end_date: null,
  location: '',
  groups: [],
  additional_details: {
    equipment_needed: '',
    preparation_notes: '',
    capacity_limit: '',
    skill_level: 'all',
    virtual_link: '',
    minimum_standard: '',
    recommended_standard: ''
  },
};

const activityTypes: { value: ActivityType; label: string }[] = [
  { value: 'practice', label: 'Practice Session' },
  { value: 'meet', label: 'Swim Meet' },
  { value: 'event', label: 'Team Event' },
  { value: 'time_trial', label: 'Time Trial' },
  { value: 'clinic', label: 'Swimming Clinic' },
  { value: 'social', label: 'Social Event' },
];

const skillLevels: { value: ActivitySkillLevel; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'B', label: 'B Standard' },
  { value: 'BB', label: 'BB Standard' },
  { value: 'A', label: 'A Standard' },
  { value: 'AA', label: 'AA Standard' },
  { value: 'AAA', label: 'AAA Standard' },
  { value: 'AAAA', label: 'AAAA Standard' },
];

// Validation function
const validateForm = (data: ActivityFormData): ActivityValidationError | null => {
  const errors: ActivityValidationError = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Description validation
  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }

  // Date validation
  const startDate = new Date(data.start_date);
  if (!data.start_date) {
    errors.start_date = 'Start date is required';
  } else if (startDate < new Date()) {
    errors.start_date = 'Start date must be in the future';
  }

  if (data.end_date) {
    const endDate = new Date(data.end_date);
    if (endDate <= startDate) {
      errors.end_date = 'End date must be after start date';
    }
  }

  // Location validation
  if (!data.location.trim()) {
    errors.location = 'Location is required';
  }

  // Groups validation
  if (data.groups.length === 0) {
    errors.groups = 'At least one group must be selected';
  }

  // Additional details validation
  if (data.additional_details.capacity_limit) {
    const capacity = parseInt(data.additional_details.capacity_limit);
    if (isNaN(capacity) || capacity < 1) {
      errors.additional_details = {
        ...errors.additional_details,
        capacity_limit: 'Capacity must be a positive number'
      };
    }
  }

  if (data.additional_details.virtual_link) {
    try {
      new URL(data.additional_details.virtual_link);
    } catch {
      errors.additional_details = {
        ...errors.additional_details,
        virtual_link: 'Please enter a valid URL'
      };
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  groups,
  initialData,
}) => {
  const [formData, setFormData] = useState<ActivityFormData>(initialData || initialFormState);
  const [errors, setErrors] = useState<ActivityValidationError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dirtyFields, setDirtyFields] = useState<Set<string>>(new Set());
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || initialFormState);
      setErrors(null);
      setDirtyFields(new Set());
    }
  }, [isOpen, initialData]);

  const markFieldAsDirty = (field: string) => {
    setDirtyFields(prev => new Set(prev).add(field));
  };

  const updateAdditionalDetails = (
    field: keyof ActivityFormData['additional_details'],
    value: string
  ) => {
    markFieldAsDirty(`additional_details.${field}`);
    setFormData({
      ...formData,
      additional_details: {
        ...formData.additional_details,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      // Show specific error messages
      if (validationErrors.groups) {
        toast.error('Please select at least one group');
      } else {
        toast.error('Please fix the errors before submitting');
      }
      return;
    }
  
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast.success(initialData ? 'Activity updated successfully' : 'Activity created successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting activity:', error);
      toast.error('Failed to save activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

    // Helper function to show field error
    const FieldError = ({ error }: { error?: string }) => {
        if (!error) return null;
        return (
          <div className={styles.errorMessage}>
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        );
      };
    
      return (
        <Dialog 
          open={isOpen} 
          onClose={(e) => {
            // Prevent accidental closure if form is dirty
            if (dirtyFields.size > 0) {
              const confirm = window.confirm('You have unsaved changes. Are you sure you want to close?');
              if (!confirm) return;
            }
            onClose();
          }}
          className={styles.modal}
        >
          <div className={styles.backdrop} aria-hidden="true" />
          <DialogPanel className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <DialogTitle className={styles.title}>
                {initialData ? 'Edit Activity' : 'Create New Activity'}
              </DialogTitle>
              <button 
                onClick={onClose} 
                className={styles.closeButton}
                disabled={isSubmitting}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
      
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Basic Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <Info className={styles.sectionIcon} size={20} />
                  Basic Information
                </h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        markFieldAsDirty('title');
                        setFormData({ ...formData, title: e.target.value });
                      }}
                      onBlur={() => {
                        const validationResult = validateForm({...formData});
                        setErrors(validationResult);
                      }}
                      placeholder="Enter activity title"
                      required
                      disabled={isSubmitting}
                      className={errors?.title ? styles.inputError : ''}
                      aria-invalid={errors?.title ? 'true' : 'false'}
                    />
                    <FieldError error={errors?.title} />
                  </div>
      
                  <div className={styles.formGroup}>
                    <label htmlFor="type">Activity Type *</label>
                    <select
                      id="type"
                      value={formData.activity_type}
                      onChange={(e) => {
                        markFieldAsDirty('activity_type');
                        setFormData({
                          ...formData,
                          activity_type: e.target.value as ActivityType
                        });
                      }}
                      required
                      disabled={isSubmitting}
                    >
                      {activityTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
      
                <div className={styles.formGroup}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => {
                      markFieldAsDirty('description');
                      setFormData({ ...formData, description: e.target.value });
                    }}
                    onBlur={() => {
                      const validationResult = validateForm({...formData});
                      setErrors(validationResult);
                    }}
                    placeholder="Enter activity description"
                    rows={3}
                    disabled={isSubmitting}
                    className={errors?.description ? styles.inputError : ''}
                  />
                  <FieldError error={errors?.description} />
                </div>
              </div>
      
              {/* Date and Location Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <Calendar className={styles.sectionIcon} size={20} />
                  Date and Location
                </h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="start_date">Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      id="start_date"
                      value={formData.start_date}
                      onChange={(e) => {
                        markFieldAsDirty('start_date');
                        setFormData({ ...formData, start_date: e.target.value });
                      }}
                      onBlur={() => {
                        const validationResult = validateForm({...formData});
                        setErrors(validationResult);
                      }}
                      required
                      disabled={isSubmitting}
                      className={errors?.start_date ? styles.inputError : ''}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <FieldError error={errors?.start_date} />
                  </div>
      
                  <div className={styles.formGroup}>
                    <label htmlFor="end_date">End Date & Time</label>
                    <input
                      type="datetime-local"
                      id="end_date"
                      value={formData.end_date || ''}
                      onChange={(e) => {
                        markFieldAsDirty('end_date');
                        setFormData({ ...formData, end_date: e.target.value || null });
                      }}
                      onBlur={() => {
                        const validationResult = validateForm({...formData});
                        setErrors(validationResult);
                      }}
                      disabled={isSubmitting}
                      className={errors?.end_date ? styles.inputError : ''}
                      min={formData.start_date}
                    />
                    <FieldError error={errors?.end_date} />
                  </div>
      
                  <div className={styles.formGroup}>
                    <label htmlFor="location">Location *</label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => {
                        markFieldAsDirty('location');
                        setFormData({ ...formData, location: e.target.value });
                      }}
                      onBlur={() => {
                        const validationResult = validateForm({...formData});
                        setErrors(validationResult);
                      }}
                      placeholder="Enter location"
                      required
                      disabled={isSubmitting}
                      className={errors?.location ? styles.inputError : ''}
                    />
                    <FieldError error={errors?.location} />
                  </div>
                </div>
              </div>
      
              {/* Additional Details Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <Info className={styles.sectionIcon} size={20} />
                  Additional Details
                </h3>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="equipment">Equipment Needed</label>
                    <input
                      type="text"
                      id="equipment"
                      value={formData.additional_details.equipment_needed}
                      onChange={(e) => {
                        markFieldAsDirty('additional_details.equipment_needed');
                        updateAdditionalDetails('equipment_needed', e.target.value);
                      }}
                      placeholder="Required equipment"
                      disabled={isSubmitting}
                    />
                  </div>
      
                  <div className={styles.formGroup}>
                    <label htmlFor="skill_level">Skill Level & Standards</label>
                    <div className={styles.multiSelect}>
                      <select
                        id="skill_level"
                        value={formData.additional_details.skill_level}
                        onChange={(e) => {
                          markFieldAsDirty('additional_details.skill_level');
                          updateAdditionalDetails('skill_level', e.target.value);
                        }}
                        disabled={isSubmitting}
                      >
                        {skillLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
      
                      {formData.additional_details.skill_level !== 'all' && (
                        <div className={styles.standardsGroup}>
                          <div className={styles.standardSelect}>
                            <label htmlFor="minimum_standard">Minimum Standard</label>
                            <select
                              id="minimum_standard"
                              value={formData.additional_details.minimum_standard}
                              onChange={(e) => updateAdditionalDetails('minimum_standard', e.target.value)}
                              disabled={isSubmitting}
                            >
                              <option value="">None</option>
                              {skillLevels
                                .filter(level => level.value !== 'all' && level.value !== 'beginner')
                                .map((level) => (
                                  <option key={level.value} value={level.value}>
                                    {level.label}
                                  </option>
                                ))}
                            </select>
                          </div>
      
                          <div className={styles.standardSelect}>
                            <label htmlFor="recommended_standard">Recommended Standard</label>
                            <select
                              id="recommended_standard"
                              value={formData.additional_details.recommended_standard}
                              onChange={(e) => updateAdditionalDetails('recommended_standard', e.target.value)}
                              disabled={isSubmitting || !formData.additional_details.minimum_standard}
                            >
                              <option value="">None</option>
                              {skillLevels
                                .filter(level => {
                                  const minStandard = formData.additional_details.minimum_standard;
                                  const levelIndex = skillLevels.findIndex(l => l.value === level.value);
                                  const minIndex = skillLevels.findIndex(l => l.value === minStandard);
                                  return levelIndex >= minIndex && level.value !== 'all' && level.value !== 'beginner';
                                })
                                .map((level) => (
                                  <option key={level.value} value={level.value}>
                                    {level.label}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
      
                  <div className={styles.formGroup}>
                    <label htmlFor="capacity">Capacity Limit</label>
                    <input
                      type="number"
                      id="capacity"
                      value={formData.additional_details.capacity_limit}
                      onChange={(e) => {
                        markFieldAsDirty('additional_details.capacity_limit');
                        updateAdditionalDetails('capacity_limit', e.target.value);
                      }}
                      onBlur={() => {
                        const validationResult = validateForm({...formData});
                        setErrors(validationResult);
                      }}
                      placeholder="Maximum participants"
                      min="1"
                      disabled={isSubmitting}
                      className={errors?.additional_details?.capacity_limit ? styles.inputError : ''}
                    />
                    <FieldError error={errors?.additional_details?.capacity_limit} />
                  </div>
      
                  <div className={styles.formGroup}>
                    <label htmlFor="virtual_link">Virtual Meeting Link</label>
                    <input
                      type="url"
                      id="virtual_link"
                      value={formData.additional_details.virtual_link}
                      onChange={(e) => {
                        markFieldAsDirty('additional_details.virtual_link');
                        updateAdditionalDetails('virtual_link', e.target.value);
                      }}
                      onBlur={() => {
                        const validationResult = validateForm({...formData});
                        setErrors(validationResult);
                      }}
                      placeholder="https://..."
                      disabled={isSubmitting}
                      className={errors?.additional_details?.virtual_link ? styles.inputError : ''}
                    />
                    <FieldError error={errors?.additional_details?.virtual_link} />
                  </div>
                </div>
      
                <div className={styles.formGroup}>
                  <label htmlFor="preparation">Preparation Notes</label>
                  <textarea
                    id="preparation"
                    value={formData.additional_details.preparation_notes}
                    onChange={(e) => {
                      markFieldAsDirty('additional_details.preparation_notes');
                      updateAdditionalDetails('preparation_notes', e.target.value);
                    }}
                    placeholder="Any special instructions or preparation details"
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
      
                {/* Group Selection Section */}
                <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                    <Users className={styles.sectionIcon} size={20} />
                    Assign Groups *
                </h3>
                <div className={`${styles.groupSelection} ${errors?.groups ? styles.groupSelectionError : ''}`}>
                    {groups.map((group) => (
                    <label key={group.id} className={styles.groupCheckbox}>
                        <input
                        type="checkbox"
                        checked={formData.groups.some(g => g.id === group.id)}
                        onChange={(e) => {
                            markFieldAsDirty('groups');
                            const updatedGroups = e.target.checked
                            ? [...formData.groups, group]
                            : formData.groups.filter(g => g.id !== group.id);
                            setFormData({ ...formData, groups: updatedGroups });
                            // Clear group error when at least one is selected
                            if (e.target.checked && errors?.groups) {
                            setErrors(prev => prev ? { ...prev, groups: undefined } : null);
                            }
                        }}
                        disabled={isSubmitting}
                        />
                        <span>{group.name}</span>
                    </label>
                    ))}
                </div>
                {errors?.groups && (
                    <div className={styles.errorMessage}>
                    <AlertCircle size={14} />
                    <span>{errors.groups}</span>
                    </div>
                )}
                </div>
      
              {/* Form Actions */}
              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                    >
                    {isSubmitting ? (
                        <>
                        <Loader2 className={styles.spinner} size={16} />
                        {initialData ? 'Updating...' : 'Creating...'}
                        </>
                    ) : (
                        <>{initialData ? 'Update Activity' : 'Create Activity'}</>
                    )}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </Dialog>
      );

}

  