import { useState, useEffect, RefObject } from 'react';

const useOffsetRight = (ref: RefObject<HTMLElement>): {offsetRight: number} => {
  const [offsetRight, setOffsetRight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const delayTiming = setTimeout(() => {
      if (ref.current) {
        setOffsetRight(ref.current.scrollWidth - ref.current.clientWidth);
      }
    }, 1000);

    return () => { clearTimeout(delayTiming) };
  }, []);

  return { offsetRight };
}

export default useOffsetRight;