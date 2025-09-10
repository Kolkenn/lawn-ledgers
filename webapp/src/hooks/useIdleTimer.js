import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to detect when a user has been idle for a specified duration.
 * @param {function} onIdle - The callback function to execute when the user becomes idle.
 * @param {number} idleTimeout - The inactivity timeout in milliseconds.
 */
const useIdleTimer = (onIdle, idleTimeout = 15 * 60 * 1000) => { // Default to 15 minutes
  const [isIdle, setIsIdle] = useState(false);
  const timeoutId = useRef(null);

  const resetTimer = () => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setIsIdle(true);
      onIdle(); // Execute the idle callback
    }, idleTimeout);
  };

  const handleActivity = () => {
    // If the user was idle, we don't need to do anything until they log back in.
    // But for a more advanced implementation, you could show a "welcome back" message.
    if (isIdle) return;

    resetTimer();
  };

  useEffect(() => {
    // List of events that indicate user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    // Set up event listeners
    events.forEach(event => window.addEventListener(event, handleActivity));

    // Initialize the timer
    resetTimer();

    // Cleanup function to remove event listeners and clear the timeout
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [onIdle, idleTimeout, isIdle]); // Rerun effect if dependencies change

  return isIdle;
};

export default useIdleTimer;