'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect user inactivity and trigger a logout
 * @param onLogout Callback function to trigger logout
 * @param timeoutMs Inactivity timeout in milliseconds (default: 1 hour)
 */
export function useInactivityTimer(onLogout: () => void, timeoutMs: number = 3600000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onLogout();
    }, timeoutMs);
  };

  useEffect(() => {
    // Events that signify user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Initial timer setup
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onLogout, timeoutMs]);
}
