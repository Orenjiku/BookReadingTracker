import { useState, useEffect, RefObject } from 'react';

interface RefXITF {
  isRefXOverflowing: boolean;
}

const useIsXOverflow = (ref: RefObject<HTMLElement>): RefXITF => {
  const [isRefXOverflowing, setIsRefXOverflowing] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const delayTiming = setTimeout(() => {
      if (ref.current && ref.current.scrollWidth > ref.current.clientWidth) {
        setIsRefXOverflowing(true);
      }
    }, 1000);

    return () => { clearTimeout(delayTiming) };
  }, []);

  return {isRefXOverflowing};
}

export default useIsXOverflow;