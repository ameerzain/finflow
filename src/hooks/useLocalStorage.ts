
import { useState, useEffect } from 'react';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Silently handle localStorage errors (e.g., corrupted data)
      // In production, this prevents the app from crashing
      if (process.env.NODE_ENV === 'development') {
        console.error('LocalStorage read error:', error);
      }
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      // Silently handle localStorage errors (e.g., quota exceeded)
      // In production, this prevents the app from crashing
      // Users can export their data if storage becomes full
      if (process.env.NODE_ENV === 'development') {
        console.error('LocalStorage error:', error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
