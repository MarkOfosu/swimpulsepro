// utils/activityValidation.ts
import { ActivityFormData, ActivityValidationError } from '../app/lib/types';
export const validateActivity = (formData: ActivityFormData): ActivityValidationError | null => {
    const errors: ActivityValidationError = {};
    
    // Basic field validations
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }
  
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
  
    if (!formData.activity_type) {
      errors.activity_type = 'Activity type is required';
    }
  
    // Date validations
    const now = new Date();
    const startDate = new Date(formData.start_date);
    
    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    } else if (startDate < now) {
      errors.start_date = 'Start date must be in the future';
    }
  
    if (formData.end_date) {
      const endDate = new Date(formData.end_date);
      if (endDate < startDate) {
        errors.end_date = 'End date must be after start date';
      }
    }
  
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
  
    if (!formData.groups || formData.groups.length === 0) {
      errors.groups = 'At least one group must be selected';
    }
  
    // Additional details validations
    const { additional_details } = formData;
    if (!errors.additional_details) {
      errors.additional_details = {};
    }
  
    if (additional_details.capacity_limit) {
      const capacity = parseInt(additional_details.capacity_limit);
      if (isNaN(capacity) || capacity < 1) {
        errors.additional_details.capacity_limit = 'Capacity must be a positive number';
      }
    }
  
    if (additional_details.virtual_link && !isValidUrl(additional_details.virtual_link)) {
      errors.additional_details.virtual_link = 'Please enter a valid URL';
    }
  
    return Object.keys(errors).length > 0 ? errors : null;
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };