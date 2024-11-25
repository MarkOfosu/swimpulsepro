import { useState, useCallback } from 'react';
import { Notification } from '@/app/lib/types';

export function useNotification(duration = 3000) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  }, [duration]);

  return { notification, showNotification };
}