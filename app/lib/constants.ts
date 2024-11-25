// app/lib/constants.ts

export const DELETION_REASONS = [
    { value: 'taking_break', label: 'Taking a break' },
    { value: 'not_useful', label: 'Not finding it useful' },
    { value: 'switching_team', label: 'Switching to another team' },
    { value: 'privacy_concerns', label: 'Privacy concerns' },
    { value: 'duplicate_account', label: 'Duplicate account' },
    { value: 'other', label: 'Other' }
  ] as const;
  
  export type DeletionReason = typeof DELETION_REASONS[number]['value'];
  
  export type DeletionReasonType = 'taking_break' | 'not_useful' | 'switching_team' | 'privacy_concerns' | 'duplicate_account' | 'other';

  export const ITEMS_PER_PAGE = 5;
