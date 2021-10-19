import { useState, useEffect } from 'react';

const useCountdown = (atEnd: boolean, holdTimer: number): number => {
  const [ countdown, setCountdown ] = useState(holdTimer / 1000);
  let interval: ReturnType<typeof setInterval>;
  let timeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (atEnd) {
      interval = setInterval(() => {
        setCountdown(countdown => Number((countdown - 0.1).toFixed(1)));
      }, 100);
      timeout = setTimeout(() => {
        clearInterval(interval);
        clearTimeout(timeout);
      }, holdTimer);
    }

    if (!atEnd) {
      setCountdown(holdTimer / 1000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    }
  }, [atEnd]);

  return countdown;
}

export default useCountdown;