import { useState, useEffect } from 'react';

const useCountdown = (startTimer: number, trigger: boolean): number => {
  const [ countdownTimeRemaining, setCountdownTimeRemaining ] = useState(startTimer / 1000);
  let interval: ReturnType<typeof setInterval>;
  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (trigger) {
      interval = setInterval(() => {
        setCountdownTimeRemaining(countdown => Number((countdown - 0.1).toFixed(1)));
      }, 100);
      timeout = setTimeout(() => {
        clearInterval(interval);
        clearTimeout(timeout);
      }, startTimer);
    }

    if (!trigger) {
      setCountdownTimeRemaining(startTimer / 1000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [trigger]);

  return countdownTimeRemaining;
}

export default useCountdown;