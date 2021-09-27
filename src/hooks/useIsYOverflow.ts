import { useState, useEffect, RefObject } from 'react';

const useIsYOverflow = (ref: RefObject<HTMLElement>): {isRefYOverflowing: boolean} => {
  const [isRefYOverflowing, setIsRefYOverflowing] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const delayTiming = setTimeout(() => {
      if (ref.current && ref.current.scrollHeight > ref.current.clientHeight) {
        setIsRefYOverflowing(true);
      }
    }, 1000);

    return () => { clearTimeout(delayTiming) };
  }, []);

  return {isRefYOverflowing};
}

export default useIsYOverflow;