import { useState, useCallback } from 'react';

export function useLocalState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const next = value instanceof Function ? value(state) : value;
        setState(next);
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
    },
    [key, state]
  );

  return [state, setValue];
}
